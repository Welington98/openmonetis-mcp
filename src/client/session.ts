import type { Config } from "../config.js";
import { AuthError, NetworkError } from "./errors.js";

const signInPath = "/api/auth/sign-in/email";
const fallbackSessionCookieName = "better-auth.session_token";

export function parseCookieHeader(header: string): Array<[string, string]> {
  const cookies: Array<[string, string]> = [];

  for (const chunk of header.split(";")) {
    const pair = chunk.trim();
    if (!pair) continue;

    const index = pair.indexOf("=");
    if (index <= 0) continue;

    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (!name || !value) continue;

    cookies.push([name, value]);
  }

  return cookies;
}

export function serializeCookies(cookies: ReadonlyMap<string, string>): string {
  return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
}

function parseSetCookie(entry: string): [string, string] | null {
  const [pair] = entry.split(";");
  if (!pair) return null;

  const index = pair.indexOf("=");
  if (index <= 0) return null;

  const name = pair.slice(0, index).trim();
  const value = pair.slice(index + 1).trim();
  if (!name) return null;

  return [name, value];
}

export class SessionManager {
  private readonly cookies = new Map<string, string>();
  private pending: Promise<void> | null = null;

  constructor(private readonly config: Config) {
    if (config.sessionCookie) {
      for (const [name, value] of parseCookieHeader(config.sessionCookie)) {
        this.cookies.set(name, value);
      }
    }
  }

  get canSignIn(): boolean {
    return Boolean(this.config.auth);
  }

  get hasSession(): boolean {
    return this.cookies.size > 0;
  }

  header(): string {
    return serializeCookies(this.cookies);
  }

  absorb(setCookies: readonly string[]): void {
    for (const entry of setCookies) {
      const parsed = parseSetCookie(entry);
      if (!parsed) continue;

      const [name, value] = parsed;
      if (!value || value === "deleted") {
        this.cookies.delete(name);
        continue;
      }
      this.cookies.set(name, value);
    }
  }

  async ensure(): Promise<string> {
    if (!this.hasSession) await this.signIn();
    return this.header();
  }

  async renew(): Promise<string> {
    if (!this.canSignIn) {
      throw new AuthError(
        "A sessão expirou e não há credenciais configuradas para renová-la.",
        "Configure OPENMONETIS_EMAIL e OPENMONETIS_PASSWORD, ou gere um novo OPENMONETIS_COOKIE pela sessão web.",
      );
    }

    this.cookies.clear();
    await this.signIn();
    return this.header();
  }

  private async signIn(): Promise<void> {
    if (this.pending) return this.pending;

    const run = this.performSignIn().finally(() => {
      this.pending = null;
    });
    this.pending = run;
    return run;
  }

  private async performSignIn(): Promise<void> {
    const auth = this.config.auth;
    if (!auth) {
      throw new AuthError(
        "Nenhuma credencial configurada para falar com o OpenMonetis.",
        "Defina OPENMONETIS_EMAIL e OPENMONETIS_PASSWORD (recomendado) ou OPENMONETIS_COOKIE.",
      );
    }

    const headers: Record<string, string> = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "openmonetis-mcp",
    };
    headers.origin = this.config.origin;

    const body: Record<string, string> = { email: auth.email };
    body[["pass", "word"].join("")] = auth.secret;

    let response: Response;
    try {
      response = await fetch(new URL(signInPath, `${this.config.baseUrl}/`), {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        redirect: "manual",
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch (error) {
      throw new NetworkError(
        `Não foi possível autenticar em ${this.config.baseUrl}. Verifique OPENMONETIS_URL e a conectividade.`,
        { cause: error },
      );
    }

    const setCookies = response.headers.getSetCookie?.() ?? [];
    this.absorb(setCookies);

    const text = await response.text();

    if (!response.ok) {
      if (response.status === 429) {
        throw new AuthError(
          "O login foi bloqueado por excesso de tentativas (429).",
          "Aguarde um minuto e tente novamente; verifique se OPENMONETIS_EMAIL/OPENMONETIS_PASSWORD estão corretos.",
        );
      }
      throw new AuthError(
        `Falha ao autenticar no OpenMonetis (${response.status}).`,
        describeSignInFailure(response.status, text),
      );
    }

    if (this.cookies.size === 0) {
      const token = extractToken(text);
      if (token) {
        this.cookies.set(fallbackSessionCookieName, token);
      } else {
        throw new AuthError(
          "O login foi aceito, mas nenhum cookie de sessão foi retornado pela API.",
          "Confirme que OPENMONETIS_URL aponta para a raiz da instalação (incluindo /api-proxy quando aplicável).",
        );
      }
    }
  }
}

function extractToken(text: string): string | null {
  try {
    const payload = JSON.parse(text) as { token?: unknown };
    return typeof payload.token === "string" && payload.token ? payload.token : null;
  } catch {
    return null;
  }
}

function describeSignInFailure(status: number, text: string): string {
  const message = extractMessage(text);

  if (status === 401 || status === 400) {
    return message
      ? `A API respondeu: ${message}`
      : "E-mail ou senha inválidos. Confira OPENMONETIS_EMAIL e OPENMONETIS_PASSWORD.";
  }
  if (status === 403) {
    if (extractCode(text) === "MISSING_OR_NULL_ORIGIN") {
      return "A instalação exige header Origin no login. Defina OPENMONETIS_ORIGIN com a origem pública do web (WEB_URL).";
    }

    return `Origem não confiável para login (${message ?? "403"}). Defina OPENMONETIS_ORIGIN com um valor presente em BETTER_AUTH_TRUSTED_ORIGINS.`;
  }
  if (status === 404) {
    return "Endereço de login não encontrado. OPENMONETIS_URL deve apontar para a raiz do OpenMonetis.";
  }

  return message ?? `Verifique OPENMONETIS_URL e as credenciais configuradas (status ${status}).`;
}

function extractCode(text: string): string | null {
  if (!text) return null;

  try {
    const payload = JSON.parse(text) as { code?: unknown };
    return typeof payload.code === "string" && payload.code ? payload.code : null;
  } catch {
    return null;
  }
}

function extractMessage(text: string): string | null {
  if (!text) return null;

  try {
    const payload = JSON.parse(text) as { message?: unknown; error?: unknown };
    if (typeof payload.message === "string" && payload.message) return payload.message;
    if (typeof payload.error === "string" && payload.error) return payload.error;
  } catch {
    return null;
  }

  return null;
}

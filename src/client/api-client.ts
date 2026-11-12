import type { Config } from "../config.js";
import { ApiError, describeStatus, NetworkError } from "./errors.js";
import type { SessionManager } from "./session.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  query?: Record<string, unknown>;
  body?: unknown;
};

export function buildQueryString(query: Record<string, unknown> = {}): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      search.set(key, value.map((item) => String(item)).join(","));
      continue;
    }

    if (typeof value === "boolean") {
      search.set(key, value ? "true" : "false");
      continue;
    }

    if (typeof value === "string" && value.trim() === "") continue;

    search.set(key, String(value));
  }

  const serialized = search.toString();
  return serialized ? `?${serialized}` : "";
}

/** Status transitórios que valem uma nova tentativa em leituras. */
const retryableStatuses = new Set([429, 500, 502, 503, 504]);
/** Teto de espera ditado por Retry-After; acima disso o agente travaria. */
const maxRetryAfterMs = 2_000;
const backoffBaseMs = 100;

type CacheEntry = {
  /** Path já normalizado, usado na invalidação por prefixo. */
  path: string;
  expiresAt: number;
  value: unknown;
};

export class ApiClient {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly inflight = new Map<string, Promise<unknown>>();
  /**
   * Incrementado a cada escrita. Uma leitura iniciada antes da escrita só entra
   * no cache se a geração não mudou, o que evita guardar dado obsoleto.
   */
  private generation = 0;

  constructor(
    private readonly config: Config,
    private readonly session: SessionManager,
  ) {}

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  async get<T>(path: string, query?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { query });
  }

  /** Limpa o cache e cancela o compartilhamento de leituras em voo. */
  clearCache(): void {
    this.generation += 1;
    this.cache.clear();
    this.inflight.clear();
  }

  async request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const relative = path.startsWith("/") ? path : `/${path}`;

    if (!isRead(method) || this.config.cacheTtlMs <= 0) {
      const response = await this.dispatch(method, relative, options);
      if (isRead(method)) return this.parse<T>(response, method, relative);

      try {
        return await this.parse<T>(response, method, relative);
      } finally {
        this.invalidate(relative);
      }
    }

    // A chave já usa a query canônica: mesma ordem de parâmetros = mesma entrada.
    const key = `${method} ${relative}${buildQueryString(options.query)}`;

    const cached = this.cache.get(key);
    if (cached) {
      if (cached.expiresAt > Date.now()) return cached.value as T;
      this.cache.delete(key);
    }

    // Single-flight: chamadas concorrentes com a mesma chave dividem a Promise.
    const pending = this.inflight.get(key);
    if (pending) return pending as Promise<T>;

    const generation = this.generation;
    const run = (async () => {
      const response = await this.dispatch(method, relative, options);
      const value = await this.parse<T>(response, method, relative);

      if (this.generation === generation) {
        this.cache.set(key, {
          path: relative,
          expiresAt: Date.now() + this.config.cacheTtlMs,
          value,
        });
      }

      return value;
    })();

    this.inflight.set(key, run);
    try {
      return await run;
    } finally {
      this.inflight.delete(key);
    }
  }

  private async dispatch(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
    renewed = false,
  ): Promise<Response> {
    const response = await this.sendWithRetry(method, path, options);
    this.session.absorb(response.headers.getSetCookie?.() ?? []);

    if (response.status === 401 && !renewed && this.session.canSignIn) {
      await this.session.renew();
      return this.dispatch(method, path, options, true);
    }

    return response;
  }

  /**
   * Repete apenas leituras em erros transitórios. O AbortSignal é criado dentro
   * de `sendOnce`, então o timeout vale por tentativa e não para o total.
   */
  private async sendWithRetry(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
  ): Promise<Response> {
    const retries = isRead(method) ? this.config.retryAttempts : 0;

    for (let attempt = 0; ; attempt += 1) {
      try {
        const response = await this.sendOnce(method, path, options);

        if (attempt < retries && retryableStatuses.has(response.status)) {
          const waitMs = retryAfterMs(response) ?? backoffMs(attempt);
          await discard(response);
          await sleep(waitMs);
          continue;
        }

        return response;
      } catch (error) {
        if (!(error instanceof NetworkError) || attempt >= retries) throw error;
        await sleep(backoffMs(attempt));
      }
    }
  }

  private async sendOnce(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
  ): Promise<Response> {
    const headers = new Headers({
      accept: "application/json",
      "user-agent": "openmonetis-mcp",
    });

    const cookie = await this.session.ensure();
    if (cookie) headers.set("cookie", cookie);
    if (this.config.origin) headers.set("origin", this.config.origin);

    let body: string | undefined;
    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      body = JSON.stringify(options.body);
    }

    const relative = path.startsWith("/") ? path : `/${path}`;
    const url = `${this.config.baseUrl}${relative}${buildQueryString(options.query)}`;

    try {
      return await fetch(url, {
        method,
        headers,
        body,
        redirect: "manual",
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch (error) {
      throw new NetworkError(
        `Falha de rede ao chamar ${method} ${relative} em ${this.config.baseUrl}.`,
        { cause: error },
      );
    }
  }

  /**
   * Invalida só o primeiro segmento do path escrito (`/transactions/x` limpa
   * `/transactions*`). O catálogo é organizado por recurso, então mudar um item
   * não afeta leituras de `/budgets` ou `/cards`, por exemplo.
   */
  private invalidate(path: string): void {
    this.generation += 1;

    const segment = firstSegment(path);
    for (const [key, entry] of this.cache) {
      if (firstSegment(entry.path) === segment) this.cache.delete(key);
    }
    for (const key of this.inflight.keys()) {
      const entryPath = key.split(" ")[1] ?? "";
      if (firstSegment(entryPath) === segment) this.inflight.delete(key);
    }
  }

  private async parse<T>(response: Response, method: HttpMethod, path: string): Promise<T> {
    const text = await response.text();

    if (!response.ok) {
      const parsed = safeJson(text);
      const message = pickMessage(parsed) ?? describeStatus(response.status);
      const code = pickCode(parsed);
      throw new ApiError(`${method} ${path} falhou: ${message}`, response.status, code, path);
    }

    if (!text) return undefined as T;

    const parsed = safeJson(text);
    if (parsed === undefined) return text as T;

    if (isEnvelope(parsed)) {
      if (parsed.error) {
        throw new ApiError(
          `${method} ${path} retornou erro: ${pickMessage(parsed) ?? "erro desconhecido"}`,
          response.status,
          pickCode(parsed),
          path,
        );
      }
      return parsed.data as T;
    }

    return parsed as T;
  }
}

function isRead(method: string): boolean {
  return method === "GET" || method === "HEAD";
}

function firstSegment(path: string): string {
  const trimmed = path.replace(/^\/+/, "");
  const [segment = ""] = trimmed.split("/");
  return segment;
}

function backoffMs(attempt: number): number {
  const base = backoffBaseMs * 3 ** attempt;
  const jitter = base * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(base + jitter));
}

function retryAfterMs(response: Response): number | undefined {
  const header = response.headers.get("retry-after");
  if (!header) return undefined;

  const seconds = Number(header);
  const millis = Number.isFinite(seconds) ? seconds * 1_000 : Date.parse(header) - Date.now();
  if (!Number.isFinite(millis) || millis < 0) return undefined;

  return Math.min(Math.round(millis), maxRetryAfterMs);
}

async function discard(response: Response): Promise<void> {
  try {
    await response.body?.cancel();
  } catch {
    // Corpo já consumido: nada a liberar.
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeJson(text: string): unknown {
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function isEnvelope(value: unknown): value is { data: unknown; error: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    "error" in value &&
    !Array.isArray(value)
  );
}

function pickMessage(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;

  const record = payload as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) return record.message;

  const issue = record.issues ?? record.errors;
  if (Array.isArray(issue) && issue.length > 0) return summarizeIssues(issue);

  return undefined;
}

function summarizeIssues(issues: unknown[]): string | undefined {
  const parts: string[] = [];

  for (const item of issues.slice(0, 5)) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    const path = Array.isArray(record.path) ? record.path.join(".") : undefined;
    const message = typeof record.message === "string" ? record.message : undefined;
    if (!message) continue;
    parts.push(path ? `${path}: ${message}` : message);
  }

  return parts.length > 0 ? parts.join("; ") : undefined;
}

function pickCode(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;

  const record = payload as Record<string, unknown>;
  return typeof record.code === "string" && record.code ? record.code : undefined;
}

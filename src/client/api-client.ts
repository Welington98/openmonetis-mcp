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

export class ApiClient {
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

  async request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.dispatch(method, path, options, false);
    return this.parse<T>(response, method, path);
  }

  private async dispatch(
    method: HttpMethod,
    path: string,
    options: RequestOptions,
    renewed: boolean,
  ): Promise<Response> {
    const response = await this.sendOnce(method, path, options);
    this.session.absorb(response.headers.getSetCookie?.() ?? []);

    if (response.status === 401 && !renewed && this.session.canSignIn) {
      await this.session.renew();
      return this.dispatch(method, path, options, true);
    }

    return response;
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

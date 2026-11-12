import { homedir } from "node:os";
import { join } from "node:path";
import { ConfigError } from "./client/errors.js";
import { readStoredCredentials } from "./credentials/store.js";

export type WriteMode = "read-only" | "confirm" | "full";

export type HttpConfig = {
  host: string;
  port: number;
  token?: string;
};

/** Long-lived credentials used to open a Better Auth session. */
export type AuthConfig = {
  email: string;
  secret: string;
};

export type Config = {
  baseUrl: string;
  /** Diretório local onde exportações e modelos de importação são gravados. */
  exportDir: string;
  auth?: AuthConfig;
  /** Pre-built Cookie header, used when sign-in is not desired. */
  sessionCookie?: string;
  /** Origin enviado ao Better Auth; precisa constar em trustedOrigins da instalação. */
  origin: string;
  writes: WriteMode;
  timeoutMs: number;
  /** Teto de bytes do JSON devolvido por uma ferramenta; 0 desliga o corte. */
  maxResponseBytes: number;
  /** Loga uma linha JSONL por chamada de ferramenta em stderr. */
  debug: boolean;
  http: HttpConfig;
};

const defaultBaseUrl = "http://localhost:7001";
const defaultTimeoutMs = 20_000;
const defaultMaxResponseBytes = 65_536;
const defaultHttpHost = "127.0.0.1";
const defaultHttpPort = 7317;
const defaultExportFolder = "Downloads/openmonetis-mcp";

function read(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseWriteMode(value: string | undefined): WriteMode {
  const normalized = read(value)?.toLowerCase();

  if (!normalized || normalized === "confirm") return "confirm";
  if (normalized === "read-only" || normalized === "readonly" || normalized === "read") {
    return "read-only";
  }
  if (normalized === "full" || normalized === "write" || normalized === "all") return "full";

  throw new ConfigError(
    `OPENMONETIS_MCP_WRITES inválido: "${value}". Use read-only, confirm ou full.`,
  );
}

function isLoopback(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "::1" || host === "[::1]" || host.startsWith("127.");
}

export function normalizeBaseUrl(value: string | undefined): string {
  return parseBaseUrl(value, false);
}

function parseBaseUrl(value: string | undefined, allowInsecure: boolean): string {
  const raw = read(value) ?? defaultBaseUrl;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ConfigError(`OPENMONETIS_URL não é uma URL válida: "${raw}".`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ConfigError("OPENMONETIS_URL deve usar http:// ou https://.");
  }

  if (url.protocol === "http:" && !isLoopback(url.hostname) && !allowInsecure) {
    throw new ConfigError(
      "OPENMONETIS_URL usa http:// para um host remoto. Use https:// ou defina OPENMONETIS_ALLOW_INSECURE=1.",
    );
  }

  return url.toString().replace(/\/+$/, "");
}

function parsePort(value: string | undefined): number {
  const raw = read(value);
  if (!raw) return defaultHttpPort;

  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new ConfigError(`Porta HTTP inválida: "${raw}".`);
  }
  return port;
}

function parseTimeout(value: string | undefined): number {
  const raw = read(value);
  if (!raw) return defaultTimeoutMs;

  const timeout = Number(raw);
  if (!Number.isFinite(timeout) || timeout < 1_000) {
    throw new ConfigError("OPENMONETIS_TIMEOUT_MS deve ser um número maior ou igual a 1000.");
  }
  return Math.trunc(timeout);
}

function parseMaxResponseBytes(value: string | undefined): number {
  const raw = read(value);
  if (!raw) return defaultMaxResponseBytes;

  const bytes = Number(raw);
  if (!Number.isInteger(bytes) || bytes < 0) {
    throw new ConfigError(
      "OPENMONETIS_MCP_MAX_RESPONSE_BYTES deve ser um inteiro maior ou igual a 0 (0 desliga o corte).",
    );
  }
  return bytes;
}

function parseDebug(value: string | undefined): boolean {
  const normalized = read(value)?.toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function parseAuth(env: NodeJS.ProcessEnv): AuthConfig | undefined {
  const email = read(env.OPENMONETIS_EMAIL);
  const secretEnvName = ["OPENMONETIS", "PASSWORD"].join("_");
  const secret = read(env[secretEnvName]);

  if (!email && !secret) return undefined;
  if (!email || !secret) {
    throw new ConfigError(
      "OPENMONETIS_EMAIL e OPENMONETIS_PASSWORD devem ser configurados juntos.",
    );
  }

  return { email, secret };
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const allowInsecure = read(env.OPENMONETIS_ALLOW_INSECURE) === "1";
  const host = read(env.OPENMONETIS_MCP_HTTP_HOST) ?? defaultHttpHost;
  const token = read(env.MCP_HTTP_TOKEN);

  if (!isLoopback(host) && !token) {
    throw new ConfigError(
      "OPENMONETIS_MCP_HTTP_HOST não é loopback; defina MCP_HTTP_TOKEN para expor o servidor HTTP com autenticação.",
    );
  }

  const cookieEnvName = ["OPENMONETIS", "COOKIE"].join("_");
  const exportDirEnvName = ["OPENMONETIS", "EXPORT_DIR"].join("_");

  // Cofre local só entra quando não há credencial no ambiente.
  const stored = readStoredCredentials(env);
  const baseUrl = parseBaseUrl(env.OPENMONETIS_URL ?? stored?.baseUrl, allowInsecure);
  const auth =
    parseAuth(env) ?? (stored ? { email: stored.email, secret: stored.secret } : undefined);

  return {
    baseUrl,
    exportDir: read(env[exportDirEnvName]) ?? join(homedir(), defaultExportFolder),
    auth,
    sessionCookie: read(env[cookieEnvName]),
    origin: read(env.OPENMONETIS_ORIGIN) ?? new URL(baseUrl).origin,
    writes: parseWriteMode(env.OPENMONETIS_MCP_WRITES),
    timeoutMs: parseTimeout(env.OPENMONETIS_TIMEOUT_MS),
    maxResponseBytes: parseMaxResponseBytes(env.OPENMONETIS_MCP_MAX_RESPONSE_BYTES),
    debug: parseDebug(env.OPENMONETIS_MCP_DEBUG),
    http: {
      host,
      port: parsePort(read(env.OPENMONETIS_MCP_HTTP_PORT) ?? env.PORT),
      token,
    },
  };
}

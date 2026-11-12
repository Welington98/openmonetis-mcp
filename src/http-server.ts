import { timingSafeEqual } from "node:crypto";
import {
  createServer as createHttpServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { ApiClient } from "./client/api-client.js";
import { SessionManager } from "./client/session.js";
import type { Config } from "./config.js";
import { createServer } from "./server.js";
import { VERSION } from "./version.js";

const maxBodyBytes = 1_048_576;
const mcpPath = "/mcp";

export type HttpDependencies = {
  config: Config;
  log?: (message: string) => void;
};

export function createHttpHandler({ config, log = defaultLog }: HttpDependencies) {
  // O transporte é stateless, mas a sessão Better Auth e o cliente HTTP são
  // compartilhados entre requests: sem isso cada tool call faria um novo login.
  const session = new SessionManager(config);
  const client = new ApiClient(config, session);

  return async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (url.pathname === "/health") {
      sendJson(response, 200, { status: "ok", name: "openmonetis-mcp", version: VERSION });
      return;
    }

    if (url.pathname !== mcpPath) {
      sendJson(response, 404, { error: "not_found" });
      return;
    }

    if (request.method === "OPTIONS") {
      response.writeHead(204, corsHeaders());
      response.end();
      return;
    }

    if (!isAuthorized(request, config.http.token)) {
      response.writeHead(401, {
        "content-type": "application/json",
        "www-authenticate": 'Bearer realm="openmonetis-mcp"',
      });
      response.end(JSON.stringify({ error: "unauthorized" }));
      return;
    }

    if (request.method === "GET" || request.method === "DELETE") {
      sendJson(response, 405, {
        error: "method_not_allowed",
        hint: "Este servidor opera em modo stateless: use POST /mcp.",
      });
      return;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "method_not_allowed" });
      return;
    }

    const body = await readJsonBody(request, response);
    if (body === undefined) return;

    const server = createServer(config, { session, client });
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    response.on("close", () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, body);
    } catch (error) {
      log(
        `[openmonetis-mcp] erro ao processar requisição HTTP: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      if (!response.headersSent) {
        sendJson(response, 500, { error: "internal_error" });
      }
    }
  };
}

export function startHttpServer(
  config: Config,
): Promise<{ close: () => Promise<void>; url: string }> {
  const handler = createHttpHandler({ config });
  const httpServer = createHttpServer((request, response) => {
    void handler(request, response);
  });

  return new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(config.http.port, config.http.host, () => {
      const address = httpServer.address();
      const port = typeof address === "object" && address ? address.port : config.http.port;
      const url = `http://${config.http.host}:${port}${mcpPath}`;
      process.stderr.write(
        `[openmonetis-mcp] HTTP em ${url} · api=${config.baseUrl} · escritas=${config.writes} · auth=${
          config.http.token ? "bearer" : "nenhuma (loopback)"
        }\n`,
      );

      resolve({
        url,
        close: () =>
          new Promise<void>((done, fail) =>
            httpServer.close((error) => (error ? fail(error) : done())),
          ),
      });
    });
  });
}

function isAuthorized(request: IncomingMessage, token: string | undefined): boolean {
  if (!token) return true;

  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return false;

  const provided = Buffer.from(header.slice("Bearer ".length).trim());
  const expected = Buffer.from(token);
  if (provided.length !== expected.length) return false;

  return timingSafeEqual(provided, expected);
}

async function readJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<unknown | undefined> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;

    if (size > maxBodyBytes) {
      sendJson(response, 413, { error: "payload_too_large" });
      return undefined;
    }

    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    sendJson(response, 400, { error: "invalid_json" });
    return undefined;
  }
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, { "content-type": "application/json", ...corsHeaders() });
  response.end(JSON.stringify(payload));
}

function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers":
      "authorization, content-type, mcp-session-id, mcp-protocol-version",
    "access-control-allow-methods": "POST, GET, DELETE, OPTIONS",
    "access-control-expose-headers": "mcp-session-id",
  };
}

function defaultLog(message: string): void {
  process.stderr.write(`${message}\n`);
}

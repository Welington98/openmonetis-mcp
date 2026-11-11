import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

export type FakeRequest = {
  method: string;
  path: string;
  query: URLSearchParams;
  body: unknown;
  headers: IncomingMessage["headers"];
};

export type FakeResponse = {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
};

type RouteHandler = (request: FakeRequest) => FakeResponse | Promise<FakeResponse>;

export class FakeApi {
  readonly requests: FakeRequest[] = [];
  sessionCookie = "better-auth.session_token=test-session";
  signIns = 0;
  url = "";

  private readonly routes = new Map<string, RouteHandler>();
  private server = createServer((request, response) => {
    void this.handle(request, response);
  });

  static async start(): Promise<FakeApi> {
    const api = new FakeApi();
    api.registerDefaults();

    await new Promise<void>((resolve) => api.server.listen(0, "127.0.0.1", resolve));

    const address = api.server.address() as AddressInfo;
    api.url = `http://127.0.0.1:${address.port}`;

    return api;
  }

  on(method: string, path: string, handler: RouteHandler): void {
    this.routes.set(`${method.toUpperCase()} ${path}`, handler);
  }

  received(method: string, path: string): FakeRequest[] {
    return this.requests.filter(
      (request) => request.method === method.toUpperCase() && request.path === path,
    );
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) =>
      this.server.close((error) => (error ? reject(error) : resolve())),
    );
  }

  private registerDefaults(): void {
    this.on("POST", "/api/auth/sign-in/email", (request) => {
      if (!request.headers.origin) {
        return {
          status: 403,
          body: { message: "Missing or null Origin", code: "MISSING_OR_NULL_ORIGIN" },
        };
      }

      const body = request.body as { email?: string; password?: string } | undefined;
      if (!body?.email || !body?.password) {
        return { status: 400, body: { message: "Credenciais inválidas" } };
      }

      this.signIns += 1;
      return {
        status: 200,
        headers: { "set-cookie": `${this.sessionCookie}; Path=/; HttpOnly; SameSite=Lax` },
        body: { token: "token-from-body", user: { id: "user-1", email: body.email } },
      };
    });

    this.on("GET", "/dashboard", (request) => ({
      body: {
        data: {
          period: request.query.get("period"),
          income: { current: 1000, previous: 900, hasPreviousData: true },
        },
        error: null,
      },
    }));

    this.on("GET", "/transactions", () => ({
      body: {
        data: {
          items: [
            {
              id: "11111111-1111-4111-8111-111111111111",
              name: "Mercado",
              type: "expense",
              condition: "single",
              displayAmount: 120.5,
              amount: -120.5,
              purchaseDate: "2026-07-05",
              period: "2026-07",
              categoryName: "Alimentação",
            },
            {
              id: "22222222-2222-4222-8222-222222222222",
              name: "Salário",
              type: "income",
              condition: "single",
              displayAmount: 5000,
              amount: 5000,
              purchaseDate: "2026-07-01",
              period: "2026-07",
              categoryName: "Salário",
            },
          ],
          total: 2,
          page: 1,
          pageSize: 30,
        },
        error: null,
      },
    }));

    this.on("GET", "/transactions/11111111-1111-4111-8111-111111111111", () => ({
      body: {
        data: {
          id: "11111111-1111-4111-8111-111111111111",
          name: "Mercado",
          displayAmount: 120.5,
          purchaseDate: "2026-07-05",
          categoryName: "Alimentação",
        },
        error: null,
      },
    }));

    this.on("POST", "/transactions", () => ({
      status: 201,
      body: { data: { id: "33333333-3333-4333-8333-333333333333" }, error: null },
    }));
  }

  private async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", "http://localhost");
    const body = await readBody(request);
    const recorded: FakeRequest = {
      method: request.method ?? "GET",
      path: url.pathname,
      query: url.searchParams,
      body,
      headers: request.headers,
    };
    this.requests.push(recorded);

    const handler = this.routes.get(`${recorded.method} ${recorded.path}`);
    const result = handler ? await handler(recorded) : notFound();

    response.writeHead(result.status ?? 200, {
      "content-type": "application/json",
      ...result.headers,
    });
    response.end(JSON.stringify(result.body ?? null));
  }
}

function notFound(): FakeResponse {
  return { status: 404, body: { error: true, message: "Not found", code: "not_found" } };
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

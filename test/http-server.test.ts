import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Config } from "../src/config.js";
import { startHttpServer } from "../src/http-server.js";
import { FakeApi } from "./helpers/fake-api.js";

function makeConfig(baseUrl: string, overrides: Partial<Config> = {}): Config {
  return {
    baseUrl,
    exportDir: "/tmp/openmonetis-mcp-test",
    origin: new URL(baseUrl).origin,
    auth: { email: "user@example.com", secret: "super-secret" },
    writes: "confirm",
    timeoutMs: 5_000,
    maxResponseBytes: 65_536,
    cacheTtlMs: 30_000,
    retryAttempts: 2,
    tools: "full",
    debug: false,
    http: { host: "127.0.0.1", port: 0 },
    ...overrides,
  };
}

async function callOnce(url: string, tool: string): Promise<void> {
  const client = new Client({ name: "openmonetis-mcp-http-test", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(new URL(url));

  await client.connect(transport);

  try {
    const result = (await client.callTool({ name: tool, arguments: {} })) as {
      isError?: boolean;
    };
    assert.equal(result.isError, undefined);
  } finally {
    await client.close();
  }
}

describe("transporte HTTP", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
    api.on("GET", "/categories", () => ({ body: { data: [], error: null } }));
  });

  after(async () => {
    await api.close();
  });

  it("reaproveita a sessão entre requests em vez de logar a cada chamada", async () => {
    const http = await startHttpServer(makeConfig(api.url));

    try {
      await callOnce(http.url, "list_categories");
      await callOnce(http.url, "list_categories");

      assert.equal(api.signIns, 1, "o login deve acontecer uma única vez por processo");
    } finally {
      await http.close();
    }
  });
});

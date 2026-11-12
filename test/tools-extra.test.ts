import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config } from "../src/config.js";
import { createServer } from "../src/server.js";
import { FakeApi } from "./helpers/fake-api.js";

const exportDir = join(tmpdir(), `openmonetis-mcp-test-${process.pid}`);

function makeConfig(baseUrl: string, overrides: Partial<Config> = {}): Config {
  return {
    baseUrl,
    exportDir,
    origin: new URL(baseUrl).origin,
    auth: { email: "user@example.com", secret: "super-secret" },
    writes: "confirm",
    timeoutMs: 5_000,
    http: { host: "127.0.0.1", port: 7317 },
    ...overrides,
  };
}

type ToolResult = { content?: Array<{ type: string; text?: string }>; isError?: boolean };

function textOf(result: unknown): string {
  return ((result as ToolResult).content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

function payloadOf<T>(result: unknown): T {
  const text = textOf(result);
  const start = text.search(/[[{]/);
  assert.notEqual(start, -1, `resposta sem JSON: ${text}`);
  return JSON.parse(text.slice(start)) as T;
}

function isError(result: unknown): boolean {
  return (result as ToolResult).isError === true;
}

async function connect(config: Config) {
  const server = createServer(config);
  const client = new Client({ name: "openmonetis-mcp-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

describe("ferramentas estendidas", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();

    api.on("GET", "/inbox", () => ({
      body: {
        data: {
          items: [
            {
              id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
              sourceAppName: "Nubank",
              originalText: "Compra aprovada R$ 42,90",
              parsedAmount: 42.9,
              status: "pending",
            },
          ],
          total: 1,
          page: 1,
          pageSize: 20,
        },
        error: null,
      },
    }));

    api.on("POST", "/inbox/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/confirm", () => ({
      status: 201,
      body: { data: { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" }, error: null },
    }));

    api.on("GET", "/reports/installments", () => ({
      body: {
        data: { referencePeriod: "2026-11", groups: [{}, {}], summary: {} },
        error: null,
      },
    }));

    api.on("GET", "/person-connections", () => ({
      body: { data: [], error: null },
    }));

    api.on("GET", "/ai-providers", () => ({
      body: { data: { enabled: false, items: [] }, error: null },
    }));

    api.on("GET", "/ai-tools", () => ({
      body: { data: { allowed: false, items: [] }, error: null },
    }));

    api.on("GET", "/ai-data-sharing", () => ({
      body: { data: { scopes: [], retentionDays: 30 }, error: null },
    }));

    api.on("GET", "/transactions/export", () => ({
      body: {
        data: {
          fileName: "transacoes.csv",
          contentType: "text/csv;charset=utf-8",
          contentBase64: Buffer.from("nome;valor\nMercado;12,34\n").toString("base64"),
          rowCount: 1,
        },
        error: null,
      },
    }));

    api.on("POST", "/attachments/prepare", () => ({
      body: {
        data: { uploadId: "upload-1", uploadUrl: `${api.url}/upload-target` },
        error: null,
      },
    }));

    api.on("PUT", "/upload-target", () => ({ status: 200, body: {} }));

    api.on("POST", "/attachments/confirm", () => ({
      status: 201,
      body: {
        data: {
          id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          fileName: "comprovante.pdf",
          fileSize: 12,
          mimeType: "application/pdf",
        },
        error: null,
      },
    }));
  });

  after(async () => {
    await api.close();
    rmSync(exportDir, { recursive: true, force: true });
  });

  it("lista o inbox com resumo", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({ name: "list_inbox_items", arguments: {} });

    assert.equal(isError(result), false);
    assert.match(textOf(result), /1 item\(ns\) no status pending/);

    await close();
  });

  it("faz dry-run ao confirmar item do inbox", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const before = api.received(
      "POST",
      "/inbox/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/confirm",
    ).length;

    const result = await client.callTool({
      name: "confirm_inbox_item",
      arguments: {
        inboxItemId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        name: "Compra",
        amount: 42.9,
        type: "expense",
        paymentMethod: "pix",
        purchaseDate: "2026-11-10",
        personId: "11111111-1111-4111-8111-111111111111",
        categoryId: "22222222-2222-4222-8222-222222222222",
        accountId: "33333333-3333-4333-8333-333333333333",
      },
    });

    const payload = payloadOf<{ dryRun: boolean; path: string; body: Record<string, unknown> }>(
      result,
    );

    assert.equal(payload.dryRun, true);
    assert.equal(payload.path, "/inbox/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/confirm");
    assert.equal("confirm" in payload.body, false);
    assert.equal(
      api.received("POST", "/inbox/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/confirm").length,
      before,
    );

    await close();
  });

  it("lista parcelamentos por período", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({
      name: "list_installments",
      arguments: { period: "2026-11" },
    });

    assert.match(textOf(result), /2 série\(s\) parcelada\(s\)/);

    const request = api.received("GET", "/reports/installments").at(-1);
    assert.equal(request?.query.get("status"), "open");

    await close();
  });

  it("exporta transações para arquivo local", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({
      name: "export_transactions",
      arguments: { format: "csv", period: "2026-11" },
    });

    const payload = payloadOf<{ path: string; bytes: number; rowCount: number }>(result);

    assert.equal(payload.rowCount, 1);
    assert.ok(existsSync(payload.path), "arquivo exportado deve existir");
    assert.match(readFileSync(payload.path, "utf8"), /Mercado;12,34/);

    await close();
  });

  it("anexa arquivo em três passos (prepare, upload, confirm)", async () => {
    const filePath = join(exportDir, "comprovante.pdf");
    const { mkdirSync, writeFileSync } = await import("node:fs");
    mkdirSync(exportDir, { recursive: true });
    writeFileSync(filePath, "%PDF-1.4 teste");

    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({
      name: "upload_attachment",
      arguments: {
        transactionId: "11111111-1111-4111-8111-111111111111",
        filePath,
        confirm: true,
      },
    });

    assert.equal(isError(result), false, textOf(result));

    const prepare = api.received("POST", "/attachments/prepare").at(-1);
    const preparedBody = (prepare?.body ?? {}) as { mimeType?: string };
    assert.equal(preparedBody.mimeType, "application/pdf");

    const upload = api.received("PUT", "/upload-target").at(-1);
    assert.ok(upload, "deve enviar o arquivo para a URL assinada");

    const confirm = api.received("POST", "/attachments/confirm").at(-1);
    assert.deepEqual(confirm?.body, {
      uploadId: "upload-1",
      transactionId: "11111111-1111-4111-8111-111111111111",
    });

    await close();
  });

  it("reporta status da IA desabilitada", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({ name: "get_ai_status", arguments: {} });

    assert.match(textOf(result), /desabilitado/);

    await close();
  });

  it("bloqueia escrita de IA sem confirm", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({
      name: "create_ai_diagnosis",
      arguments: { period: "2026-11", provider: "claude" },
    });

    const payload = payloadOf<{ dryRun: boolean; path: string }>(result);
    assert.equal(payload.dryRun, true);
    assert.equal(payload.path, "/ai-diagnoses");

    await close();
  });
});

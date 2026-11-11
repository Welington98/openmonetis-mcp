import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config } from "../src/config.js";
import { currentPeriod } from "../src/mcp/schemas/common.js";
import { createServer } from "../src/server.js";
import { FakeApi } from "./helpers/fake-api.js";

function makeConfig(baseUrl: string, overrides: Partial<Config> = {}): Config {
  return {
    baseUrl,
    origin: new URL(baseUrl).origin,
    auth: { email: "user@example.com", secret: "super-secret" },
    writes: "confirm",
    timeoutMs: 5_000,
    http: { host: "127.0.0.1", port: 7317 },
    ...overrides,
  };
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

type ToolResult = {
  content?: Array<{ type: string; text?: string }>;
  isError?: boolean;
};

function asResult(result: unknown): ToolResult {
  return result as ToolResult;
}

function textOf(result: unknown): string {
  return (asResult(result).content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

function isError(result: unknown): boolean {
  return asResult(result).isError === true;
}

function payloadOf<T>(result: unknown): T {
  const text = textOf(result);
  const start = text.search(/[[{]/);
  assert.notEqual(start, -1, `resposta sem JSON: ${text}`);
  return JSON.parse(text.slice(start)) as T;
}

describe("servidor MCP", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
  });

  after(async () => {
    await api.close();
  });

  it("expõe o catálogo de ferramentas", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const { tools } = await client.listTools();

    const names = tools.map((tool) => tool.name);
    for (const expected of [
      "get_dashboard_overview",
      "get_dashboard_attention",
      "list_transactions",
      "get_transaction",
      "list_accounts",
      "list_invoices",
      "list_bills",
      "list_budgets",
      "list_goals",
      "list_people",
      "create_transaction",
      "add_invoice_payment",
      "pay_bill",
    ]) {
      assert.ok(names.includes(expected), `faltou a ferramenta ${expected}`);
    }

    assert.ok(tools.length >= 30, `esperava 30+ ferramentas, recebeu ${tools.length}`);

    const overview = tools.find((tool) => tool.name === "get_dashboard_overview");
    assert.equal(overview?.annotations?.readOnlyHint, true);

    const create = tools.find((tool) => tool.name === "create_transaction");
    assert.equal(create?.annotations?.readOnlyHint, false);

    await close();
  });

  it("usa o mês atual quando o período é omitido", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({ name: "get_dashboard_overview", arguments: {} });

    assert.equal(isError(result), false);
    assert.match(textOf(result), new RegExp(currentPeriod()));

    const dashboard = api.received("GET", "/dashboard").at(-1);
    assert.equal(dashboard?.query.get("period"), currentPeriod());

    await close();
  });

  it("lista transações com resumo e projeção compacta", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const result = await client.callTool({
      name: "list_transactions",
      arguments: { period: "2026-07" },
    });

    const text = textOf(result);
    assert.match(text, /2 de 2 transações em 2026-07/);
    assert.match(text, /receitas 5\.000,00/);
    assert.match(text, /despesas 120,50/);

    const payload = payloadOf<{ items: Array<{ name: string; category: string }> }>(result);
    assert.equal(payload.items[0]?.name, "Mercado");
    assert.equal(payload.items[0]?.category, "Alimentação");

    const list = api.received("GET", "/transactions").at(-1);
    assert.equal(list?.query.get("period"), "2026-07");
    assert.equal(list?.query.get("pageSize"), "30");

    await close();
  });

  it("faz dry-run de escrita sem confirm", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const before = api.received("POST", "/transactions").length;

    const result = await client.callTool({
      name: "create_transaction",
      arguments: {
        name: "Farmácia",
        amount: 45.9,
        type: "expense",
        paymentMethod: "pix",
        purchaseDate: "2026-07-10",
        personId: "11111111-1111-4111-8111-111111111111",
        categoryId: "22222222-2222-4222-8222-222222222222",
        accountId: "33333333-3333-4333-8333-333333333333",
      },
    });

    const payload = payloadOf<{ dryRun: boolean; method: string; path: string; body: unknown }>(
      result,
    );
    assert.equal(payload.dryRun, true);
    assert.equal(payload.method, "POST");
    assert.equal(payload.path, "/transactions");
    assert.equal(api.received("POST", "/transactions").length, before, "não deve escrever");

    await close();
  });

  it("aplica a escrita com confirm: true", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "create_transaction",
      arguments: {
        name: "Farmácia",
        amount: 45.9,
        type: "expense",
        paymentMethod: "pix",
        purchaseDate: "2026-07-10",
        personId: "11111111-1111-4111-8111-111111111111",
        categoryId: "22222222-2222-4222-8222-222222222222",
        accountId: "33333333-3333-4333-8333-333333333333",
        confirm: true,
      },
    });

    assert.equal(isError(result), false);

    const payload = payloadOf<{ ok: boolean; data: { id: string } }>(result);
    assert.equal(payload.ok, true);
    assert.equal(payload.data.id, "33333333-3333-4333-8333-333333333333");

    const post = api.received("POST", "/transactions").at(-1);
    const sentBody = (post?.body ?? {}) as { name?: string; confirm?: boolean };
    assert.equal(sentBody.name, "Farmácia");
    assert.equal(sentBody.confirm, undefined);

    await close();
  });

  it("não injeta defaults em update_transaction", async () => {
    const { client, close } = await connect(makeConfig(api.url));
    const id = "11111111-1111-4111-8111-111111111111";

    await client.callTool({
      name: "update_transaction",
      arguments: { id, name: "Mercado editado", confirm: true },
    });

    const patch = api.received("PATCH", `/transactions/${id}`).at(-1);
    const body = (patch?.body ?? {}) as Record<string, unknown>;

    assert.equal(body.name, "Mercado editado");
    assert.equal("condition" in body, false, "condition não pode ser enviada por padrão");
    assert.equal(Object.keys(body).length, 1, "apenas o campo informado deve ir no corpo");

    await close();
  });

  it("bloqueia escritas no modo read-only", async () => {
    const { client, close } = await connect(makeConfig(api.url, { writes: "read-only" }));

    const result = await client.callTool({
      name: "create_transaction",
      arguments: {
        name: "Farmácia",
        amount: 45.9,
        type: "expense",
        paymentMethod: "pix",
        purchaseDate: "2026-07-10",
        personId: "11111111-1111-4111-8111-111111111111",
        categoryId: "22222222-2222-4222-8222-222222222222",
        accountId: "33333333-3333-4333-8333-333333333333",
        confirm: true,
      },
    });

    assert.equal(isError(result), true);
    assert.match(textOf(result), /Escrita desabilitada/);

    await close();
  });

  it("mostra o alvo no dry-run de exclusão", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "delete_transaction",
      arguments: { id: "11111111-1111-4111-8111-111111111111" },
    });

    const payload = payloadOf<{
      dryRun: boolean;
      details: { name: string; amount: number };
    }>(result);

    assert.equal(payload.dryRun, true);
    assert.equal(payload.details.name, "Mercado");
    assert.equal(payload.details.amount, 120.5);

    await close();
  });

  it("retorna erro estruturado quando a API falha", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "delete_transaction",
      arguments: { id: "99999999-9999-4999-8999-999999999999", confirm: true },
    });

    assert.equal(isError(result), true);
    assert.match(textOf(result), /404|Not found/);

    await close();
  });
});

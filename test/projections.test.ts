import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config } from "../src/config.js";
import { createServer } from "../src/server.js";
import { FakeApi } from "./helpers/fake-api.js";

function makeConfig(baseUrl: string): Config {
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
    http: { host: "127.0.0.1", port: 7317 },
  };
}

type ToolResult = { content?: Array<{ type: string; text?: string }>; isError?: boolean };

function payloadOf<T>(result: unknown): T {
  const text = ((result as ToolResult).content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
  const start = text.search(/[[{]/);
  assert.notEqual(start, -1, `resposta sem JSON: ${text}`);
  return JSON.parse(text.slice(start)) as T;
}

async function connect(config: Config) {
  const server = createServer(config);
  const client = new Client({ name: "openmonetis-mcp-projection-test", version: "1.0.0" });
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

const billItem = {
  id: "bill-1",
  recordId: "record-1",
  name: "Aluguel",
  period: "2026-07",
  purchaseDate: "2026-07-01",
  amount: 2500,
  dueDate: "2026-07-10",
  status: "due",
  isSettled: false,
  settledDate: null,
  paymentMethod: "boleto",
  condition: "recurring",
  currentInstallment: null,
  installmentCount: null,
  recurrenceFrequency: "monthly",
  accountId: "acc-1",
  accountName: "Conta",
  accountLogo: null,
  categoryName: "Moradia",
  categoryIcon: "home",
  dueDateAdjustment: { direction: "next", ruleName: "Fim de semana", reasons: [] },
  dueDateExceptionEditable: true,
  dueDateRuleExcluded: false,
  boletoPaymentDate: null,
  people: [{ personId: "p-1", personName: "Ana", personAvatarUrl: null, amount: 1250 }],
};

const invoiceItem = {
  cardId: "card-1",
  accountId: "acc-1",
  cardName: "Cartão",
  logo: null,
  period: "2026-07",
  amount: 900,
  paidAmount: 100,
  remainingAmount: 800,
  status: "open",
  closingDate: "2026-07-20",
  dueDate: "2026-07-25",
  originalDueDate: null,
  dueDateAdjustment: null,
  paymentCount: 1,
  latestPayment: { id: "pay-1", amount: 100, paidAt: "2026-07-10" },
  payments: [{ id: "pay-1", amount: 100, paidAt: "2026-07-10" }],
  people: [
    {
      personId: "p-1",
      personName: "Ana",
      personAvatarUrl: null,
      personRole: "admin",
      amount: 900,
      paidAmount: 100,
      remainingAmount: 800,
    },
  ],
};

const installmentGroup = {
  seriesId: "series-1",
  name: "Notebook",
  note: "comprado na promoção",
  paymentMethod: "credit_card",
  originalAmount: 6000,
  totalInstallments: 10,
  trackedFromInstallment: 1,
  trackedInstallmentCount: 10,
  untrackedInstallmentCount: 0,
  scheduledInstallmentCount: 10,
  missingInstallmentCount: 0,
  paidInstallmentCount: 2,
  pendingInstallmentCount: 8,
  trackedAmount: 6000,
  paidAmount: 1200,
  pendingAmount: 4800,
  progressPercentage: 20,
  nextDueDate: "2026-08-10",
  nextPeriod: "2026-08",
  endPeriod: "2027-04",
  status: "open",
  personId: "p-1",
  personName: "Ana",
  personAvatarUrl: null,
  categoryId: "cat-1",
  categoryName: "Eletrônicos",
  categoryIcon: "laptop",
  cardId: "card-1",
  cardName: "Cartão",
  cardLogo: null,
  accountId: "acc-1",
  accountName: "Conta",
  accountLogo: null,
  installments: [
    {
      id: "inst-1",
      installmentNumber: 1,
      period: "2026-07",
      purchaseDate: "2026-07-01",
      amount: 600,
      dueDate: "2026-07-10",
      status: "paid",
      isDueInReferencePeriod: false,
    },
  ],
};

describe("projeções compactas", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
    api.on("GET", "/bills", () => ({
      body: {
        data: {
          period: "2026-07",
          totalOpen: 2500,
          overdueCount: 0,
          accounts: [],
          items: [billItem],
        },
        error: null,
      },
    }));
    api.on("GET", "/invoices", () => ({
      body: {
        data: { period: "2026-07", totalRemaining: 800, accounts: [], items: [invoiceItem] },
        error: null,
      },
    }));
    api.on("GET", "/reports/installments", () => ({
      body: {
        data: { referencePeriod: "2026-07", groups: [installmentGroup], summary: {} },
        error: null,
      },
    }));
  });

  after(async () => {
    await api.close();
  });

  it("list_bills compacta o item e preserva os totais", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({ name: "list_bills", arguments: { period: "2026-07" } });
    const payload = payloadOf<{
      totalOpen: number;
      items: Array<Record<string, unknown>>;
    }>(result);

    assert.equal(payload.totalOpen, 2500);
    assert.equal(payload.items[0]?.name, "Aluguel");
    assert.equal(payload.items[0]?.dueDate, "2026-07-10");
    assert.equal("dueDateAdjustment" in (payload.items[0] ?? {}), false);
    assert.deepEqual(payload.items[0]?.people, [
      { personId: "p-1", personName: "Ana", amount: 1250 },
    ]);

    await close();
  });

  it("list_bills com detail full devolve o objeto cru", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "list_bills",
      arguments: { period: "2026-07", detail: "full" },
    });
    const payload = payloadOf<{ items: Array<Record<string, unknown>> }>(result);

    assert.deepEqual(payload.items[0]?.dueDateAdjustment, billItem.dueDateAdjustment);

    await close();
  });

  it("list_invoices compacta sem a lista de pagamentos", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "list_invoices",
      arguments: { period: "2026-07" },
    });
    const payload = payloadOf<{ totalRemaining: number; items: Array<Record<string, unknown>> }>(
      result,
    );

    assert.equal(payload.totalRemaining, 800);
    assert.equal(payload.items[0]?.remainingAmount, 800);
    assert.equal("payments" in (payload.items[0] ?? {}), false);
    assert.deepEqual(payload.items[0]?.latestPayment, {
      id: "pay-1",
      amount: 100,
      paidAt: "2026-07-10",
    });

    await close();
  });

  it("list_invoices com detail full mantém payments", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "list_invoices",
      arguments: { period: "2026-07", detail: "full" },
    });
    const payload = payloadOf<{ items: Array<Record<string, unknown>> }>(result);

    assert.equal(Array.isArray(payload.items[0]?.payments), true);

    await close();
  });

  it("list_installments compacta as séries mantendo ids de antecipação", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "list_installments",
      arguments: { period: "2026-07" },
    });
    const payload = payloadOf<{ groups: Array<Record<string, unknown>> }>(result);
    const group = payload.groups[0] ?? {};

    assert.equal(group.seriesId, "series-1");
    assert.equal("note" in group, false);
    assert.deepEqual(group.installments, [
      {
        id: "inst-1",
        installmentNumber: 1,
        period: "2026-07",
        purchaseDate: "2026-07-01",
        amount: 600,
        dueDate: "2026-07-10",
        status: "paid",
        isDueInReferencePeriod: false,
      },
    ]);

    await close();
  });

  it("list_installments com detail full devolve a série crua", async () => {
    const { client, close } = await connect(makeConfig(api.url));

    const result = await client.callTool({
      name: "list_installments",
      arguments: { period: "2026-07", detail: "full" },
    });
    const payload = payloadOf<{ groups: Array<Record<string, unknown>> }>(result);

    assert.equal(payload.groups[0]?.note, "comprado na promoção");
    assert.equal(payload.groups[0]?.personAvatarUrl, null);

    await close();
  });
});

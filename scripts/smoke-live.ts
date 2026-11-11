/**
 * Validação ponta a ponta do MCP contra uma instância real do OpenMonetis.
 *
 * Uso:
 *   OPENMONETIS_URL=http://localhost:7002/api-proxy \
 *   OPENMONETIS_EMAIL=... OPENMONETIS_PASSWORD=... \
 *   pnpm smoke:live
 *
 * Opcional:
 *   SMOKE_WRITES=1     executa o ciclo de escrita (cria conta/transação/orçamento, edita, liquida e exclui)
 *   SMOKE_PERIOD=YYYY-MM  período usado nas leituras (padrão: mês atual)
 *
 * Nunca imprime credenciais, cookies ou tokens.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { loadConfig } from "../src/config.js";
import { currentPeriod } from "../src/mcp/schemas/common.js";
import { createServer } from "../src/server.js";

type Outcome = {
  group: "leitura" | "escrita";
  tool: string;
  ok: boolean;
  ms: number;
  note: string;
};

type ToolResult = {
  content?: Array<{ type: string; text?: string }>;
  isError?: boolean;
};

const period = process.env.SMOKE_PERIOD?.trim() || currentPeriod();
const withWrites = process.env.SMOKE_WRITES === "1";
const outcomes: Outcome[] = [];

function textOf(result: unknown): string {
  const record = result as ToolResult;
  return (record.content ?? [])
    .filter((item) => item.type === "text")
    .map((item) => item.text ?? "")
    .join("\n");
}

function isError(result: unknown): boolean {
  return (result as ToolResult).isError === true;
}

function summaryOf(text: string): string {
  const start = text.search(/[[{]/);
  return (start === -1 ? text : text.slice(0, start)).trim().split("\n")[0] ?? "";
}

function payloadOf(text: string): unknown {
  const start = text.search(/[[{]/);
  if (start === -1) return undefined;

  try {
    return JSON.parse(text.slice(start));
  } catch {
    return undefined;
  }
}

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;

  const data = asRecord(value).data;
  return Array.isArray(data) ? data : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function main(): Promise<void> {
  const config = loadConfig();
  const server = createServer(config);
  const client = new Client({ name: "openmonetis-smoke", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

  console.log(`\nOpenMonetis MCP · ${config.baseUrl}`);
  console.log(`período ${period} · escritas ${withWrites ? "habilitadas" : "desabilitadas"}\n`);

  const { tools } = await client.listTools();
  console.log(`Ferramentas expostas: ${tools.length}\n`);

  async function call(
    group: Outcome["group"],
    tool: string,
    args: Record<string, unknown> = {},
    options: { optional?: boolean } = {},
  ): Promise<unknown> {
    const started = performance.now();

    try {
      const result = await client.callTool({ name: tool, arguments: args });
      const ms = Math.round(performance.now() - started);
      const text = textOf(result);
      const ok = !isError(result);
      const note = ok ? summaryOf(text) || "ok" : (text.split("\n")[0] ?? "");

      outcomes.push({ group, tool, ok, ms, note: truncate(note) });

      if (!ok && !options.optional) failureCount += 1;
      if (!ok && options.optional) skippedCount += 1;

      return ok ? payloadOf(text) : {};
    } catch (error) {
      const ms = Math.round(performance.now() - started);
      const note = error instanceof Error ? error.message : String(error);

      outcomes.push({ group, tool, ok: false, ms, note: truncate(note) });
      if (!options.optional) failureCount += 1;
      else skippedCount += 1;

      return {};
    }
  }

  let failureCount = 0;
  let skippedCount = 0;

  await call("leitura", "get_dashboard_overview", { period });
  await call("leitura", "get_dashboard_attention", { period });
  await call("leitura", "get_dashboard_snapshot", { period });
  await call("leitura", "list_transactions", { period, pageSize: 5 });
  await call("leitura", "list_accounts", { period });
  await call("leitura", "list_cards", { period });
  await call("leitura", "list_invoices", { period });
  await call("leitura", "list_bills", { period });
  const budgetsPayload = await call("leitura", "list_budgets", { period });
  await call("leitura", "list_goals", {});
  await call("leitura", "list_categories", {});
  await call("leitura", "list_tags", {});
  await call("leitura", "list_notifications", {});
  await call("leitura", "get_settings", {});
  await call("leitura", "get_financial_distribution", { period });
  await call("leitura", "get_category_trends", {
    startPeriod: shiftPeriod(period, -3),
    endPeriod: period,
  });
  await call("leitura", "list_commitments", {
    startPeriod: period,
    endPeriod: shiftPeriod(period, 2),
  });
  await call("leitura", "list_recurring_expenses", { period });

  const peoplePayload = await call("leitura", "list_people", {});
  const people = asArray(peoplePayload);
  const firstPerson = people.find(
    (item) => typeof (item as Record<string, unknown>).id === "string",
  ) as Record<string, unknown> | undefined;

  if (typeof firstPerson?.id === "string") {
    await call("leitura", "get_person_summary", { personId: firstPerson.id, period });
  }

  // Relatórios existem apenas para pessoas externas; o administrador responde 400 por regra.
  const externalPerson = people.find(
    (item) => (item as Record<string, unknown>).role === "external",
  ) as Record<string, unknown> | undefined;

  if (typeof externalPerson?.id === "string") {
    await call("leitura", "get_person_report", { personId: externalPerson.id, period });
  }

  const accountsPayload = await call("leitura", "list_accounts", { period });
  const accounts = asArray(accountsPayload);
  const firstAccount = accounts[0] as Record<string, unknown> | undefined;

  if (typeof firstAccount?.id === "string") {
    await call("leitura", "get_account", { id: firstAccount.id, period }, { optional: true });
    await call(
      "leitura",
      "get_account_cash_flow",
      { id: firstAccount.id, period },
      { optional: true },
    );
  }

  const cardsPayload = await call("leitura", "list_cards", { period });
  const cards = asArray(cardsPayload);
  const firstCard = cards[0] as Record<string, unknown> | undefined;

  if (typeof firstCard?.id === "string") {
    await call("leitura", "get_card", { id: firstCard.id }, { optional: true });
    await call("leitura", "get_invoice_history", { id: firstCard.id }, { optional: true });
  }

  if (withWrites) {
    const created = await call("escrita", "create_account", {
      name: "Conta smoke MCP",
      type: "checking",
      confirm: true,
    });
    const accountId = asText(asRecord(asRecord(created).data).id);

    const categoriesPayload = await call("leitura", "list_categories", {});
    const categories = asArray(categoriesPayload);
    const expenseCategory = categories.find(
      (item) => (item as Record<string, unknown>).type === "expense",
    ) as Record<string, unknown> | undefined;

    if (
      accountId &&
      typeof firstPerson?.id === "string" &&
      typeof expenseCategory?.id === "string"
    ) {
      const transaction = await call("escrita", "create_transaction", {
        name: "Transação smoke MCP",
        amount: 12.34,
        type: "expense",
        paymentMethod: "pix",
        purchaseDate: today(),
        personId: firstPerson.id,
        categoryId: expenseCategory.id,
        accountId,
        confirm: true,
      });
      const transactionId = asText(asRecord(asRecord(transaction).data).id);

      if (transactionId) {
        await call("escrita", "get_transaction", { id: transactionId });
        await call("escrita", "update_transaction", {
          id: transactionId,
          name: "Transação smoke MCP (editada)",
          confirm: true,
        });
        await call("escrita", "settle_transactions", {
          ids: [transactionId],
          isSettled: false,
          confirm: true,
        });
        await call("escrita", "delete_transaction", { id: transactionId, confirm: true });
      }

      // Reutiliza o período sem duplicar orçamento (a API recusa a mesma categoria no mês).
      const budgeted = new Set(
        asArray(asRecord(budgetsPayload).items)
          .map((item) => asText(asRecord(item).categoryId))
          .filter((value): value is string => value !== null),
      );
      const availableCategory = categories.find(
        (item) =>
          (item as Record<string, unknown>).type === "expense" &&
          !budgeted.has(String((item as Record<string, unknown>).id)),
      ) as Record<string, unknown> | undefined;

      if (typeof availableCategory?.id === "string") {
        await call("escrita", "create_budget", {
          categoryId: availableCategory.id,
          period,
          amount: 100,
          confirm: true,
        });
      }
    }

    await call("escrita", "create_goal", {
      name: "Meta smoke MCP",
      targetAmount: 1000,
      currentAmount: 0,
      targetDate: shiftPeriod(period, 6) + "-01",
      trackingType: "manual",
      confirm: true,
    });
  }

  printTable();

  console.log(
    `\n${outcomes.filter((item) => item.ok).length}/${outcomes.length} ok · ${failureCount} falha(s)${
      skippedCount ? ` · ${skippedCount} opcional(is) sem dado` : ""
    }`,
  );

  await client.close();
  await server.close();

  if (failureCount > 0) process.exitCode = 1;
}

function printTable(): void {
  const toolWidth = Math.max(...outcomes.map((item) => item.tool.length), 18);
  const groupWidth = 8;

  for (const item of outcomes) {
    const mark = item.ok ? "✔" : "✖";
    const ms = `${item.ms}ms`.padStart(6);
    console.log(
      `${mark} ${item.group.padEnd(groupWidth)} ${item.tool.padEnd(toolWidth)} ${ms}  ${item.note}`,
    );
  }
}

function asText(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function truncate(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 96 ? `${clean.slice(0, 93)}...` : clean;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftPeriod(period: string, months: number): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year as number, (month as number) - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

main().catch((error: unknown) => {
  console.error(
    `\nFalha ao executar o smoke test: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 1;
});

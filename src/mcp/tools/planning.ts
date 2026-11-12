import { z } from "zod";
import { InputError } from "../../client/errors.js";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const periodInput = z.object({
  period: periodSchema.describe("Mês de referência no formato YYYY-MM."),
});

const goalStatuses = ["active", "paused", "completed", "archived"] as const;

export const planningTools: ReadToolSpec[] = [
  {
    name: "list_bills",
    title: "Listar contas a pagar",
    description:
      "Lista as contas a pagar de um mês com total em aberto, quantidade de vencidas, contas de origem e itens (com rateio por pessoa, vencimento e status).",
    inputSchema: periodInput.shape,
    handler: async (input, ctx) => {
      const args = periodInput.parse(input);
      const data = await ctx.client.get<Record<string, unknown>>("/bills", {
        period: args.period,
      });
      const items = Array.isArray(data.items) ? data.items.length : 0;

      return {
        data,
        summary: `Contas a pagar de ${args.period}: ${items} item(ns), aberto ${formatMoney(data.totalOpen)}.`,
      };
    },
  },
  {
    name: "list_budgets",
    title: "Listar orçamentos",
    description:
      "Lista os orçamentos de um mês por categoria, com valor planejado, gasto, restante e percentual de uso.",
    inputSchema: periodInput.shape,
    handler: async (input, ctx) => {
      const args = periodInput.parse(input);
      return { data: await ctx.client.get("/budgets", { period: args.period }) };
    },
  },
  {
    name: "list_goals",
    title: "Listar metas",
    description:
      "Lista as metas financeiras com valor alvo, valor atual, restante, progresso, prazo e ritmo (adiantado, no prazo, atrasado).",
    inputSchema: z.object({ status: z.enum(goalStatuses).optional() }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ status: z.enum(goalStatuses).optional() }).parse(input);
      const data = await ctx.client.get<unknown[]>("/goals");
      const items = Array.isArray(data) ? data : [];
      const filtered = args.status
        ? items.filter((item) => asRecord(item).status === args.status)
        : items;

      return { data: filtered, summary: `${filtered.length} meta(s).` };
    },
  },
];

export const planningWriteTools: WriteToolSpec[] = [
  {
    name: "pay_bill",
    title: "Pagar conta a pagar",
    description:
      "Registra o pagamento de uma conta a pagar (lançamento recorrente) informando a conta de origem, a data e, opcionalmente, o valor pago. Exige `confirm: true` para executar.",
    inputSchema: z.object({
      period: periodSchema,
      billId: z.string().min(1).describe("ID do item de conta a pagar retornado por list_bills."),
      accountId: uuidSchema,
      paidAt: z.iso.date(),
      amount: z.number().positive().max(999_999_999.99).optional(),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          period: periodSchema,
          billId: z.string().min(1),
          accountId: uuidSchema,
          paidAt: z.iso.date(),
          amount: z.number().positive().max(999_999_999.99).optional(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { period, confirm: _confirm, ...body } = args;

      return {
        action: "Pagar conta",
        method: "POST",
        path: `/bills/${period}/payments`,
        body,
        details: { billId: body.billId, accountId: body.accountId, paidAt: body.paidAt },
        summary: `Pagar conta ${body.billId} em ${body.paidAt}${body.amount ? ` (${formatMoney(body.amount)})` : ""}.`,
      };
    },
  },
  {
    name: "create_budget",
    title: "Criar orçamento",
    description:
      "Cria (ou atualiza) o orçamento de uma categoria em um mês. Exige `confirm: true` para executar.",
    inputSchema: z.object({
      categoryId: uuidSchema,
      period: periodSchema,
      amount: z.number().nonnegative().multipleOf(0.01),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const { confirm: _confirm, ...body } = z
        .object({
          categoryId: uuidSchema,
          period: periodSchema,
          amount: z.number().nonnegative().multipleOf(0.01),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      return {
        action: "Criar orçamento",
        method: "POST",
        path: "/budgets",
        body,
        summary: `Definir orçamento de ${formatMoney(body.amount)} para ${body.period}.`,
      };
    },
  },
  {
    name: "create_goal",
    title: "Criar meta",
    description:
      'Cria uma meta financeira. Use `trackingType: "manual"` com `currentAmount`, ou `trackingType: "account"` com `accountId` para acompanhar o saldo de uma conta. Exige `confirm: true` para executar.',
    inputSchema: z.object({
      name: z.string().trim().min(1).max(120),
      targetAmount: z.number().positive().max(999_999_999.99),
      targetDate: z.iso.date(),
      trackingType: z.enum(["manual", "account"]),
      currentAmount: z.number().min(0).max(999_999_999.99).optional(),
      accountId: uuidSchema.optional(),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          name: z.string().trim().min(1).max(120),
          targetAmount: z.number().positive().max(999_999_999.99),
          targetDate: z.iso.date(),
          trackingType: z.enum(["manual", "account"]),
          currentAmount: z.number().min(0).max(999_999_999.99).optional(),
          accountId: uuidSchema.optional(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { confirm: _confirm, ...rest } = args;

      if (rest.trackingType === "manual" && rest.currentAmount === undefined) {
        throw new InputError("Metas manuais exigem currentAmount.");
      }
      if (rest.trackingType === "account" && !rest.accountId) {
        throw new InputError("Metas vinculadas a conta exigem accountId.");
      }

      const body =
        rest.trackingType === "manual"
          ? {
              name: rest.name,
              targetAmount: rest.targetAmount,
              targetDate: rest.targetDate,
              trackingType: rest.trackingType,
              currentAmount: rest.currentAmount,
            }
          : {
              name: rest.name,
              targetAmount: rest.targetAmount,
              targetDate: rest.targetDate,
              trackingType: rest.trackingType,
              accountId: rest.accountId,
            };

      return {
        action: "Criar meta",
        method: "POST",
        path: "/goals",
        body,
        summary: `Criar meta "${rest.name}" de ${formatMoney(rest.targetAmount)} até ${rest.targetDate}.`,
      };
    },
  },
];

function formatMoney(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

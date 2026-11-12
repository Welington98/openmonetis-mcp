import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";
import { asArray, asNumber, asRecord, asText, pickAll } from "./projection.js";

const CardIdInput = z.object({ id: uuidSchema.describe("ID do cartão.") });

const InvoicesInput = z.object({
  period: periodSchema,
  detail: z
    .enum(["compact", "full"])
    .default("compact")
    .describe("compact devolve os itens essenciais; full devolve o objeto completo da API."),
});

export const cardTools: ReadToolSpec[] = [
  {
    name: "list_cards",
    title: "Listar cartões",
    description:
      "Lista os cartões de crédito do usuário com limite, fatura atual e status. Aceita um período opcional para alinhar a fatura ao mês.",
    inputSchema: z.object({ period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ period: periodSchema.optional() }).parse(input);
      const data = await ctx.client.get<unknown>("/cards", { period: args.period });
      const items = Array.isArray(data) ? data : [];

      return { data, summary: `${items.length} cartão(ões).` };
    },
  },
  {
    name: "get_card",
    title: "Detalhar cartão",
    description: "Retorna os dados de um cartão, incluindo limite, uso e fatura corrente.",
    inputSchema: CardIdInput.shape,
    handler: async (input, ctx) => {
      const args = CardIdInput.parse(input);
      return { data: await ctx.client.get(`/cards/${args.id}`) };
    },
  },
  {
    name: "get_invoice_history",
    title: "Histórico de faturas do cartão",
    description:
      "Retorna o histórico de faturas de um cartão, com totais e situação de pagamento por período.",
    inputSchema: CardIdInput.extend({ period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = CardIdInput.extend({ period: periodSchema.optional() }).parse(input);
      return {
        data: await ctx.client.get(`/cards/${args.id}/invoice-history`, { period: args.period }),
      };
    },
  },
  {
    name: "list_invoices",
    title: "Listar faturas do período",
    description:
      'Lista as faturas de todos os cartões em um mês: total, fechamento, vencimento, pagamentos, ajustes e rateio por pessoa. Os itens vêm em versão compacta por padrão; use `detail: "full"` para o objeto completo.',
    inputSchema: InvoicesInput.shape,
    handler: async (input, ctx) => {
      const args = InvoicesInput.parse(input);
      const data = await ctx.client.get<Record<string, unknown>>("/invoices", {
        period: args.period,
      });

      if (args.detail === "full") return { data };

      return { data: { ...data, items: asArray(data.items).map(compactInvoice) } };
    },
  },
];

function compactInvoice(item: unknown): Record<string, unknown> {
  const record = asRecord(item);

  return {
    cardId: asText(record.cardId),
    accountId: asText(record.accountId),
    cardName: asText(record.cardName),
    period: asText(record.period),
    amount: asNumber(record.amount),
    paidAmount: asNumber(record.paidAmount),
    remainingAmount: asNumber(record.remainingAmount),
    status: asText(record.status),
    closingDate: asText(record.closingDate),
    dueDate: asText(record.dueDate),
    originalDueDate: asText(record.originalDueDate),
    paymentCount: asNumber(record.paymentCount),
    latestPayment:
      record.latestPayment === null || record.latestPayment === undefined
        ? null
        : asRecord(record.latestPayment),
    people: pickAll(record.people, [
      "personId",
      "personName",
      "amount",
      "paidAmount",
      "remainingAmount",
    ]),
  };
}

export const cardWriteTools: WriteToolSpec[] = [
  {
    name: "add_invoice_payment",
    title: "Registrar pagamento de fatura",
    description:
      "Registra o pagamento de uma fatura de cartão, com rateio por pessoa e conta de origem opcional. Exige `confirm: true` para executar; sem isso devolve o payload proposto.",
    inputSchema: z.object({
      cardId: uuidSchema,
      period: periodSchema.describe("Período da fatura (YYYY-MM)."),
      paidAt: z.iso.date(),
      accountId: uuidSchema.optional(),
      allocations: z
        .array(z.object({ personId: uuidSchema, amount: z.number().positive() }))
        .min(1)
        .max(100),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          cardId: uuidSchema,
          period: periodSchema,
          paidAt: z.iso.date(),
          accountId: uuidSchema.optional(),
          allocations: z
            .array(z.object({ personId: uuidSchema, amount: z.number().positive() }))
            .min(1)
            .max(100),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { cardId, period, confirm: _confirm, ...body } = args;
      const total = body.allocations.reduce((sum, item) => sum + item.amount, 0);

      return {
        action: "Registrar pagamento de fatura",
        method: "POST",
        path: `/invoices/${cardId}/${period}/payments`,
        body,
        details: { total, people: body.allocations.length },
        summary: `Pagar fatura ${period} do cartão ${cardId} (total ${total.toFixed(2)}).`,
      };
    },
  },
];

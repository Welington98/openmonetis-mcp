import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";
import { asArray, asNumber, asRecord, asText } from "./projection.js";

const reportStatuses = ["open", "completed", "all"] as const;

const installmentsInput = z.object({
  period: periodSchema,
  status: z.enum(reportStatuses).default("open"),
  q: z.string().trim().min(1).max(160).optional(),
  detail: z
    .enum(["compact", "full"])
    .default("compact")
    .describe("compact devolve as séries essenciais; full devolve o objeto completo da API."),
});

export const installmentTools: ReadToolSpec[] = [
  {
    name: "list_installments",
    title: "Parcelamentos",
    description:
      'Lista as séries parceladas do usuário no mês: séries abertas/concluídas, parcelas pagas e pendentes, valores e progresso. As séries vêm em versão compacta por padrão; use `detail: "full"` para o objeto completo.',
    inputSchema: installmentsInput.shape,
    handler: async (input, ctx) => {
      const args = installmentsInput.parse(input);

      const data = await ctx.client.get<Record<string, unknown>>("/reports/installments", {
        period: args.period,
        status: args.status,
        q: args.q,
      });
      const groups = asArray(data.groups);
      const projected =
        args.detail === "full" ? data : { ...data, groups: groups.map(compactGroup) };

      return {
        data: projected,
        summary: `${groups.length} série(s) parcelada(s) em ${args.period}.`,
      };
    },
  },
  {
    name: "quote_installments",
    title: "Cotar antecipação de parcelas",
    description:
      "Calcula quantidade e valor total das parcelas informadas — usado antes de antecipar para uma fatura.",
    inputSchema: z.object({ installmentIds: z.array(uuidSchema).min(1) }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ installmentIds: z.array(uuidSchema).min(1) }).parse(input);

      return {
        data: await ctx.client.request("POST", "/reports/installments/quote", {
          body: { installmentIds: args.installmentIds },
        }),
      };
    },
  },
];

function compactGroup(item: unknown): Record<string, unknown> {
  const record = asRecord(item);

  return {
    seriesId: asText(record.seriesId),
    name: asText(record.name),
    paymentMethod: asText(record.paymentMethod),
    originalAmount: asNumber(record.originalAmount),
    totalInstallments: asNumber(record.totalInstallments),
    trackedFromInstallment: asNumber(record.trackedFromInstallment),
    trackedInstallmentCount: asNumber(record.trackedInstallmentCount),
    untrackedInstallmentCount: asNumber(record.untrackedInstallmentCount),
    scheduledInstallmentCount: asNumber(record.scheduledInstallmentCount),
    missingInstallmentCount: asNumber(record.missingInstallmentCount),
    paidInstallmentCount: asNumber(record.paidInstallmentCount),
    pendingInstallmentCount: asNumber(record.pendingInstallmentCount),
    trackedAmount: asNumber(record.trackedAmount),
    paidAmount: asNumber(record.paidAmount),
    pendingAmount: asNumber(record.pendingAmount),
    progressPercentage: asNumber(record.progressPercentage),
    nextDueDate: asText(record.nextDueDate),
    nextPeriod: asText(record.nextPeriod),
    endPeriod: asText(record.endPeriod),
    status: asText(record.status),
    personId: asText(record.personId),
    personName: asText(record.personName),
    categoryId: asText(record.categoryId),
    categoryName: asText(record.categoryName),
    cardId: asText(record.cardId),
    cardName: asText(record.cardName),
    accountId: asText(record.accountId),
    accountName: asText(record.accountName),
    installments: asArray(record.installments).map(compactInstallment),
  };
}

function compactInstallment(item: unknown): Record<string, unknown> {
  const record = asRecord(item);

  return {
    id: asText(record.id),
    installmentNumber: asNumber(record.installmentNumber),
    period: asText(record.period),
    purchaseDate: asText(record.purchaseDate),
    amount: asNumber(record.amount),
    dueDate: asText(record.dueDate),
    status: asText(record.status),
    isDueInReferencePeriod: record.isDueInReferencePeriod === true,
  };
}

export const installmentWriteTools: WriteToolSpec[] = [
  {
    name: "anticipate_installments",
    title: "Antecipar parcelas",
    description:
      "Move parcelas futuras de uma série para uma fatura alvo, aplicando desconto opcional. Exige `confirm: true`.",
    inputSchema: z.object({
      seriesId: uuidSchema,
      installmentIds: z.array(uuidSchema).min(1),
      targetPeriod: periodSchema,
      discount: z.number().nonnegative().optional(),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          seriesId: uuidSchema,
          installmentIds: z.array(uuidSchema).min(1),
          targetPeriod: periodSchema,
          discount: z.number().nonnegative().optional(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { seriesId, confirm: _confirm, ...body } = args;

      return {
        action: "Antecipar parcelas",
        method: "POST",
        path: `/reports/installments/${seriesId}/anticipations`,
        body,
        details: {
          seriesId,
          installments: args.installmentIds.length,
          targetPeriod: args.targetPeriod,
        },
        summary: `Antecipar ${args.installmentIds.length} parcela(s) para ${args.targetPeriod}.`,
      };
    },
  },
  {
    name: "undo_installment_anticipation",
    title: "Desfazer antecipação",
    description:
      "Desfaz uma antecipação, devolvendo as parcelas ao período original. Exige `confirm: true`.",
    inputSchema: z.object({
      seriesId: uuidSchema,
      anticipationId: uuidSchema,
      installmentIds: z.array(uuidSchema).min(1),
      confirm: z.boolean().optional(),
    }).shape,
    destructive: true,
    plan: (input) => {
      const args = z
        .object({
          seriesId: uuidSchema,
          anticipationId: uuidSchema,
          installmentIds: z.array(uuidSchema).min(1),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      return {
        action: "Desfazer antecipação",
        method: "PATCH",
        path: `/reports/installments/${args.seriesId}/anticipations/${args.anticipationId}`,
        body: { installmentIds: args.installmentIds },
        details: { seriesId: args.seriesId, anticipationId: args.anticipationId },
        summary: `Desfazer a antecipação ${args.anticipationId}.`,
      };
    },
  },
];

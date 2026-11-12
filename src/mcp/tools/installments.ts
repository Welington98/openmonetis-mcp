import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const reportStatuses = ["open", "completed", "all"] as const;

export const installmentTools: ReadToolSpec[] = [
  {
    name: "list_installments",
    title: "Parcelamentos",
    description:
      "Lista as séries parceladas do usuário no mês: séries abertas/concluídas, parcelas pagas e pendentes, valores e progresso.",
    inputSchema: z.object({
      period: periodSchema,
      status: z.enum(reportStatuses).default("open"),
      q: z.string().trim().min(1).max(160).optional(),
    }).shape,
    handler: async (input, ctx) => {
      const args = z
        .object({
          period: periodSchema,
          status: z.enum(reportStatuses).default("open"),
          q: z.string().trim().min(1).max(160).optional(),
        })
        .parse(input);

      const data = await ctx.client.get<{ groups?: unknown[]; summary?: unknown }>(
        "/reports/installments",
        { period: args.period, status: args.status, q: args.q },
      );
      const groups = Array.isArray(data.groups) ? data.groups.length : 0;

      return { data, summary: `${groups} série(s) parcelada(s) em ${args.period}.` };
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

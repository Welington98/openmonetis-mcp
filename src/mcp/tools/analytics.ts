import { z } from "zod";
import type { ReadToolSpec } from "../runner.js";
import { periodSchema, personScopeSchema, uuidSchema } from "../schemas/common.js";

export const analyticsTools: ReadToolSpec[] = [
  {
    name: "get_financial_distribution",
    title: "Distribuição financeira",
    description:
      'Retorna a distribuição das despesas e receitas de um mês por categoria, forma de pagamento e condição, no escopo do administrador ou de todas as pessoas. `mode: "forecast"` inclui valores previstos.',
    inputSchema: z.object({
      period: periodSchema,
      personScope: personScopeSchema
        .optional()
        .describe('Escopo: "admin" (padrão), "all" ou o ID de uma pessoa.'),
      mode: z.enum(["actual", "forecast"]).default("actual"),
    }).shape,
    handler: async (input, ctx) => {
      const args = z
        .object({
          period: periodSchema,
          personScope: personScopeSchema.optional(),
          mode: z.enum(["actual", "forecast"]).default("actual"),
        })
        .parse(input);

      return {
        data: await ctx.client.get("/reports/financial-distribution", {
          period: args.period,
          personScope: args.personScope,
          mode: args.mode,
        }),
      };
    },
  },
  {
    name: "get_category_trends",
    title: "Tendência por categoria",
    description:
      "Compara a evolução de gastos por categoria entre dois meses (inclusive). Útil para responder o que aumentou ou diminuiu no período.",
    inputSchema: z.object({
      startPeriod: periodSchema,
      endPeriod: periodSchema,
      categoryIds: z.array(uuidSchema).optional(),
      personScope: personScopeSchema.optional(),
    }).shape,
    handler: async (input, ctx) => {
      const args = z
        .object({
          startPeriod: periodSchema,
          endPeriod: periodSchema,
          categoryIds: z.array(uuidSchema).optional(),
          personScope: personScopeSchema.optional(),
        })
        .parse(input);

      return {
        data: await ctx.client.get("/reports/category-trends", {
          startPeriod: args.startPeriod,
          endPeriod: args.endPeriod,
          categoryIds: args.categoryIds,
          personScope: args.personScope,
        }),
      };
    },
  },
  {
    name: "list_commitments",
    title: "Compromissos futuros",
    description:
      "Projeta os compromissos financeiros entre dois meses (inclusive): parcelas, recorrências e faturas já contratadas. Limite de até 24 meses.",
    inputSchema: z.object({ startPeriod: periodSchema, endPeriod: periodSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ startPeriod: periodSchema, endPeriod: periodSchema }).parse(input);

      return {
        data: await ctx.client.get("/reports/commitments", {
          startPeriod: args.startPeriod,
          endPeriod: args.endPeriod,
        }),
      };
    },
  },
  {
    name: "list_recurring_expenses",
    title: "Despesas recorrentes do mês",
    description:
      "Lista as despesas recorrentes ativas em um mês, com regra, frequência, valor e ocorrências.",
    inputSchema: z.object({ period: periodSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ period: periodSchema }).parse(input);

      return {
        data: await ctx.client.get("/recurring-expenses/report", { period: args.period }),
      };
    },
  },
];

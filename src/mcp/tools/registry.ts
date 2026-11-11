import { z } from "zod";
import type { ReadToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const listShape = z.object({
  detail: z
    .enum(["compact", "full"])
    .default("compact")
    .describe("compact retorna id e nome; full devolve o objeto completo."),
});

export const registryTools: ReadToolSpec[] = [
  {
    name: "list_categories",
    title: "Listar categorias",
    description:
      "Lista as categorias de receita e despesa do usuário. Use os IDs retornados em filtros e ao criar transações ou orçamentos.",
    inputSchema: listShape.shape,
    handler: async (input, ctx) => {
      const args = listShape.parse(input);
      const data = await ctx.client.get<unknown[]>("/categories");
      const items = Array.isArray(data) ? data : [];
      const projected =
        args.detail === "full"
          ? items
          : items.map((item) => {
              const record = asRecord(item);
              return {
                id: record.id ?? null,
                name: record.name ?? null,
                type: record.type ?? null,
                parentId: record.parentId ?? null,
              };
            });

      return { data: projected, summary: `${items.length} categoria(s).` };
    },
  },
  {
    name: "list_tags",
    title: "Listar tags",
    description: "Lista as tags disponíveis para classificar transações.",
    inputSchema: listShape.shape,
    handler: async (input, ctx) => {
      const args = listShape.parse(input);
      const data = await ctx.client.get<unknown[]>("/tags");
      const items = Array.isArray(data) ? data : [];
      const projected =
        args.detail === "full"
          ? items
          : items.map((item) => {
              const record = asRecord(item);
              return { id: record.id ?? null, name: record.name ?? null };
            });

      return { data: projected, summary: `${items.length} tag(s).` };
    },
  },
  {
    name: "list_people",
    title: "Listar pessoas",
    description:
      "Lista as pessoas da instalação (administrador e pessoas externas) com papel, status e vínculo. Use os IDs em rateios e filtros.",
    inputSchema: listShape.shape,
    handler: async (input, ctx) => {
      const args = listShape.parse(input);
      const data = await ctx.client.get<unknown[]>("/people");
      const items = Array.isArray(data) ? data : [];
      const projected =
        args.detail === "full"
          ? items
          : items.map((item) => {
              const record = asRecord(item);
              return {
                id: record.id ?? null,
                name: record.name ?? null,
                role: record.role ?? null,
                status: record.status ?? null,
              };
            });

      return { data: projected, summary: `${items.length} pessoa(s).` };
    },
  },
  {
    name: "get_person_summary",
    title: "Resumo financeiro da pessoa",
    description:
      "Retorna o resumo financeiro de uma pessoa em um mês: total de despesas, histórico e distribuição por categoria.",
    inputSchema: z.object({ personId: uuidSchema, period: periodSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ personId: uuidSchema, period: periodSchema }).parse(input);
      const data = await ctx.client.get(`/people/${args.personId}/summary`, {
        period: args.period,
      });

      return { data };
    },
  },
  {
    name: "get_person_report",
    title: "Relatório mensal da pessoa",
    description:
      "Retorna o relatório mensal completo de uma pessoa em um período: linhas de despesas e reembolsos, totais e rateios. É o mesmo conteúdo do PDF enviado por e-mail.",
    inputSchema: z.object({ personId: uuidSchema, period: periodSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ personId: uuidSchema, period: periodSchema }).parse(input);
      const data = await ctx.client.get(`/person-reports/${args.personId}`, {
        period: args.period,
      });

      return { data };
    },
  },
];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

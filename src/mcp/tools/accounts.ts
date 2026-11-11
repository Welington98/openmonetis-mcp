import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const accountTypes = ["checking", "savings", "investment", "cash", "benefits", "other"] as const;

const IdInput = z.object({ id: uuidSchema.describe("ID da conta.") });

const ListInput = z.object({
  period: periodSchema.optional().describe("Mês de referência (YYYY-MM) para os saldos."),
  detail: z
    .enum(["compact", "full"])
    .default("compact")
    .describe("compact retorna nome, tipo e saldo; full devolve o objeto completo."),
});

const CreateInput = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.enum(accountTypes),
  logo: z.string().trim().max(255).optional(),
  note: z.string().trim().max(1000).optional(),
  excludeFromBalance: z.boolean().optional(),
  confirm: z.boolean().optional(),
});

const UpdateInput = z.object({
  id: uuidSchema,
  name: z.string().trim().min(1).max(120).optional(),
  type: z.enum(accountTypes).optional(),
  logo: z.string().trim().max(255).optional(),
  note: z.string().trim().max(1000).optional(),
  excludeFromBalance: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  confirm: z.boolean().optional(),
});

export const accountTools: ReadToolSpec[] = [
  {
    name: "list_accounts",
    title: "Listar contas",
    description:
      "Lista as contas financeiras do usuário com tipo, saldo e indicação de exclusão do saldo consolidado.",
    inputSchema: ListInput.shape,
    handler: async (input, ctx) => {
      const args = ListInput.parse(input);
      const data = await ctx.client.get<unknown>("/accounts", { period: args.period });
      const items = Array.isArray(data) ? data : [];

      return {
        data: args.detail === "full" ? items : items.map((item) => compactAccount(item)),
        summary: `${items.length} conta(s).`,
      };
    },
  },
  {
    name: "get_account",
    title: "Detalhar conta",
    description: "Retorna os dados completos de uma conta, incluindo saldo e resumo do período.",
    inputSchema: IdInput.extend({ period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = IdInput.extend({ period: periodSchema.optional() }).parse(input);
      const data = await ctx.client.get(`/accounts/${args.id}`, { period: args.period });

      return { data };
    },
  },
  {
    name: "get_account_cash_flow",
    title: "Fluxo de caixa da conta",
    description:
      "Retorna o fluxo de caixa diário de uma conta em um mês: saldo inicial, lançamentos do dia, valor fora do mês e histórico mensal.",
    inputSchema: IdInput.extend({ period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = IdInput.extend({ period: periodSchema.optional() }).parse(input);
      const data = await ctx.client.get(`/accounts/${args.id}/cash-flow`, {
        period: args.period,
      });

      return { data };
    },
  },
];

export const accountWriteTools: WriteToolSpec[] = [
  {
    name: "create_account",
    title: "Criar conta",
    description:
      "Cria uma conta financeira. Sem `confirm: true` a ferramenta apenas devolve o payload que seria enviado.",
    inputSchema: CreateInput.shape,
    plan: (input) => {
      const { confirm: _confirm, ...body } = CreateInput.parse(input);

      return {
        action: "Criar conta",
        method: "POST",
        path: "/accounts",
        body,
        summary: `Criar conta "${body.name}" (${body.type}).`,
      };
    },
  },
  {
    name: "update_account",
    title: "Atualizar conta",
    description:
      "Atualiza uma conta existente (nome, tipo, logo, nota, exclusão do saldo consolidado, arquivamento). Envie apenas os campos que devem mudar.",
    inputSchema: UpdateInput.shape,
    plan: (input) => {
      const { id, confirm: _confirm, ...rest } = UpdateInput.parse(input);
      const fields = Object.entries(rest).filter(([, value]) => value !== undefined);

      if (fields.length === 0) {
        throw new Error("Informe ao menos um campo para atualizar.");
      }

      return {
        action: "Atualizar conta",
        method: "PATCH",
        path: `/accounts/${id}`,
        body: Object.fromEntries(fields),
        details: { id, fields: fields.map(([key]) => key) },
        summary: `Atualizar conta ${id} (${fields.map(([key]) => key).join(", ")}).`,
      };
    },
  },
];

function compactAccount(item: unknown): Record<string, unknown> {
  const record = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};

  return {
    id: record.id ?? null,
    name: record.name ?? null,
    type: record.type ?? null,
    balance: record.balance ?? null,
    excludeFromBalance: record.excludeFromBalance ?? null,
    isArchived: record.isArchived ?? null,
  };
}

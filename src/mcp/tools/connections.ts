import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

export const connectionTools: ReadToolSpec[] = [
  {
    name: "list_person_connections",
    title: "Conexões entre pessoas",
    description:
      "Lista as conexões ativas entre o titular e outras pessoas (perspectiva de dono ou destinatário), com status e data.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<unknown[]>("/person-connections");
      const items = Array.isArray(data) ? data : [];

      return { data: items, summary: `${items.length} conexão(ões).` };
    },
  },
  {
    name: "list_person_invitations",
    title: "Convites entre pessoas",
    description:
      "Lista os convites de conexão enviados, com status (pending, claimed, confirmed, cancelled, expired) e prazos.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<unknown[]>("/person-connections/invitations");
      const items = Array.isArray(data) ? data : [];

      return { data: items, summary: `${items.length} convite(s).` };
    },
  },
  {
    name: "list_person_settlements",
    title: "Acertos entre pessoas",
    description:
      "Resumo do que cada pessoa deve ao titular (ou tem de crédito) no período, com os acertos já registrados.",
    inputSchema: z.object({ period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ period: periodSchema.optional() }).parse(input);

      return { data: await ctx.client.get("/person-settlements", { period: args.period }) };
    },
  },
  {
    name: "get_person_balance",
    title: "Saldo com uma pessoa",
    description:
      "Retorna o saldo financeiro com uma pessoa no período: quanto ela deve ou tem de crédito, e os acertos registrados.",
    inputSchema: z.object({ personId: uuidSchema, period: periodSchema.optional() }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ personId: uuidSchema, period: periodSchema.optional() }).parse(input);

      return {
        data: await ctx.client.get(`/person-settlements/people/${args.personId}`, {
          period: args.period,
        }),
      };
    },
  },
];

export const connectionWriteTools: WriteToolSpec[] = [
  {
    name: "create_person_invitation",
    title: "Convidar pessoa para conectar",
    description:
      "Cria um convite de conexão para uma pessoa externa. O retorno inclui um `token` de uso único que dá acesso aos dados compartilhados — trate como segredo e não registre em log. Exige `confirm: true`.",
    inputSchema: z.object({ personId: uuidSchema, confirm: z.boolean().optional() }).shape,
    plan: (input) => {
      const args = z.object({ personId: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Criar convite de conexão",
        method: "POST",
        path: "/person-connections/invitations",
        body: { personId: args.personId },
        details: { personId: args.personId },
        summary: `Convidar a pessoa ${args.personId} para conectar.`,
      };
    },
  },
  {
    name: "cancel_person_invitation",
    title: "Cancelar convite",
    description: "Cancela um convite de conexão ainda não confirmado. Exige `confirm: true`.",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Cancelar convite",
        method: "POST",
        path: `/person-connections/invitations/${args.id}/cancel`,
        details: { id: args.id },
        summary: `Cancelar o convite ${args.id}.`,
      };
    },
  },
  {
    name: "revoke_person_connection",
    title: "Revogar conexão",
    description:
      "Revoga o acesso de uma pessoa conectada. Exige `confirm: true` (ação destrutiva).",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Revogar conexão",
        method: "DELETE",
        path: `/person-connections/${args.id}`,
        details: { id: args.id },
        summary: `Revogar a conexão ${args.id}.`,
      };
    },
  },
  {
    name: "create_person_settlement",
    title: "Registrar acerto com pessoa",
    description: "Registra um acerto (recebimento) de uma pessoa. Exige `confirm: true`.",
    inputSchema: z.object({
      personId: uuidSchema,
      amount: z.number().positive().max(999_999_999.99),
      receivedAt: z.iso.date(),
      note: z.string().trim().max(1000).optional(),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          personId: uuidSchema,
          amount: z.number().positive().max(999_999_999.99),
          receivedAt: z.iso.date(),
          note: z.string().trim().max(1000).optional(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { confirm: _confirm, ...body } = args;

      return {
        action: "Registrar acerto",
        method: "POST",
        path: "/person-settlements",
        body,
        details: { personId: args.personId, amount: args.amount },
        summary: `Registrar acerto de ${args.amount} com ${args.personId} em ${args.receivedAt}.`,
      };
    },
  },
  {
    name: "delete_person_settlement",
    title: "Excluir acerto",
    description: "Exclui um acerto registrado. Exige `confirm: true`.",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Excluir acerto",
        method: "DELETE",
        path: `/person-settlements/${args.id}`,
        details: { id: args.id },
        summary: `Excluir o acerto ${args.id}.`,
      };
    },
  },
];

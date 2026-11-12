import { z } from "zod";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const providers = ["claude", "codex", "antigravity"] as const;
const voices = ["balanced", "direct", "encouraging", "sarcastic", "stern"] as const;

export const aiTools: ReadToolSpec[] = [
  {
    name: "get_ai_status",
    title: "Status da IA",
    description:
      "Mostra se o assistente de IA está habilitado na instalação, quais provedores estão conectados, as ferramentas permitidas e os escopos de dados compartilhados.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const [providersInfo, tools, sharing] = await Promise.all([
        ctx.client.get("/ai-providers"),
        ctx.client.get("/ai-tools"),
        ctx.client.get("/ai-data-sharing"),
      ]);

      const enabled = (providersInfo as { enabled?: boolean }).enabled === true;

      return {
        data: { providers: providersInfo, tools, dataSharing: sharing },
        summary: enabled
          ? "Assistente de IA habilitado."
          : "Assistente de IA desabilitado nesta instalação (AI_ENABLED=false).",
      };
    },
  },
  {
    name: "list_ai_diagnoses",
    title: "Diagnósticos de IA",
    description:
      "Lista os diagnósticos financeiros gerados por IA, com período, provedor, status e saúde financeira.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<{ items?: unknown[] }>("/ai-diagnoses");
      const items = Array.isArray(data.items) ? data.items.length : 0;

      return { data, summary: `${items} diagnóstico(s).` };
    },
  },
  {
    name: "get_ai_diagnosis",
    title: "Detalhar diagnóstico de IA",
    description:
      "Retorna um diagnóstico completo, incluindo status, resultado, pontos de atenção e falha quando houver.",
    inputSchema: z.object({ id: uuidSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ id: uuidSchema }).parse(input);

      return { data: await ctx.client.get(`/ai-diagnoses/${args.id}`) };
    },
  },
  {
    name: "list_ai_chats",
    title: "Conversas com a IA",
    description:
      "Lista as conversas com o assistente financeiro (título, período, provedor e modelo).",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<{ items?: unknown[] }>("/ai-chats");
      const items = Array.isArray(data.items) ? data.items.length : 0;

      return { data, summary: `${items} conversa(s).` };
    },
  },
  {
    name: "get_ai_chat",
    title: "Detalhar conversa com a IA",
    description: "Retorna uma conversa com todo o histórico de mensagens.",
    inputSchema: z.object({ id: uuidSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ id: uuidSchema }).parse(input);

      return { data: await ctx.client.get(`/ai-chats/${args.id}`) };
    },
  },
];

export const aiWriteTools: WriteToolSpec[] = [
  {
    name: "create_ai_diagnosis",
    title: "Solicitar diagnóstico de IA",
    description:
      "Enfileira um diagnóstico financeiro do período no provedor escolhido. A geração é assíncrona: consulte com get_ai_diagnosis. Requer AI_ENABLED=true. Exige `confirm: true`.",
    inputSchema: z.object({
      period: periodSchema,
      provider: z.enum(providers),
      model: z.string().trim().min(1).max(120).optional(),
      voice: z.enum(voices).optional(),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({
          period: periodSchema,
          provider: z.enum(providers),
          model: z.string().trim().min(1).max(120).optional(),
          voice: z.enum(voices).optional(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      const { confirm: _confirm, ...body } = args;

      return {
        action: "Solicitar diagnóstico de IA",
        method: "POST",
        path: "/ai-diagnoses",
        body,
        details: { period: args.period, provider: args.provider },
        summary: `Gerar diagnóstico de ${args.period} com ${args.provider}.`,
      };
    },
  },
  {
    name: "cancel_ai_diagnosis",
    title: "Cancelar diagnóstico de IA",
    description: "Cancela um diagnóstico em andamento. Exige `confirm: true`.",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Cancelar diagnóstico",
        method: "POST",
        path: `/ai-diagnoses/${args.id}/cancel`,
        details: { id: args.id },
        summary: `Cancelar o diagnóstico ${args.id}.`,
      };
    },
  },
  {
    name: "delete_ai_chat",
    title: "Excluir conversa com a IA",
    description: "Exclui uma conversa e seu histórico. Exige `confirm: true`.",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Excluir conversa",
        method: "DELETE",
        path: `/ai-chats/${args.id}`,
        details: { id: args.id },
        summary: `Excluir a conversa ${args.id}.`,
      };
    },
  },
];

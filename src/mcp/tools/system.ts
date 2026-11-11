import { z } from "zod";
import type { ReadToolSpec } from "../runner.js";

export const systemTools: ReadToolSpec[] = [
  {
    name: "get_settings",
    title: "Configurações do usuário",
    description:
      "Retorna as preferências da conta (defaults de transação, preferências do dashboard) e as configurações de segurança, em uma única chamada.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const [security, preferences] = await Promise.all([
        ctx.client.get("/settings/security"),
        ctx.client.get("/preferences"),
      ]);

      return { data: { security, preferences } };
    },
  },
  {
    name: "list_notifications",
    title: "Notificações",
    description:
      "Lista as notificações acionáveis do usuário, como faturas próximas do vencimento, orçamentos excedidos e metas em risco. Retorna itens, contagem de não lidas, ativas e arquivadas.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<{ items?: unknown[]; unreadCount?: number }>(
        "/notifications",
      );
      const items = Array.isArray(data.items) ? data.items.length : 0;
      const unread = typeof data.unreadCount === "number" ? data.unreadCount : null;

      return {
        data,
        summary:
          unread === null
            ? `${items} notificação(ões).`
            : `${items} notificação(ões) · ${unread} não lida(s).`,
      };
    },
  },
];

import { z } from "zod";
import type { ReadToolSpec } from "../runner.js";
import { currentPeriod, periodSchema } from "../schemas/common.js";

const DashboardInput = z.object({
  period: periodSchema
    .optional()
    .describe("Mês de referência no formato YYYY-MM. Omita para usar o mês atual."),
});

function resolvePeriod(input: Record<string, unknown>): string {
  const period = input.period;
  return typeof period === "string" && period ? period : currentPeriod();
}

export const dashboardTools: ReadToolSpec[] = [
  {
    name: "get_dashboard_overview",
    title: "Visão geral do mês",
    description:
      "Retorna as métricas do dashboard financeiro de um mês: receitas, despesas, saldo, valor projetado, comparação com o mês anterior e histórico dos últimos 6 meses. Use como primeira ferramenta para entender a situação financeira do período.",
    inputSchema: DashboardInput.shape,
    handler: async (input, ctx) => {
      const args = DashboardInput.parse(input);
      const period = resolvePeriod(args);
      const data = await ctx.client.get("/dashboard", { period });

      return { data, summary: `Dashboard de ${period}.` };
    },
  },
  {
    name: "get_dashboard_snapshot",
    title: "Snapshot completo do dashboard",
    description:
      "Retorna de uma vez todas as seções do dashboard de um mês: métricas, saldos das contas, status de pagamentos, distribuição de despesas por condição/forma de pagamento, quebra por categoria e despesas por pessoa. Payload maior que get_dashboard_overview; use quando precisar de uma visão completa em uma única chamada.",
    inputSchema: DashboardInput.shape,
    handler: async (input, ctx) => {
      const args = DashboardInput.parse(input);
      const period = resolvePeriod(args);
      const data = await ctx.client.get("/dashboard/snapshot", { period });

      return { data, summary: `Snapshot do dashboard de ${period}.` };
    },
  },
  {
    name: "get_dashboard_attention",
    title: "Itens que exigem atenção",
    description:
      "Lista os itens que precisam de atenção no mês: faturas abertas, contas a pagar vencidas ou próximas do vencimento, orçamentos estourados ou perto do limite e metas em risco. Retorna também `unavailableSources` quando alguma fonte não pôde ser lida.",
    inputSchema: DashboardInput.shape,
    handler: async (input, ctx) => {
      const args = DashboardInput.parse(input);
      const period = resolvePeriod(args);
      const data = await ctx.client.get<{ items?: unknown[] }>("/dashboard/attention", { period });
      const count = Array.isArray(data.items) ? data.items.length : 0;

      return {
        data,
        summary: `${count} item(ns) exigindo atenção em ${period}.`,
      };
    },
  },
];

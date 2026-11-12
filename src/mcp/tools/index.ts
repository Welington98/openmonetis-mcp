import type { ToolProfile } from "../../config.js";
import type { ReadToolSpec, ToolCatalog, WriteToolSpec } from "../runner.js";
import { accountTools, accountWriteTools } from "./accounts.js";
import { aiTools, aiWriteTools } from "./ai.js";
import { analyticsTools } from "./analytics.js";
import { attachmentTools, attachmentWriteTools } from "./attachments.js";
import { cardTools, cardWriteTools } from "./cards.js";
import { connectionTools, connectionWriteTools } from "./connections.js";
import { dashboardTools } from "./dashboard.js";
import { importTools, importWriteTools } from "./imports.js";
import { inboxTools, inboxWriteTools } from "./inbox.js";
import { installmentTools, installmentWriteTools } from "./installments.js";
import { planningTools, planningWriteTools } from "./planning.js";
import { registryTools } from "./registry.js";
import { systemTools } from "./system.js";
import { transactionTools, transactionWriteTools } from "./transactions.js";

export const readTools: ReadToolSpec[] = [
  ...dashboardTools,
  ...transactionTools,
  ...accountTools,
  ...cardTools,
  ...planningTools,
  ...registryTools,
  ...analyticsTools,
  ...systemTools,
  ...inboxTools,
  ...importTools,
  ...attachmentTools,
  ...installmentTools,
  ...connectionTools,
  ...aiTools,
];

export const writeTools: WriteToolSpec[] = [
  ...transactionWriteTools,
  ...accountWriteTools,
  ...cardWriteTools,
  ...planningWriteTools,
  ...inboxWriteTools,
  ...importWriteTools,
  ...attachmentWriteTools,
  ...installmentWriteTools,
  ...connectionWriteTools,
  ...aiWriteTools,
];

/**
 * Catálogo enxuto para agentes com pouco orçamento de contexto: dashboard,
 * transações, contas, cartões e o básico de planejamento e cadastros. Somente
 * leitura — escrita continua disponível no perfil `full`.
 */
export const coreToolNames: readonly string[] = [
  "get_dashboard_overview",
  "get_dashboard_attention",
  "get_dashboard_snapshot",
  "list_transactions",
  "get_transaction",
  "list_accounts",
  "list_cards",
  "list_invoices",
  "list_bills",
  "list_budgets",
  "list_goals",
  "list_categories",
  "list_tags",
  "list_people",
];

export function selectCatalog(profile: ToolProfile): ToolCatalog {
  if (profile === "full") return { reads: readTools, writes: writeTools };

  const allowed = new Set(coreToolNames);

  return {
    reads: readTools.filter((tool) => allowed.has(tool.name)),
    writes: writeTools.filter((tool) => allowed.has(tool.name)),
  };
}

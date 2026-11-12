import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
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

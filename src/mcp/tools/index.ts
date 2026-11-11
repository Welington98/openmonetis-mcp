import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { accountTools, accountWriteTools } from "./accounts.js";
import { analyticsTools } from "./analytics.js";
import { cardTools, cardWriteTools } from "./cards.js";
import { dashboardTools } from "./dashboard.js";
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
];

export const writeTools: WriteToolSpec[] = [
  ...transactionWriteTools,
  ...accountWriteTools,
  ...cardWriteTools,
  ...planningWriteTools,
];

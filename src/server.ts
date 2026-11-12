import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClient } from "./client/api-client.js";
import { SessionManager } from "./client/session.js";
import type { Config, ToolProfile } from "./config.js";
import { registerCatalog } from "./mcp/runner.js";
import { selectCatalog } from "./mcp/tools/index.js";
import { VERSION } from "./version.js";

const baseInstructions = [
  "Servidor MCP do OpenMonetis, um gestor financeiro pessoal.",
  "Prefira valores em reais e períodos no formato YYYY-MM.",
  "Comece por get_dashboard_overview ou get_dashboard_attention para situar o mês,",
  "depois detalhe com list_transactions, list_bills, list_invoices, list_budgets e list_goals.",
  "Ferramentas de escrita exigem confirm: true; sem isso elas apenas descrevem o que fariam.",
];

const coreNotice =
  "Catálogo reduzido (OPENMONETIS_MCP_TOOLS=core): apenas leitura de dashboard, transações, contas, cartões e cadastros básicos estão expostos. Defina OPENMONETIS_MCP_TOOLS=full para habilitar as demais ferramentas.";

export function buildInstructions(profile: ToolProfile): string {
  const base = baseInstructions.join(" ");
  return profile === "core" ? `${base} ${coreNotice}` : base;
}

/** Instruções do perfil `full`, mantidas para clientes que as importam. */
export const instructions = buildInstructions("full");

export type ServerDependencies = {
  session?: SessionManager;
  client?: ApiClient;
};

export function createServer(config: Config, deps: ServerDependencies = {}): McpServer {
  const session = deps.session ?? new SessionManager(config);
  const client = deps.client ?? new ApiClient(config, session);

  const server = new McpServer(
    { name: "openmonetis", version: VERSION },
    {
      capabilities: { tools: {} },
      instructions: buildInstructions(config.tools),
    },
  );

  registerCatalog(server, selectCatalog(config.tools), { client, config });

  return server;
}

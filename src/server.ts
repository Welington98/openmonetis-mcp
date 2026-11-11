import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ApiClient } from "./client/api-client.js";
import { SessionManager } from "./client/session.js";
import type { Config } from "./config.js";
import { registerCatalog } from "./mcp/runner.js";
import { readTools, writeTools } from "./mcp/tools/index.js";
import { VERSION } from "./version.js";

export const instructions = [
  "Servidor MCP do OpenMonetis, um gestor financeiro pessoal.",
  "Prefira valores em reais e períodos no formato YYYY-MM.",
  "Comece por get_dashboard_overview ou get_dashboard_attention para situar o mês,",
  "depois detalhe com list_transactions, list_bills, list_invoices, list_budgets e list_goals.",
  "Ferramentas de escrita exigem confirm: true; sem isso elas apenas descrevem o que fariam.",
].join(" ");

export function createServer(config: Config): McpServer {
  const session = new SessionManager(config);
  const client = new ApiClient(config, session);

  const server = new McpServer(
    { name: "openmonetis", version: VERSION },
    {
      capabilities: { tools: {} },
      instructions,
    },
  );

  registerCatalog(server, { reads: readTools, writes: writeTools }, { client, config });

  return server;
}

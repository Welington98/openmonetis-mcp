import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const server = createServer(config);
  const transport = new StdioServerTransport();

  await server.connect(transport);

  process.stderr.write(
    `[openmonetis-mcp] stdio conectado · api=${config.baseUrl} · escritas=${config.writes}\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `[openmonetis-mcp] falha ao iniciar: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});

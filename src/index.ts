import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { runAuthCommand } from "./cli/auth.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";
import { VERSION } from "./version.js";

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);

  if (command === "auth") {
    process.exitCode = await runAuthCommand(rest);
    return;
  }

  if (command === "--version" || command === "-v" || command === "version") {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  if (command === "--help" || command === "-h" || command === "help") {
    process.stdout.write(
      [
        "openmonetis-mcp — servidor MCP do OpenMonetis",
        "",
        "  openmonetis-mcp              inicia o servidor (stdio)",
        "  openmonetis-mcp auth set     guarda as credenciais no cofre local",
        "  openmonetis-mcp auth status  mostra a origem das credenciais",
        "  openmonetis-mcp auth clear   remove as credenciais guardadas",
        "  openmonetis-mcp --version    mostra a versão",
        "",
      ].join("\n"),
    );
    return;
  }

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

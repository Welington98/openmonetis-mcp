import { loadConfig } from "./config.js";
import { startHttpServer } from "./http-server.js";

async function main(): Promise<void> {
  const config = loadConfig();
  await startHttpServer(config);
}

main().catch((error: unknown) => {
  process.stderr.write(
    `[openmonetis-mcp] falha ao iniciar HTTP: ${
      error instanceof Error ? error.message : String(error)
    }\n`,
  );
  process.exitCode = 1;
});

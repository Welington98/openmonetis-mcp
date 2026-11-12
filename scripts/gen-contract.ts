/**
 * Gera o contrato a partir do OpenAPI de uma instância real do OpenMonetis.
 *
 * Uso:
 *   OPENMONETIS_URL=http://localhost:7001 pnpm gen:contract
 *
 * Produz dois artefatos versionados:
 *   contract/openapi.snapshot.json  — especificação completa, usada para detectar drift
 *   contract/openapi.d.ts           — tipos gerados, usados para tipar os endpoints das ferramentas
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import openapiTS, { astToString } from "openapi-typescript";

const contractDirectory = "contract";
const snapshotPath = `${contractDirectory}/openapi.snapshot.json`;
const typesPath = `${contractDirectory}/openapi.d.ts`;

export type OpenApiDocument = {
  info?: { version?: string };
  paths?: Record<string, Record<string, unknown>>;
};

async function main(): Promise<void> {
  const baseUrl = (process.env.OPENMONETIS_URL ?? "http://localhost:7001").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/openapi.json`);

  if (!response.ok) {
    throw new Error(`Falha ao ler ${baseUrl}/openapi.json (${response.status}).`);
  }

  const spec = (await response.json()) as OpenApiDocument;

  mkdirSync(contractDirectory, { recursive: true });
  mkdirSync(dirname(typesPath), { recursive: true });

  writeFileSync(snapshotPath, `${JSON.stringify(spec, null, 2)}\n`);

  const ast = await openapiTS(spec as Parameters<typeof openapiTS>[0]);
  writeFileSync(
    typesPath,
    `// Gerado por scripts/gen-contract.ts a partir de ${baseUrl}/openapi.json\n` +
      `// OpenMonetis ${spec.info?.version ?? "desconhecida"} — não edite à mão.\n` +
      astToString(ast),
  );

  const paths = Object.keys(spec.paths ?? {}).length;
  console.log(
    `✔ contrato gerado (OpenMonetis ${spec.info?.version ?? "?"}): ${paths} paths em ${snapshotPath} e ${typesPath}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

/**
 * Valida, contra o OpenAPI de uma instância viva, todos os endpoints usados pelas ferramentas.
 *
 * Uso:
 *   OPENMONETIS_URL=http://localhost:7002/api-proxy pnpm check:contract
 *
 * A lista abaixo espelha as chamadas feitas em `src/mcp/tools/*`. Ao adicionar ou mudar uma
 * ferramenta, atualize este arquivo — o script falha quando uma rota deixa de existir.
 */
const endpoints: Array<[method: string, path: string]> = [
  ["get", "/dashboard"],
  ["get", "/dashboard/snapshot"],
  ["get", "/dashboard/attention"],
  ["get", "/transactions"],
  ["get", "/transactions/{id}"],
  ["post", "/transactions"],
  ["patch", "/transactions/{id}"],
  ["delete", "/transactions/{id}"],
  ["patch", "/transactions/settlement"],
  ["get", "/accounts"],
  ["get", "/accounts/{id}"],
  ["get", "/accounts/{id}/cash-flow"],
  ["post", "/accounts"],
  ["patch", "/accounts/{id}"],
  ["get", "/cards"],
  ["get", "/cards/{id}"],
  ["get", "/cards/{id}/invoice-history"],
  ["get", "/invoices"],
  ["post", "/invoices/{cardId}/{period}/payments"],
  ["get", "/bills"],
  ["post", "/bills/{period}/payments"],
  ["get", "/budgets"],
  ["post", "/budgets"],
  ["get", "/goals"],
  ["post", "/goals"],
  ["get", "/categories"],
  ["get", "/tags"],
  ["get", "/people"],
  ["get", "/people/{id}/summary"],
  ["get", "/person-reports/{personId}"],
  ["get", "/reports/financial-distribution"],
  ["get", "/reports/category-trends"],
  ["get", "/reports/commitments"],
  ["get", "/recurring-expenses/report"],
  ["get", "/settings/security"],
  ["get", "/preferences"],
  ["get", "/notifications"],
];

type OpenApiDocument = {
  paths?: Record<string, Record<string, unknown>>;
};

async function main(): Promise<void> {
  const baseUrl = (process.env.OPENMONETIS_URL ?? "http://localhost:7001").replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/openapi.json`);

  if (!response.ok) {
    throw new Error(`Falha ao ler ${baseUrl}/openapi.json (${response.status}).`);
  }

  const spec = (await response.json()) as OpenApiDocument;
  const paths = spec.paths ?? {};
  const failures: string[] = [];

  for (const [method, path] of endpoints) {
    if (!paths[path]?.[method]) failures.push(`${method.toUpperCase()} ${path}`);
  }

  if (failures.length > 0) {
    console.error(`✖ ${failures.length} endpoint(s) do MCP não existem no OpenAPI de ${baseUrl}:`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`✔ ${endpoints.length} endpoints validados contra ${baseUrl}/openapi.json`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

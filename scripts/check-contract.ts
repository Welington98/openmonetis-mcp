/**
 * Valida as rotas usadas pelas ferramentas contra o contrato gerado e contra uma instância viva.
 *
 * Uso:
 *   pnpm check:contract                                        # offline, contra o contrato versionado
 *   OPENMONETIS_URL=http://localhost:7001 pnpm check:contract   # também contra a instância viva
 *
 * A lista `endpoints` é tipada por `contract/openapi.d.ts`: um path ou método que não exista no
 * contrato quebra o `tsc` antes de chegar ao runtime.
 */
import { readFileSync } from "node:fs";
import type { paths } from "../contract/openapi.d.ts";

type Method = "get" | "post" | "put" | "patch" | "delete";

/** Só aceita métodos que realmente existem no path (no contrato, métodos ausentes são `never`). */
type MethodOf<Path extends keyof paths> = {
  [M in Method]: NonNullable<paths[Path][M]> extends never ? never : M;
}[Method];

type EndpointTuple = [method: Method, path: keyof paths];

function endpoint<Path extends keyof paths, M extends MethodOf<Path>>(
  method: M,
  path: Path,
): EndpointTuple {
  return [method, path];
}

const endpoints: EndpointTuple[] = [
  endpoint("get", "/dashboard"),
  endpoint("get", "/dashboard/snapshot"),
  endpoint("get", "/dashboard/attention"),
  endpoint("get", "/transactions"),
  endpoint("get", "/transactions/{id}"),
  endpoint("post", "/transactions"),
  endpoint("patch", "/transactions/{id}"),
  endpoint("delete", "/transactions/{id}"),
  endpoint("patch", "/transactions/settlement"),
  endpoint("get", "/accounts"),
  endpoint("get", "/accounts/{id}"),
  endpoint("get", "/accounts/{id}/cash-flow"),
  endpoint("post", "/accounts"),
  endpoint("patch", "/accounts/{id}"),
  endpoint("get", "/cards"),
  endpoint("get", "/cards/{id}"),
  endpoint("get", "/cards/{id}/invoice-history"),
  endpoint("get", "/invoices"),
  endpoint("post", "/invoices/{cardId}/{period}/payments"),
  endpoint("get", "/bills"),
  endpoint("post", "/bills/{period}/payments"),
  endpoint("get", "/budgets"),
  endpoint("post", "/budgets"),
  endpoint("get", "/goals"),
  endpoint("post", "/goals"),
  endpoint("get", "/categories"),
  endpoint("get", "/tags"),
  endpoint("get", "/people"),
  endpoint("get", "/people/{id}/summary"),
  endpoint("get", "/person-reports/{personId}"),
  endpoint("get", "/reports/financial-distribution"),
  endpoint("get", "/reports/category-trends"),
  endpoint("get", "/reports/commitments"),
  endpoint("get", "/recurring-expenses/report"),
  endpoint("get", "/settings/security"),
  endpoint("get", "/preferences"),
  endpoint("get", "/notifications"),
  endpoint("get", "/inbox"),
  endpoint("get", "/inbox/snapshot"),
  endpoint("post", "/inbox/{id}/confirm"),
  endpoint("post", "/inbox/discard"),
  endpoint("get", "/inbox-rules"),
  endpoint("post", "/inbox-rules"),
  endpoint("delete", "/inbox-rules/{id}"),
  endpoint("get", "/inbox-rules/suggestions/{inboxItemId}"),
  endpoint("post", "/transactions/imports/preview"),
  endpoint("post", "/transactions/imports"),
  endpoint("delete", "/transactions/imports/{batchId}"),
  endpoint("get", "/transactions/imports/template"),
  endpoint("get", "/transactions/export"),
  endpoint("get", "/attachments"),
  endpoint("post", "/attachments/prepare"),
  endpoint("post", "/attachments/confirm"),
  endpoint("get", "/attachments/transaction/{transactionId}"),
  endpoint("get", "/attachments/{id}/download-url"),
  endpoint("delete", "/attachments/{id}"),
  endpoint("get", "/reports/installments"),
  endpoint("post", "/reports/installments/quote"),
  endpoint("post", "/reports/installments/{seriesId}/anticipations"),
  endpoint("patch", "/reports/installments/{seriesId}/anticipations/{anticipationId}"),
  endpoint("get", "/person-connections"),
  endpoint("get", "/person-connections/invitations"),
  endpoint("post", "/person-connections/invitations"),
  endpoint("post", "/person-connections/invitations/{id}/cancel"),
  endpoint("delete", "/person-connections/{id}"),
  endpoint("get", "/person-settlements"),
  endpoint("post", "/person-settlements"),
  endpoint("get", "/person-settlements/people/{personId}"),
  endpoint("delete", "/person-settlements/{id}"),
  endpoint("get", "/ai-providers"),
  endpoint("get", "/ai-tools"),
  endpoint("get", "/ai-data-sharing"),
  endpoint("get", "/ai-diagnoses"),
  endpoint("post", "/ai-diagnoses"),
  endpoint("get", "/ai-diagnoses/{id}"),
  endpoint("post", "/ai-diagnoses/{id}/cancel"),
  endpoint("get", "/ai-chats"),
  endpoint("get", "/ai-chats/{id}"),
  endpoint("delete", "/ai-chats/{id}"),
];

type Snapshot = {
  info?: { version?: string };
  paths?: Record<string, Record<string, unknown>>;
};

async function main(): Promise<void> {
  const snapshot = JSON.parse(readFileSync("contract/openapi.snapshot.json", "utf8")) as Snapshot;
  const snapshotPaths = snapshot.paths ?? {};

  const missingInSnapshot = endpoints.filter(([method, path]) => !snapshotPaths[path]?.[method]);
  if (missingInSnapshot.length > 0) {
    report("O contrato versionado não contém estas rotas", missingInSnapshot, [
      "Rode `pnpm gen:contract` para regenerar.",
    ]);
    return;
  }

  const baseUrl = process.env.OPENMONETIS_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    console.log(
      `✔ ${endpoints.length} rotas conferidas no contrato versionado (OpenMonetis ${
        snapshot.info?.version ?? "?"
      }).`,
    );
    return;
  }

  const response = await fetch(`${baseUrl}/openapi.json`);
  if (!response.ok) {
    throw new Error(`Falha ao ler ${baseUrl}/openapi.json (${response.status}).`);
  }

  const live = (await response.json()) as Snapshot;
  const livePaths = live.paths ?? {};
  const missingLive = endpoints.filter(([method, path]) => !livePaths[path]?.[method]);

  if (missingLive.length > 0) {
    report(`Rotas ausentes no OpenAPI de ${baseUrl}`, missingLive, [
      "O contrato versionado e a instância divergiram; rode `pnpm gen:contract`.",
    ]);
    return;
  }

  console.log(
    `✔ ${endpoints.length} rotas validadas em ${baseUrl} (OpenMonetis ${
      live.info?.version ?? "?"
    }).`,
  );
}

function report(title: string, missing: EndpointTuple[], hints: string[]): void {
  console.error(`✖ ${title}:`);
  for (const [method, path] of missing) console.error(`  - ${method.toUpperCase()} ${path}`);
  for (const hint of hints) console.error(hint);
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

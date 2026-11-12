import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config, ToolProfile } from "../src/config.js";
import { createServer } from "../src/server.js";

const baseConfig: Config = {
  baseUrl: "http://127.0.0.1:1",
  exportDir: "/tmp/openmonetis-mcp-bench",
  origin: "http://127.0.0.1:1",
  writes: "read-only",
  timeoutMs: 1_000,
  maxResponseBytes: 65_536,
  cacheTtlMs: 30_000,
  retryAttempts: 2,
  tools: "full",
  debug: false,
  http: { host: "127.0.0.1", port: 7317 },
};

type Measurement = {
  profile: ToolProfile;
  tools: number;
  bytes: number;
  listMs: number;
  registrationMs: number;
  largest: Array<{ name: string; bytes: number }>;
};

function bytesOf(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value) ?? "", "utf8");
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatPercent(part: number, total: number): string {
  return `${((part / total) * 100).toFixed(1)}%`;
}

function formatTokens(bytes: number): string {
  return `~${Math.round(bytes / 4)} tokens`;
}

async function measure(profile: ToolProfile): Promise<Measurement> {
  const config: Config = { ...baseConfig, tools: profile };

  const registrationStartedAt = performance.now();
  const server = createServer(config);
  const registrationMs = performance.now() - registrationStartedAt;

  const client = new Client({ name: "openmonetis-mcp-bench", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

  const listStartedAt = performance.now();
  const { tools } = await client.listTools();
  const listMs = performance.now() - listStartedAt;

  const bytes = bytesOf(tools);
  const largest = tools
    .map((tool) => ({ name: tool.name, bytes: bytesOf(tool) }))
    .sort((left, right) => right.bytes - left.bytes);

  await client.close();
  await server.close();

  return { profile, tools: tools.length, bytes, listMs, registrationMs, largest };
}

const measurements = [await measure("core"), await measure("full")];

const lines: string[] = [];

for (const measurement of measurements) {
  lines.push(`perfil ${measurement.profile}`);
  lines.push(`  ferramentas: ${measurement.tools}`);
  lines.push(
    `  tools/list: ${formatKb(measurement.bytes)} (${formatTokens(measurement.bytes)}) em ${measurement.listMs.toFixed(1)} ms`,
  );
  lines.push(`  registro do catálogo: ${measurement.registrationMs.toFixed(1)} ms`);
  lines.push(`  média por ferramenta: ${formatKb(measurement.bytes / measurement.tools)}`);
  lines.push("");
}

const [core, full] = measurements;
if (core && full) {
  lines.push(
    `economia do perfil core: ${formatKb(full.bytes - core.bytes)} (${formatPercent(full.bytes - core.bytes, full.bytes)}) e ${full.tools - core.tools} ferramentas a menos`,
    "",
  );
}

lines.push("maiores esquemas (perfil full):");

for (const [index, tool] of (full?.largest ?? []).slice(0, 10).entries()) {
  lines.push(
    `  ${String(index + 1).padStart(2)}. ${tool.name.padEnd(34)} ${formatKb(tool.bytes).padStart(8)}  ${formatPercent(tool.bytes, full?.bytes ?? 1)}`,
  );
}

process.stdout.write(`${lines.join("\n")}\n`);

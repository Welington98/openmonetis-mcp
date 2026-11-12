import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config } from "../src/config.js";
import { createServer } from "../src/server.js";

const config: Config = {
  baseUrl: "http://127.0.0.1:1",
  exportDir: "/tmp/openmonetis-mcp-bench",
  origin: "http://127.0.0.1:1",
  writes: "read-only",
  timeoutMs: 1_000,
  maxResponseBytes: 65_536,
  debug: false,
  http: { host: "127.0.0.1", port: 7317 },
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

const registrationStartedAt = performance.now();
const server = createServer(config);
const registrationMs = performance.now() - registrationStartedAt;

const client = new Client({ name: "openmonetis-mcp-bench", version: "1.0.0" });
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

const listStartedAt = performance.now();
const { tools } = await client.listTools();
const listMs = performance.now() - listStartedAt;

const totalBytes = bytesOf(tools);
const ranked = tools
  .map((tool) => ({ name: tool.name, bytes: bytesOf(tool) }))
  .sort((left, right) => right.bytes - left.bytes);

const lines = [
  `ferramentas: ${tools.length}`,
  `tools/list: ${formatKb(totalBytes)} (~${Math.round(totalBytes / 4)} tokens) em ${listMs.toFixed(1)} ms`,
  `registro do catálogo: ${registrationMs.toFixed(1)} ms`,
  `média por ferramenta: ${formatKb(totalBytes / tools.length)}`,
  "",
  "maiores esquemas:",
  ...ranked
    .slice(0, 10)
    .map(
      (tool, index) =>
        `  ${String(index + 1).padStart(2)}. ${tool.name.padEnd(34)} ${formatKb(tool.bytes).padStart(8)}  ${formatPercent(tool.bytes, totalBytes)}`,
    ),
];

process.stdout.write(`${lines.join("\n")}\n`);

await client.close();
await server.close();

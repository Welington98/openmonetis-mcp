import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { Config, ToolProfile } from "../src/config.js";
import { coreToolNames } from "../src/mcp/tools/index.js";
import { buildInstructions, createServer } from "../src/server.js";

function makeConfig(tools: ToolProfile): Config {
  return {
    baseUrl: "http://127.0.0.1:1",
    exportDir: "/tmp/openmonetis-mcp-test",
    origin: "http://127.0.0.1:1",
    writes: "read-only",
    timeoutMs: 1_000,
    maxResponseBytes: 65_536,
    cacheTtlMs: 30_000,
    retryAttempts: 2,
    tools,
    debug: false,
    http: { host: "127.0.0.1", port: 7317 },
  };
}

async function listToolNames(profile: ToolProfile): Promise<string[]> {
  const server = createServer(makeConfig(profile));
  const client = new Client({ name: "openmonetis-mcp-profile-test", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);

  try {
    const { tools } = await client.listTools();
    return tools.map((tool) => tool.name);
  } finally {
    await client.close();
    await server.close();
  }
}

describe("perfil de catálogo", () => {
  it("full mantém as 75 ferramentas", async () => {
    const names = await listToolNames("full");

    assert.equal(names.length, 75);
    assert.ok(names.includes("list_ai_chats"));
    assert.ok(names.includes("create_transaction"));
  });

  it("core expõe exatamente o conjunto enxuto", async () => {
    const names = await listToolNames("core");

    assert.deepEqual([...names].sort(), [...coreToolNames].sort());
    assert.equal(names.length, 14);
  });

  it("core não inclui ferramentas avançadas nem escrita", async () => {
    const names = await listToolNames("core");

    for (const advanced of [
      "list_ai_chats",
      "get_settings",
      "create_transaction",
      "delete_transaction",
    ]) {
      assert.equal(names.includes(advanced), false, `${advanced} não deveria estar no perfil core`);
    }
  });

  it("instructions do core avisa sobre o catálogo reduzido", () => {
    const core = buildInstructions("core");
    const full = buildInstructions("full");

    assert.match(core, /OPENMONETIS_MCP_TOOLS=core/);
    assert.match(core, /OPENMONETIS_MCP_TOOLS=full/);
    assert.equal(full.includes("Catálogo reduzido"), false);
  });
});

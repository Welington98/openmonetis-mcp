import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { capPayload, errorResult, jsonResult, textResult } from "../src/mcp/result.js";

function textOf(result: ReturnType<typeof jsonResult>): string {
  const item = result.content[0];
  return item?.type === "text" ? item.text : "";
}

describe("jsonResult", () => {
  it("serializa o JSON sem indentação", () => {
    const text = textOf(jsonResult({ items: [{ id: 1 }], total: 1 }));

    assert.equal(text, '{"items":[{"id":1}],"total":1}');
    assert.equal(text.includes("\n  "), false);
  });

  it("prefixa o resumo mantendo o JSON compacto", () => {
    const text = textOf(jsonResult({ ok: true }, { summary: "2 itens." }));

    assert.equal(text, '2 itens.\n\n{"ok":true}');
  });

  it("não altera o payload quando o teto está desligado", () => {
    const payload = { items: Array.from({ length: 50 }, (_, index) => ({ index })) };

    assert.deepEqual(capPayload(payload, 0), payload);
  });

  it("corta a lista até caber no teto e sinaliza o corte", () => {
    const payload = {
      total: 200,
      items: Array.from({ length: 200 }, (_, index) => ({
        id: `id-${index}`,
        name: `Transação número ${index}`,
      })),
    };

    const capped = capPayload(payload, 2_000) as {
      truncated: true;
      returned: number;
      available: number;
      items: unknown[];
      total: number;
    };

    assert.equal(capped.truncated, true);
    assert.equal(capped.available, 200);
    assert.equal(capped.total, 200, "total existente não deve ser sobrescrito");
    assert.ok(capped.items.length > 0);
    assert.ok(capped.items.length < 200);
    assert.equal(capped.items.length, capped.returned);
    assert.ok(Buffer.byteLength(JSON.stringify(capped), "utf8") <= 2_000);
  });

  it("embrulha lista de topo com metadados de corte", () => {
    const payload = Array.from({ length: 100 }, (_, index) => ({
      id: index,
      name: "x".repeat(20),
    }));

    const capped = capPayload(payload, 600) as {
      truncated: true;
      items: unknown[];
      available: number;
    };

    assert.equal(capped.truncated, true);
    assert.equal(capped.available, 100);
    assert.ok(capped.items.length < 100);
    assert.ok(Buffer.byteLength(JSON.stringify(capped), "utf8") <= 600);
  });

  it("corta data.items preservando o restante do objeto", () => {
    const payload = {
      period: "2026-11",
      data: {
        totalOpen: 100,
        items: Array.from({ length: 80 }, (_, index) => ({ id: index, name: "conta" })),
      },
    };

    const capped = capPayload(payload, 900) as {
      period: string;
      data: { totalOpen: number; truncated: true; items: unknown[] };
    };

    assert.equal(capped.period, "2026-11");
    assert.equal(capped.data.totalOpen, 100);
    assert.equal(capped.data.truncated, true);
    assert.ok(Buffer.byteLength(JSON.stringify(capped), "utf8") <= 900);
  });

  it("devolve aviso curto quando não há lista e o payload excede o teto", () => {
    const payload = { note: "x".repeat(5_000) };

    const capped = capPayload(payload, 500) as { truncated: true; bytes: number; notice: string };

    assert.equal(capped.truncated, true);
    assert.equal(capped.bytes > 500, true);
    assert.match(capped.notice, /excede o limite de 500/);
    assert.ok(Buffer.byteLength(JSON.stringify(capped), "utf8") <= 500);
  });

  it("mantém os campos do payload que não são listas", () => {
    const payload = { ids: [], count: 0 };

    assert.deepEqual(capPayload(payload, 1_000), payload);
  });
});

describe("textResult e errorResult", () => {
  it("devolve texto puro", () => {
    assert.equal(textOf(textResult("olá") as ReturnType<typeof jsonResult>), "olá");
  });

  it("marca erro e concatena a dica", () => {
    const result = errorResult("falhou", "tente de novo");
    const item = result.content[0];

    assert.equal(result.isError, true);
    assert.equal(item?.type === "text" ? item.text : "", "falhou\n\ntente de novo");
  });
});

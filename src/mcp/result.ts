import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export type JsonResultOptions = {
  summary?: string;
  /** Teto em bytes do JSON serializado; 0/undefined desliga o corte. */
  maxBytes?: number;
};

export function jsonResult(payload: unknown, options?: JsonResultOptions): CallToolResult {
  const capped = capPayload(payload, options?.maxBytes ?? 0);
  const json = JSON.stringify(capped);
  const text = options?.summary ? `${options.summary}\n\n${json}` : json;

  return {
    content: [{ type: "text", text }],
  };
}

export function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

export function errorResult(message: string, hint?: string): CallToolResult {
  const text = hint ? `${message}\n\n${hint}` : message;

  return {
    isError: true,
    content: [{ type: "text", text }],
  };
}

type ArrayLocation = {
  items: unknown[];
  /** Reconstrói o payload com os primeiros `count` itens e os metadados de corte. */
  build: (count: number, meta: TruncationMeta) => unknown;
};

type TruncationMeta = {
  truncated: true;
  returned: number;
  available: number;
  notice: string;
};

function truncationMeta(returned: number, available: number, maxBytes: number): TruncationMeta {
  return {
    truncated: true,
    returned,
    available,
    notice: `Resposta truncada para caber em ${maxBytes} bytes. Refine os filtros (period, detail: "compact", pageSize) para ver o restante.`,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function byteLength(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value) ?? "", "utf8");
}

function locateArray(payload: unknown): ArrayLocation | null {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      build: (count, meta) => ({ ...meta, items: payload.slice(0, count) }),
    };
  }

  if (!isRecord(payload)) return null;

  const topLevelItems = payload.items;

  if (Array.isArray(topLevelItems)) {
    return {
      items: topLevelItems,
      build: (count, meta) => ({ ...payload, items: topLevelItems.slice(0, count), ...meta }),
    };
  }

  const data = payload.data;

  if (Array.isArray(data)) {
    return {
      items: data,
      build: (count, meta) => ({ ...payload, data: data.slice(0, count), ...meta }),
    };
  }

  if (isRecord(data)) {
    const nestedItems = data.items;

    if (Array.isArray(nestedItems)) {
      return {
        items: nestedItems,
        build: (count, meta) => ({
          ...payload,
          data: { ...data, items: nestedItems.slice(0, count), ...meta },
        }),
      };
    }
  }

  return null;
}

/**
 * Mantém o JSON dentro de um teto de bytes cortando a maior lista reconhecida
 * (payload, `items` ou `data.items`) e sinalizando o corte explicitamente.
 * Sem lista para cortar, devolve um aviso curto em vez de estourar o contexto.
 */
export function capPayload(payload: unknown, maxBytes: number): unknown {
  if (!maxBytes || maxBytes <= 0) return payload;

  const bytes = byteLength(payload);
  if (bytes <= maxBytes) return payload;

  const location = locateArray(payload);

  if (!location) {
    return {
      truncated: true,
      bytes,
      notice: `Resposta de ${bytes} bytes excede o limite de ${maxBytes}. Refine os filtros (period, detail: "compact", pageSize) para receber menos dados.`,
    };
  }

  const available = location.items.length;
  let low = 0;
  let high = available;
  let best: unknown = null;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = location.build(middle, truncationMeta(middle, available, maxBytes));

    if (byteLength(candidate) <= maxBytes) {
      best = candidate;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  if (best !== null) return best;

  return {
    truncated: true,
    bytes,
    available,
    notice: `Resposta de ${bytes} bytes excede o limite de ${maxBytes} e nem um item isolado cabe. Refine os filtros (period, detail: "compact", pageSize).`,
  };
}

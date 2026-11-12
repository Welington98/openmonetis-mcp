/**
 * Leitores tolerantes usados pelas projeções compactas. A API pode omitir
 * campos opcionais; devolver `null` mantém o esquema estável sem inventar dado.
 */
export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asText(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

export function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

/** Mantém apenas os campos pedidos de cada item de uma lista de objetos. */
export function pickAll(items: unknown, fields: readonly string[]): Record<string, unknown>[] {
  return asArray(items).map((item) => {
    const record = asRecord(item);
    return Object.fromEntries(fields.map((field) => [field, record[field] ?? null]));
  });
}

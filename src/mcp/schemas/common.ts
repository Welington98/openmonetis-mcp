import { z } from "zod";

export const periodSchema = z
  .string()
  .regex(
    /^[1-9]\d{3}-(0[1-9]|1[0-2])$/,
    "Período inválido. Use o formato YYYY-MM, por exemplo 2026-07.",
  );

export const dateSchema = z.iso.date();
export const uuidSchema = z.uuid();

export const personScopeSchema = z.union([z.enum(["admin", "all"]), uuidSchema]);

export const confirmSchema = z
  .boolean()
  .optional()
  .describe(
    "Envie true para aplicar a alteração. Sem confirm, a ferramenta apenas descreve o que seria feito (dry-run).",
  );

export function currentPeriod(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

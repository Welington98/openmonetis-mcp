import { z } from "zod";
import { InputError } from "../../client/errors.js";
import { readLocalFile, saveBase64File } from "../../utils/files.js";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const transactionTypes = ["income", "expense", "transfer"] as const;
const transactionConditions = ["single", "installment", "recurring"] as const;
const paymentMethods = [
  "credit_card",
  "debit_card",
  "pix",
  "cash",
  "boleto",
  "benefits",
  "bank_transfer",
] as const;

const FileSelector = {
  filePath: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe("Caminho absoluto do arquivo (OFX/CSV/XLSX) no host onde o MCP roda."),
  fileName: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .describe("Nome do arquivo. Obrigatório apenas quando contentBase64 é usado."),
  contentBase64: z.string().min(1).optional().describe("Conteúdo do arquivo em base64."),
};

const PreviewInput = z.object(FileSelector);

const ExportInput = z.object({
  format: z.enum(["csv", "xlsx"]).default("csv"),
  period: periodSchema.optional(),
  q: z.string().trim().min(1).max(160).optional(),
  type: z.enum(transactionTypes).optional(),
  condition: z.enum(transactionConditions).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  settlement: z.enum(["paid", "unpaid", "invoice"]).optional(),
  personIds: z.array(uuidSchema).optional(),
  categoryIds: z.array(uuidSchema).optional(),
  tagIds: z.array(uuidSchema).optional(),
  accountIds: z.array(uuidSchema).optional(),
  cardIds: z.array(uuidSchema).optional(),
  dateStart: z.iso.date().optional(),
  dateEnd: z.iso.date().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
});

const ImportRowSchema = z.object({
  externalId: z.string().max(255).nullable().optional(),
  purchaseDate: z.iso.date(),
  amount: z.number().positive().max(999_999_999.99),
  name: z.string().trim().min(1).max(160),
  type: z.enum(["income", "expense"]),
  personId: uuidSchema,
  categoryId: uuidSchema,
});

const ImportInput = z.object({
  sourceFingerprint: z
    .string()
    .length(64)
    .regex(/^[a-f0-9]+$/)
    .describe("Fingerprint retornado por preview_transaction_import."),
  destinationType: z.enum(["account", "card"]),
  destinationId: uuidSchema,
  paymentMethod: z.enum(paymentMethods),
  invoicePeriod: periodSchema.optional(),
  rows: z.array(ImportRowSchema).min(1).max(1000),
  confirm: z.boolean().optional(),
});

async function resolveFileInput(input: Record<string, unknown>): Promise<{
  fileName: string;
  contentBase64: string;
}> {
  const args = PreviewInput.parse(input);

  if (args.filePath) {
    const file = await readLocalFile(args.filePath);
    return { fileName: file.fileName, contentBase64: file.contentBase64 };
  }

  if (!args.contentBase64 || !args.fileName) {
    throw new InputError("Informe `filePath` ou o par `fileName` + `contentBase64`.");
  }

  return { fileName: args.fileName, contentBase64: args.contentBase64 };
}

export const importTools: ReadToolSpec[] = [
  {
    name: "preview_transaction_import",
    title: "Pré-visualizar importação de extrato",
    description:
      "Envia um arquivo de extrato (OFX, CSV ou XLSX) e retorna o que seria importado: conta/cartão detectado, período, transações com duplicatas e categoria sugerida. Nada é gravado. Aceita `filePath` (host do MCP) ou `fileName` + `contentBase64`.",
    inputSchema: PreviewInput.shape,
    handler: async (input, ctx) => {
      const file = await resolveFileInput(input);
      const data = await ctx.client.request<{
        transactions?: unknown[];
        sourceName?: string;
        isCreditCard?: boolean;
        period?: { from: string; to: string } | null;
        sourceFingerprint?: string;
      }>("POST", "/transactions/imports/preview", { body: file });

      const rows = Array.isArray(data.transactions) ? data.transactions : [];
      const duplicates = rows.filter(
        (row) => (row as Record<string, unknown>).isDuplicate === true,
      ).length;

      return {
        data,
        summary: `${file.fileName}: ${rows.length} lançamento(s), ${duplicates} duplicado(s)${
          data.period ? ` · ${data.period.from} a ${data.period.to}` : ""
        }.`,
      };
    },
  },
  {
    name: "export_transactions",
    title: "Exportar transações",
    description:
      "Exporta as transações filtradas em CSV ou XLSX e grava o arquivo no diretório de exportação do host (padrão: ~/Downloads/openmonetis-mcp). Retorna o caminho absoluto e o número de linhas.",
    inputSchema: ExportInput.shape,
    handler: async (input, ctx) => {
      const args = ExportInput.parse(input);
      const data = await ctx.client.get<{
        fileName?: string;
        contentBase64?: string;
        rowCount?: number;
        contentType?: string;
      }>("/transactions/export", {
        format: args.format,
        period: args.period,
        q: args.q,
        type: args.type,
        condition: args.condition,
        paymentMethod: args.paymentMethod,
        settlement: args.settlement,
        personIds: args.personIds,
        categoryIds: args.categoryIds,
        tagIds: args.tagIds,
        accountIds: args.accountIds,
        cardIds: args.cardIds,
        dateStart: args.dateStart,
        dateEnd: args.dateEnd,
        minAmount: args.minAmount,
        maxAmount: args.maxAmount,
      });

      if (!data.contentBase64 || !data.fileName) {
        throw new InputError("A API não retornou conteúdo para exportação.");
      }

      const saved = await saveBase64File(ctx.config.exportDir, data.fileName, data.contentBase64);

      return {
        data: {
          path: saved.path,
          bytes: saved.bytes,
          rowCount: data.rowCount ?? null,
          contentType: data.contentType ?? null,
        },
        summary: `${data.rowCount ?? "?"} linha(s) exportada(s) para ${saved.path}.`,
      };
    },
  },
  {
    name: "get_import_template",
    title: "Baixar modelo de importação",
    description:
      "Baixa o modelo de planilha aceito pela importação e grava no diretório de exportação do host. Retorna o caminho do arquivo.",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<{ fileName?: string; contentBase64?: string }>(
        "/transactions/imports/template",
      );

      if (!data.fileName || !data.contentBase64) {
        throw new InputError("A API não retornou o modelo de importação.");
      }

      const saved = await saveBase64File(ctx.config.exportDir, data.fileName, data.contentBase64);

      return {
        data: { path: saved.path, bytes: saved.bytes },
        summary: `Modelo em ${saved.path}.`,
      };
    },
  },
];

export const importWriteTools: WriteToolSpec[] = [
  {
    name: "import_transactions",
    title: "Importar transações",
    description:
      "Grava no OpenMonetis as linhas já revisadas de uma importação de extrato. Use o `sourceFingerprint` e as linhas de preview_transaction_import, associando personId e categoryId a cada linha. Exige `confirm: true`.",
    inputSchema: ImportInput.shape,
    plan: (input) => {
      const args = ImportInput.parse(input);
      const { confirm: _confirm, ...body } = args;

      return {
        action: "Importar transações",
        method: "POST",
        path: "/transactions/imports",
        body,
        details: {
          destination: `${args.destinationType}:${args.destinationId}`,
          rows: args.rows.length,
        },
        summary: `Importar ${args.rows.length} transação(ões) para ${args.destinationType} ${args.destinationId}.`,
      };
    },
  },
  {
    name: "delete_import_batch",
    title: "Desfazer importação",
    description:
      "Remove um lote de importação e as transações criadas por ele. Exige `confirm: true`.",
    inputSchema: z.object({ batchId: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ batchId: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Desfazer importação",
        method: "DELETE",
        path: `/transactions/imports/${args.batchId}`,
        details: { batchId: args.batchId },
        summary: `Remover o lote de importação ${args.batchId}.`,
      };
    },
  },
];

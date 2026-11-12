import { z } from "zod";
import { InputError } from "../../client/errors.js";
import { guessMimeType, readLocalFile } from "../../utils/files.js";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { periodSchema, uuidSchema } from "../schemas/common.js";

const mimeTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;

const ListAttachmentsInput = z.object({
  period: periodSchema.describe("Mês de referência (YYYY-MM)."),
  q: z.string().trim().min(1).max(160).optional(),
  kind: z.enum(["image", "pdf"]).optional(),
  personId: uuidSchema.optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z
    .union([z.literal(20), z.literal(40), z.literal(80)])
    .default(20)
    .describe("Itens por página: 20, 40 ou 80."),
});

const UploadInput = z.object({
  transactionId: uuidSchema,
  filePath: z.string().trim().min(1).describe("Caminho absoluto do arquivo no host do MCP."),
  mimeType: z
    .enum(mimeTypes)
    .optional()
    .describe("Detectado pela extensão quando omitido (.pdf, .jpg/.jpeg, .png, .webp)."),
  confirm: z.boolean().optional(),
});

export const attachmentTools: ReadToolSpec[] = [
  {
    name: "list_transaction_attachments",
    title: "Anexos da transação",
    description: "Lista os anexos (comprovantes, notas) vinculados a uma transação.",
    inputSchema: z.object({ transactionId: uuidSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ transactionId: uuidSchema }).parse(input);
      const data = await ctx.client.get<unknown[]>(
        `/attachments/transaction/${args.transactionId}`,
      );
      const items = Array.isArray(data) ? data : [];

      return { data: items, summary: `${items.length} anexo(s).` };
    },
  },
  {
    name: "get_attachment_download_url",
    title: "Link de download do anexo",
    description:
      "Gera uma URL assinada e temporária para baixar (ou visualizar) um anexo. Retorna a URL e o instante de expiração.",
    inputSchema: z.object({
      id: uuidSchema,
      disposition: z.enum(["inline", "attachment"]).default("attachment"),
    }).shape,
    handler: async (input, ctx) => {
      const args = z
        .object({
          id: uuidSchema,
          disposition: z.enum(["inline", "attachment"]).default("attachment"),
        })
        .parse(input);

      const data = await ctx.client.get<{ url?: string; expiresAt?: string }>(
        `/attachments/${args.id}/download-url`,
        { disposition: args.disposition },
      );

      return { data, summary: `Link válido até ${data.expiresAt ?? "?"}.` };
    },
  },
  {
    name: "list_attachments",
    title: "Listar anexos",
    description:
      "Lista os anexos do usuário em um mês, com filtros por texto, tipo (image/pdf) e pessoa, paginado.",
    inputSchema: ListAttachmentsInput.shape,
    handler: async (input, ctx) => {
      const args = ListAttachmentsInput.parse(input);

      const data = await ctx.client.get<{ items?: unknown[]; total?: number }>("/attachments", {
        period: args.period,
        q: args.q,
        kind: args.kind,
        personId: args.personId,
        page: args.page,
        pageSize: args.pageSize,
      });

      const items = Array.isArray(data.items) ? data.items.length : 0;

      return {
        data,
        summary: `${items} de ${data.total ?? items} anexo(s).`,
      };
    },
  },
];

export const attachmentWriteTools: WriteToolSpec[] = [
  {
    name: "upload_attachment",
    title: "Anexar arquivo à transação",
    description:
      "Envia um arquivo do host (PDF ou imagem) para uma transação usando o fluxo de upload assinado: prepare → upload → confirm. Exige `confirm: true`.",
    inputSchema: UploadInput.shape,
    plan: async (input) => {
      const args = UploadInput.parse(input);

      // Com confirm: true o plano é descartado e o arquivo seria lido duas vezes
      // (aqui e no execute). Valida só a extensão, sem tocar no conteúdo.
      if (args.confirm === true) {
        const mimeType = args.mimeType ?? guessMimeType(args.filePath);
        if (!mimeType) {
          throw new InputError("Extensão não suportada. Use .pdf, .jpg, .jpeg, .png ou .webp.");
        }

        return {
          action: "Anexar arquivo",
          method: "POST",
          path: "/attachments/prepare",
          details: { transactionId: args.transactionId, mimeType },
          summary: `Anexar arquivo à transação ${args.transactionId}.`,
        };
      }

      const file = await readLocalFile(args.filePath, 20_000_000);
      const mimeType = args.mimeType ?? guessMimeType(file.fileName);

      if (!mimeType) {
        throw new InputError("Extensão não suportada. Use .pdf, .jpg, .jpeg, .png ou .webp.");
      }

      return {
        action: "Anexar arquivo",
        method: "POST",
        path: "/attachments/prepare",
        details: {
          transactionId: args.transactionId,
          fileName: file.fileName,
          bytes: file.bytes,
          mimeType,
        },
        summary: `Anexar "${file.fileName}" (${file.bytes} bytes) à transação ${args.transactionId}.`,
      };
    },
    execute: async (input, ctx) => {
      const args = UploadInput.parse(input);
      const file = await readLocalFile(args.filePath, 20_000_000);
      const mimeType = args.mimeType ?? guessMimeType(file.fileName);

      if (!mimeType) {
        throw new InputError("Extensão não suportada. Use .pdf, .jpg, .jpeg, .png ou .webp.");
      }

      const prepared = await ctx.client.request<{ uploadId: string; uploadUrl: string }>(
        "POST",
        "/attachments/prepare",
        {
          body: {
            transactionId: args.transactionId,
            fileName: file.fileName,
            fileSize: file.bytes,
            mimeType,
          },
        },
      );

      const upload = await fetch(prepared.uploadUrl, {
        method: "PUT",
        headers: { "content-type": mimeType },
        body: Buffer.from(file.contentBase64, "base64"),
      });

      if (!upload.ok) {
        throw new InputError(`O upload do arquivo falhou com status ${upload.status}.`);
      }

      const attachment = await ctx.client.request("POST", "/attachments/confirm", {
        body: { uploadId: prepared.uploadId, transactionId: args.transactionId },
      });

      return {
        data: attachment,
        summary: `Anexo "${file.fileName}" enviado para a transação ${args.transactionId}.`,
      };
    },
  },
  {
    name: "delete_attachment",
    title: "Excluir anexo",
    description: "Exclui definitivamente um anexo. Exige `confirm: true`.",
    inputSchema: z.object({ id: uuidSchema, confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: (input) => {
      const args = z.object({ id: uuidSchema, confirm: z.boolean().optional() }).parse(input);

      return {
        action: "Excluir anexo",
        method: "DELETE",
        path: `/attachments/${args.id}`,
        details: { id: args.id },
        summary: `Excluir o anexo ${args.id}.`,
      };
    },
  },
];

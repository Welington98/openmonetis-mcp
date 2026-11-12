import { z } from "zod";
import { InputError } from "../../client/errors.js";
import type { ReadToolSpec, WriteToolSpec } from "../runner.js";
import { uuidSchema } from "../schemas/common.js";
import { CreateTransactionFields } from "./transactions.js";

const inboxStatuses = ["pending", "processed", "discarded"] as const;
const textConditionFields = [
  "sourceApp",
  "sourceAppName",
  "originalTitle",
  "originalText",
  "parsedName",
] as const;
const textConditionOperators = ["contains", "equals", "startsWith", "endsWith"] as const;
const numericConditionOperators = ["equals", "greaterThan", "lessThan"] as const;

const ConditionSchema = z.union([
  z.object({
    field: z.enum(textConditionFields).describe("Campo de texto da notificação analisado."),
    operator: z.enum(textConditionOperators),
    value: z.string().trim().min(1).max(255),
  }),
  z.object({
    field: z.literal("parsedAmount"),
    operator: z.enum(numericConditionOperators),
    value: z.number().positive().max(999_999_999.99),
  }),
]);

const ListItemsInput = z.object({
  status: z.enum(inboxStatuses).default("pending"),
  sourceAppName: z.string().trim().min(1).max(255).optional(),
  notificationDate: z.iso.date().optional(),
  ruleId: uuidSchema.optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});

const CreateRuleInput = z.object({
  name: z.string().trim().min(1).max(120),
  priority: z.number().int().min(0).max(9_999),
  isActive: z.boolean(),
  matchMode: z.enum(["all", "any"]).describe("all = todas as condições; any = qualquer uma."),
  conditions: z.array(ConditionSchema).min(1).max(10),
  categoryId: uuidSchema.nullable(),
  personId: uuidSchema.nullable(),
  confirm: z.boolean().optional(),
});

const ConfirmItemInput = CreateTransactionFields.omit({ confirm: true }).extend({
  inboxItemId: uuidSchema.describe("ID do item da caixa de entrada."),
  confirm: z.boolean().optional(),
});

export const inboxTools: ReadToolSpec[] = [
  {
    name: "list_inbox_items",
    title: "Caixa de entrada",
    description:
      "Lista as notificações capturadas (inbox) por status, app de origem, data ou regra aplicada. Cada item traz o texto original, o nome/valor interpretado e o status.",
    inputSchema: ListItemsInput.shape,
    handler: async (input, ctx) => {
      const args = ListItemsInput.parse(input);
      const data = await ctx.client.get<{ items?: unknown[]; total?: number }>("/inbox", {
        status: args.status,
        sourceAppName: args.sourceAppName,
        notificationDate: args.notificationDate,
        ruleId: args.ruleId,
        page: args.page,
        pageSize: args.pageSize,
      });

      const items = Array.isArray(data.items) ? data.items.length : 0;

      return { data, summary: `${items} item(ns) no status ${args.status}.` };
    },
  },
  {
    name: "get_inbox_snapshot",
    title: "Resumo da caixa de entrada",
    description:
      "Resumo rápido do inbox: contagens por status e os últimos itens pendentes. Útil para saber se há capturas aguardando revisão.",
    inputSchema: z.object({ limit: z.number().int().min(1).max(6).default(4) }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ limit: z.number().int().min(1).max(6).default(4) }).parse(input);

      return { data: await ctx.client.get("/inbox/snapshot", { limit: args.limit }) };
    },
  },
  {
    name: "list_inbox_rules",
    title: "Regras da caixa de entrada",
    description:
      "Lista as regras que categorizam automaticamente as notificações capturadas, com prioridade, condições e ação (categoria/pessoa).",
    inputSchema: z.object({}).shape,
    handler: async (_input, ctx) => {
      const data = await ctx.client.get<{ items?: unknown[]; total?: number }>("/inbox-rules");
      const items = Array.isArray(data.items) ? data.items.length : 0;

      return { data, summary: `${items} regra(s).` };
    },
  },
  {
    name: "suggest_inbox_item",
    title: "Sugerir categoria para item do inbox",
    description:
      "Mostra qual categoria e pessoa as regras aplicariam a um item da caixa de entrada, sem confirmar nada.",
    inputSchema: z.object({ inboxItemId: uuidSchema }).shape,
    handler: async (input, ctx) => {
      const args = z.object({ inboxItemId: uuidSchema }).parse(input);

      return { data: await ctx.client.get(`/inbox-rules/suggestions/${args.inboxItemId}`) };
    },
  },
];

export const inboxWriteTools: WriteToolSpec[] = [
  {
    name: "confirm_inbox_item",
    title: "Confirmar item do inbox como lançamento",
    description:
      "Converte um item capturado em transação. Recebe os mesmos campos de create_transaction. Exige `confirm: true`; sem isso devolve o payload proposto.",
    inputSchema: ConfirmItemInput.shape,
    plan: (input) => {
      const { inboxItemId, confirm: _confirm, ...body } = ConfirmItemInput.parse(input);

      return {
        action: "Confirmar item do inbox",
        method: "POST",
        path: `/inbox/${inboxItemId}/confirm`,
        body,
        details: { inboxItemId, name: body.name, amount: body.amount },
        summary: `Criar lançamento "${body.name}" de ${body.amount} a partir do item ${inboxItemId}.`,
      };
    },
  },
  {
    name: "discard_inbox_items",
    title: "Descartar itens do inbox",
    description: "Descarta um ou mais itens da caixa de entrada. Exige `confirm: true`.",
    inputSchema: z.object({
      ids: z.array(uuidSchema).min(1).max(100),
      confirm: z.boolean().optional(),
    }).shape,
    plan: (input) => {
      const args = z
        .object({ ids: z.array(uuidSchema).min(1).max(100), confirm: z.boolean().optional() })
        .parse(input);
      const { confirm: _confirm, ...body } = args;

      return {
        action: "Descartar itens do inbox",
        method: "POST",
        path: "/inbox/discard",
        body,
        details: { count: args.ids.length },
        summary: `Descartar ${args.ids.length} item(ns) do inbox.`,
      };
    },
  },
  {
    name: "create_inbox_rule",
    title: "Criar regra do inbox",
    description:
      "Cria uma regra que categoriza automaticamente notificações capturadas. Informe ao menos categoria ou pessoa. Exige `confirm: true`.",
    inputSchema: CreateRuleInput.shape,
    plan: (input) => {
      const args = CreateRuleInput.parse(input);
      const { confirm: _confirm, ...body } = args;

      if (!body.categoryId && !body.personId) {
        throw new InputError("Informe categoryId e/ou personId na regra.");
      }

      return {
        action: "Criar regra do inbox",
        method: "POST",
        path: "/inbox-rules",
        body,
        details: { name: body.name, conditions: body.conditions.length },
        summary: `Criar regra "${body.name}" com ${body.conditions.length} condição(ões).`,
      };
    },
  },
  {
    name: "delete_inbox_rule",
    title: "Excluir regra do inbox",
    description:
      "Exclui uma regra do inbox. A API exige a versão atual do registro em `expectedVersion`. Exige `confirm: true`.",
    inputSchema: z.object({
      id: uuidSchema,
      expectedVersion: z.number().int().positive(),
      confirm: z.boolean().optional(),
    }).shape,
    destructive: true,
    plan: (input) => {
      const args = z
        .object({
          id: uuidSchema,
          expectedVersion: z.number().int().positive(),
          confirm: z.boolean().optional(),
        })
        .parse(input);

      return {
        action: "Excluir regra do inbox",
        method: "DELETE",
        path: `/inbox-rules/${args.id}?expectedVersion=${args.expectedVersion}`,
        details: { id: args.id, expectedVersion: args.expectedVersion },
        summary: `Excluir regra ${args.id}.`,
      };
    },
  },
];

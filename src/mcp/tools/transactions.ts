import { z } from "zod";
import { ApiError, InputError } from "../../client/errors.js";
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
const recurrenceFrequencies = [
  "weekly",
  "monthly",
  "bimonthly",
  "quarterly",
  "semiannual",
  "annual",
] as const;

const pageSizeSchema = z
  .union([
    z.literal(5),
    z.literal(10),
    z.literal(20),
    z.literal(30),
    z.literal(40),
    z.literal(50),
    z.literal(100),
  ])
  .describe("Itens por página. Valores aceitos: 5, 10, 20, 30, 40, 50 ou 100.");

const ListInput = z.object({
  period: periodSchema.optional().describe("Mês de referência (YYYY-MM)."),
  q: z.string().trim().min(1).max(160).optional().describe("Busca por nome/estabelecimento."),
  type: z.enum(transactionTypes).optional(),
  condition: z.enum(transactionConditions).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  settlement: z
    .enum(["paid", "unpaid", "invoice"])
    .optional()
    .describe("Filtra por situação: pago, não pago ou dentro de fatura de cartão."),
  payables: z
    .boolean()
    .optional()
    .describe("Quando true, retorna apenas contas a pagar em aberto."),
  sort: z.enum(["recent", "oldest", "dueDate", "amount"]).optional(),
  personIds: z.array(uuidSchema).optional(),
  categoryIds: z.array(uuidSchema).optional(),
  tagIds: z.array(uuidSchema).optional(),
  accountIds: z.array(uuidSchema).optional(),
  cardIds: z.array(uuidSchema).optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
  dateStart: z.iso.date().optional().describe("Data inicial (YYYY-MM-DD), inclusiva."),
  dateEnd: z.iso.date().optional().describe("Data final (YYYY-MM-DD), inclusiva."),
  page: z.number().int().min(1).default(1),
  pageSize: pageSizeSchema.default(30),
  detail: z
    .enum(["compact", "full"])
    .default("compact")
    .describe("compact retorna os campos essenciais; full devolve o objeto completo da API."),
});

const IdInput = z.object({ id: uuidSchema.describe("ID da transação.") });

const BaseTransactionFields = {
  name: z.string().trim().min(1).max(160),
  amount: z.number().positive().max(999_999_999.99),
  type: z.enum(transactionTypes),
  condition: z.enum(transactionConditions),
  paymentMethod: z.enum(paymentMethods),
  purchaseDate: z.iso.date(),
  personId: uuidSchema,
  categoryId: uuidSchema.optional(),
  accountId: uuidSchema.optional(),
  cardId: uuidSchema.optional(),
  sourceAccountId: uuidSchema
    .optional()
    .describe("Conta de origem, obrigatória em transferências."),
  destinationAccountId: uuidSchema
    .optional()
    .describe("Conta de destino, obrigatória em transferências."),
  invoicePeriod: periodSchema
    .optional()
    .describe("Fatura do cartão (apenas crédito não recorrente)."),
  dueDate: z.iso.date().optional(),
  settledDate: z.iso.date().optional(),
  boletoPaymentDate: z.iso.date().optional(),
  installmentCount: z.number().int().min(2).max(60).optional(),
  startInstallment: z.number().int().min(1).max(60).optional(),
  recurrenceFrequency: z.enum(recurrenceFrequencies).optional(),
  recurrenceEndDate: z.iso.date().optional(),
  isSettled: z.boolean().optional(),
  note: z.string().trim().max(1000).optional(),
  tagIds: z.array(uuidSchema).optional(),
  splitShares: z
    .array(z.object({ personId: uuidSchema, amount: z.number().positive() }))
    .min(2)
    .max(50)
    .optional()
    .describe("Divisão entre pessoas. A soma deve ser igual ao amount."),
};

export const CreateTransactionInput = z.object({
  ...BaseTransactionFields,
  condition: z.enum(transactionConditions).default("single"),
  confirm: z.boolean().optional(),
});

const CreateInput = CreateTransactionInput;

const UpdateInput = z
  .object(BaseTransactionFields)
  .partial()
  .extend({ id: uuidSchema, confirm: z.boolean().optional() });

const SettleInput = z.object({
  ids: z.array(uuidSchema).min(1).max(500).describe("IDs das transações a marcar/desmarcar."),
  isSettled: z.boolean(),
  settledDate: z.iso.date().optional(),
  settledAmount: z.number().positive().max(999_999_999.99).optional(),
  accountId: uuidSchema.optional(),
  confirm: z.boolean().optional(),
});

export const transactionTools: ReadToolSpec[] = [
  {
    name: "list_transactions",
    title: "Listar transações",
    description:
      'Lista transações paginadas com filtros por período, texto, tipo, condição, forma de pagamento, situação, pessoa, categoria, tag, conta, cartão e faixa de valor. Retorna o total e os itens (versão compacta por padrão). Use `detail: "full"` quando precisar de todos os campos de um item específico.',
    inputSchema: ListInput.shape,
    handler: async (input, ctx) => {
      const args = ListInput.parse(input);
      const query = {
        period: args.period,
        q: args.q,
        type: args.type,
        condition: args.condition,
        paymentMethod: args.paymentMethod,
        settlement: args.settlement,
        payables: args.payables === true ? true : undefined,
        sort: args.sort,
        personIds: args.personIds,
        categoryIds: args.categoryIds,
        tagIds: args.tagIds,
        accountIds: args.accountIds,
        cardIds: args.cardIds,
        minAmount: args.minAmount,
        maxAmount: args.maxAmount,
        dateStart: args.dateStart,
        dateEnd: args.dateEnd,
        page: args.page,
        pageSize: args.pageSize,
      };

      const data = await ctx.client.get<{
        items?: unknown[];
        total?: number;
        page?: number;
        pageSize?: number;
      }>("/transactions", query);

      const items = Array.isArray(data.items) ? data.items : [];
      const projected =
        args.detail === "full" ? items : items.map((item) => compactTransaction(item));

      return {
        data: {
          total: data.total ?? items.length,
          page: data.page ?? args.page,
          pageSize: data.pageSize ?? args.pageSize,
          items: projected,
        },
        summary: summarizePage(items, data.total ?? null, args.period ?? null),
      };
    },
  },
  {
    name: "get_transaction",
    title: "Detalhar transação",
    description:
      "Retorna todos os campos de uma transação: valores, rateio entre pessoas, cartão/conta, categoria, vencimento, parcelas, recorrência, reembolsos e anexos.",
    inputSchema: IdInput.shape,
    handler: async (input, ctx) => {
      const args = IdInput.parse(input);
      const data = await ctx.client.get<Record<string, unknown>>(`/transactions/${args.id}`);

      return {
        data,
        summary: `${String(data.name ?? "Transação")} · ${formatMoney(data.displayAmount)} em ${String(data.purchaseDate ?? "?")}.`,
      };
    },
  },
];

export const transactionWriteTools: WriteToolSpec[] = [
  {
    name: "create_transaction",
    title: "Criar transação",
    description:
      "Cria uma transação de receita, despesa, transferência, compra parcelada ou série recorrente. A API valida todas as regras de domínio (categoria obrigatória em receita/despesa, cartão obrigatório no crédito, contas distintas em transferência, etc.). Sem `confirm: true` a ferramenta apenas devolve o payload que seria enviado.",
    inputSchema: CreateInput.shape,
    plan: (input) => {
      const args = CreateInput.parse(input);
      const { confirm: _confirm, ...body } = args;

      return {
        action: "Criar transação",
        method: "POST",
        path: "/transactions",
        body,
        summary: `Criar ${body.type} "${body.name}" de ${formatMoney(body.amount)} em ${body.purchaseDate}.`,
      };
    },
  },
  {
    name: "update_transaction",
    title: "Atualizar transação",
    description:
      "Atualiza campos de uma transação existente. Envie apenas os campos que devem mudar — campos omitidos são preservados (inclusive `condition`, `installmentCount` e `recurrenceFrequency`). Sem `confirm: true` a ferramenta devolve o payload que seria enviado.",
    inputSchema: UpdateInput.shape,
    plan: (input) => {
      const { id, confirm: _confirm, ...rest } = UpdateInput.parse(input);
      const fields = Object.entries(rest).filter(([, value]) => value !== undefined);

      if (fields.length === 0) {
        throw new InputError("Informe ao menos um campo para atualizar.");
      }

      return {
        action: "Atualizar transação",
        method: "PATCH",
        path: `/transactions/${id}`,
        body: Object.fromEntries(fields),
        details: { id, fields: fields.map(([key]) => key) },
        summary: `Atualizar transação ${id} (${fields.map(([key]) => key).join(", ")}).`,
      };
    },
  },
  {
    name: "delete_transaction",
    title: "Excluir transação",
    description:
      "Exclui definitivamente uma transação. A ferramenta busca a transação antes de excluir para mostrar nome, valor e data no dry-run. Exige `confirm: true` para executar.",
    inputSchema: IdInput.extend({ confirm: z.boolean().optional() }).shape,
    destructive: true,
    plan: async (input, ctx) => {
      const args = IdInput.extend({ confirm: z.boolean().optional() }).parse(input);
      const existing = await fetchTransactionOrNull(ctx.client, args.id);

      return {
        action: "Excluir transação",
        method: "DELETE",
        path: `/transactions/${args.id}`,
        details: existing
          ? {
              name: existing.name,
              amount: existing.displayAmount,
              purchaseDate: existing.purchaseDate,
              category: existing.categoryName,
            }
          : { warning: "Transação não encontrada ou já removida." },
        summary: existing
          ? `Excluir "${String(existing.name)}" de ${formatMoney(existing.displayAmount)} (${String(existing.purchaseDate)}).`
          : `Excluir transação ${args.id}.`,
      };
    },
  },
  {
    name: "settle_transactions",
    title: "Marcar transações como pagas/recebidas",
    description:
      "Marca ou desmarca uma ou mais transações como liquidadas, opcionalmente informando data, valor pago e conta usada. Exige `confirm: true` para executar.",
    inputSchema: SettleInput.shape,
    plan: (input) => {
      const args = SettleInput.parse(input);
      const { confirm: _confirm, ...body } = args;

      return {
        action: args.isSettled ? "Marcar como liquidada" : "Marcar como não liquidada",
        method: "PATCH",
        path: "/transactions/settlement",
        body,
        details: { count: args.ids.length },
        summary: `${args.isSettled ? "Liquidar" : "Reabrir"} ${args.ids.length} transação(ões).`,
      };
    },
  },
];

async function fetchTransactionOrNull(
  client: { get<T>(path: string, query?: Record<string, unknown>): Promise<T> },
  id: string,
): Promise<Record<string, unknown> | null> {
  try {
    return await client.get<Record<string, unknown>>(`/transactions/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function compactTransaction(item: unknown): Record<string, unknown> {
  const record = asRecord(item);
  const installmentCount = asNumber(record.installmentCount);
  const currentInstallment = asNumber(record.currentInstallment);

  return {
    id: asText(record.id),
    name: asText(record.name),
    type: asText(record.type),
    condition: asText(record.condition),
    paymentMethod: asText(record.paymentMethod),
    amount: asNumber(record.amount),
    displayAmount: asNumber(record.displayAmount),
    purchaseDate: asText(record.purchaseDate),
    dueDate: asText(record.dueDate),
    period: asText(record.period),
    isSettled: asBoolean(record.isSettled),
    settledDate: asText(record.settledDate),
    person: asText(record.personName),
    account: asText(record.accountName),
    card: asText(record.cardName),
    category: asText(record.categoryName),
    installment:
      installmentCount !== null && currentInstallment !== null
        ? `${currentInstallment}/${installmentCount}`
        : null,
    recurrenceFrequency: asText(record.recurrenceFrequency),
    note: asText(record.note),
    refundableAmount: asNumber(record.refundableAmount),
  };
}

function summarizePage(items: unknown[], total: number | null, period: string | null): string {
  let income = 0;
  let expenses = 0;

  for (const item of items) {
    const record = asRecord(item);
    const amount = asNumber(record.displayAmount) ?? 0;
    const type = asText(record.type);

    if (type === "income") income += amount;
    if (type === "expense") expenses += amount;
  }

  const scope = period ? ` em ${period}` : "";
  const count = `${items.length} de ${total ?? items.length} transações${scope}`;

  return `${count} · receitas ${formatMoney(income)} · despesas ${formatMoney(expenses)}.`;
}

function formatMoney(value: unknown): string {
  const amount = asNumber(value);
  if (amount === null) return "-";

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

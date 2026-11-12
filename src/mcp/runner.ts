import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodError, type z } from "zod";
import type { ApiClient, HttpMethod } from "../client/api-client.js";
import {
  ApiError,
  AuthError,
  ConfigError,
  NetworkError,
  OpenMonetisError,
} from "../client/errors.js";
import type { Config } from "../config.js";
import { errorResult, jsonResult, textResult } from "./result.js";

export type ToolContext = {
  client: ApiClient;
  config: Config;
};

export type ToolPayload = {
  data?: unknown;
  text?: string;
  summary?: string;
};

type BaseSpec = {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodRawShape;
};

export type ReadToolSpec = BaseSpec & {
  handler: (input: Record<string, unknown>, ctx: ToolContext) => Promise<ToolPayload>;
};

export type WritePlan = {
  action: string;
  method: HttpMethod;
  path: string;
  body?: unknown;
  summary?: string;
  details?: Record<string, unknown>;
};

export type WriteToolSpec = BaseSpec & {
  destructive?: boolean;
  plan: (input: Record<string, unknown>, ctx: ToolContext) => Promise<WritePlan> | WritePlan;
  /** Substitui a execução padrão (uma requisição) quando a operação tem vários passos. */
  execute?: (
    input: Record<string, unknown>,
    ctx: ToolContext,
    plan: WritePlan,
  ) => Promise<ToolPayload>;
};

export type ToolCatalog = {
  reads: ReadToolSpec[];
  writes: WriteToolSpec[];
};

export function registerCatalog(server: McpServer, catalog: ToolCatalog, ctx: ToolContext): void {
  for (const spec of catalog.reads) registerRead(server, spec, ctx);
  for (const spec of catalog.writes) registerWrite(server, spec, ctx);
}

function registerRead(server: McpServer, spec: ReadToolSpec, ctx: ToolContext): void {
  server.registerTool(
    spec.name,
    {
      title: spec.title,
      description: spec.description,
      inputSchema: spec.inputSchema,
      annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (input) =>
      guarded(async () => {
        const payload = await spec.handler(input as Record<string, unknown>, ctx);
        return toResult(payload);
      }),
  );
}

function registerWrite(server: McpServer, spec: WriteToolSpec, ctx: ToolContext): void {
  server.registerTool(
    spec.name,
    {
      title: spec.title,
      description: spec.description,
      inputSchema: spec.inputSchema,
      annotations: {
        readOnlyHint: false,
        idempotentHint: false,
        destructiveHint: spec.destructive ?? false,
        openWorldHint: false,
      },
    },
    async (input) => guarded(async () => executeWrite(spec, input as Record<string, unknown>, ctx)),
  );
}

async function executeWrite(spec: WriteToolSpec, input: Record<string, unknown>, ctx: ToolContext) {
  if (ctx.config.writes === "read-only") {
    return errorResult(
      "Escrita desabilitada nesta configuração do MCP.",
      "Defina OPENMONETIS_MCP_WRITES=confirm (padrão) ou OPENMONETIS_MCP_WRITES=full para permitir alterações.",
    );
  }

  const plan = await spec.plan(input, ctx);
  const requiresConfirmation = ctx.config.writes === "confirm" && input.confirm !== true;

  if (requiresConfirmation) {
    return jsonResult({
      dryRun: true,
      action: plan.action,
      method: plan.method,
      path: plan.path,
      body: plan.body ?? null,
      details: plan.details ?? null,
      notice:
        "Nada foi alterado. Reenvie a mesma chamada com confirm: true para aplicar a alteração.",
    });
  }

  if (spec.execute) {
    return toResult(await spec.execute(input, ctx, plan));
  }

  const data = await ctx.client.request<unknown>(plan.method, plan.path, { body: plan.body });
  const summary = plan.summary ? `${plan.summary} (aplicado)` : undefined;

  return jsonResult({ ok: true, action: plan.action, data }, { summary });
}

function toResult(payload: ToolPayload) {
  if (payload.data === undefined && payload.text !== undefined) {
    return textResult(payload.summary ? `${payload.summary}\n\n${payload.text}` : payload.text);
  }

  return jsonResult(payload.data ?? null, { summary: payload.summary });
}

async function guarded(operation: () => Promise<ReturnType<typeof jsonResult>>) {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResult("Argumentos inválidos para esta ferramenta.", formatZodError(error));
    }

    if (error instanceof ApiError) {
      return errorResult(error.message, error.code ? `Código da API: ${error.code}` : undefined);
    }

    if (error instanceof AuthError) {
      return errorResult(error.message, error.hint);
    }

    if (
      error instanceof ConfigError ||
      error instanceof NetworkError ||
      error instanceof OpenMonetisError
    ) {
      return errorResult(error.message);
    }

    return errorResult(
      "Erro inesperado ao falar com o OpenMonetis.",
      error instanceof Error ? error.message : String(error),
    );
  }
}

function formatZodError(error: ZodError): string {
  return error.issues
    .slice(0, 8)
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `- ${path}: ${issue.message}` : `- ${issue.message}`;
    })
    .join("\n");
}

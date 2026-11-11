import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function jsonResult(payload: unknown, options?: { summary?: string }): CallToolResult {
  const json = JSON.stringify(payload, null, 2);
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

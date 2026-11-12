import { AuthError } from "../client/errors.js";
import { SessionManager } from "../client/session.js";
import { type Config, normalizeBaseUrl } from "../config.js";
import {
  clearStoredCredentials,
  readStoredCredentials,
  storeKind,
  writeStoredCredentials,
} from "../credentials/store.js";
import { promptLine, promptSecret } from "./prompt.js";

const usage = `Uso: openmonetis-mcp auth <comando>

Comandos:
  set      Guarda URL, e-mail e senha no cofre local (valida o login antes de salvar)
           Não-interativo: auth set --url=<url> --email=<email> --password-stdin
  status   Mostra de onde vêm as credenciais, sem revelar o segredo
  clear    Remove as credenciais guardadas

O cofre usa Keychain (macOS), secret-tool (Linux) ou um arquivo 0600 como fallback.
As variáveis OPENMONETIS_EMAIL/OPENMONETIS_PASSWORD sempre têm precedência.`;

export async function runAuthCommand(argv: string[]): Promise<number> {
  const command = argv[0];

  if (!command || command === "--help" || command === "-h" || command === "help") {
    process.stdout.write(`${usage}\n`);
    return command ? 0 : 1;
  }

  if (command === "status") return status();
  if (command === "clear") return clear();
  if (command === "set") return set(argv.slice(1));

  process.stderr.write(`Comando desconhecido: ${command}\n\n${usage}\n`);
  return 1;
}

async function set(argv: string[]): Promise<number> {
  const stored = readStoredCredentials();
  const urlFlag = flagValue(argv, "--url");
  const emailFlag = flagValue(argv, "--email");
  const passwordFromStdin = argv.includes("--password-stdin");

  const rawUrl =
    urlFlag ??
    (await promptLine(
      `URL do OpenMonetis [${stored?.baseUrl ?? "http://localhost:7001"}]: `,
      stored?.baseUrl ?? "http://localhost:7001",
    ));

  let baseUrl: string;
  try {
    baseUrl = normalizeBaseUrl(rawUrl);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }

  const email =
    emailFlag ?? (await promptLine(`E-mail [${stored?.email ?? ""}]: `, stored?.email ?? ""));

  if (!email) {
    process.stderr.write("E-mail é obrigatório.\n");
    return 1;
  }

  const secret = passwordFromStdin
    ? (await readStdin()).trim()
    : await promptSecret(`Credencial de ${email} (não será exibida): `);

  if (!secret) {
    process.stderr.write("Credencial vazia.\n");
    return 1;
  }

  try {
    await new SessionManager(validationConfig(baseUrl, email, secret)).ensure();
  } catch (error) {
    if (error instanceof AuthError) {
      process.stderr.write(`\nFalha ao validar o login: ${error.message}\n`);
      if (error.hint) process.stderr.write(`${error.hint}\n`);
    } else {
      process.stderr.write(
        `\nFalha ao validar o login: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
    process.stderr.write("Nada foi salvo.\n");
    return 1;
  }

  const kind = writeStoredCredentials({ baseUrl, email, secret });
  process.stdout.write(`\nLogin validado. Guardado em: ${describeStore(kind)}.\n`);
  return 0;
}

function status(): number {
  const kind = storeKind();

  if (kind === "none") {
    process.stdout.write("Armazenamento desabilitado (OPENMONETIS_CREDENTIAL_STORE=none).\n");
    return 0;
  }

  const stored = readStoredCredentials();
  const cookieEnvName = ["OPENMONETIS", "COOKIE"].join("_");

  process.stdout.write(`Cofre: ${describeStore(kind)}\n`);

  if (process.env.OPENMONETIS_EMAIL) {
    process.stdout.write("Origem efetiva: OPENMONETIS_EMAIL (ambiente)\n");
  } else if (process.env[cookieEnvName]) {
    process.stdout.write("Origem efetiva: OPENMONETIS_COOKIE (ambiente)\n");
  } else if (stored) {
    process.stdout.write("Origem efetiva: cofre local\n");
  } else {
    process.stdout.write("Origem efetiva: nenhuma — o servidor não conseguirá autenticar\n");
  }

  if (stored) {
    process.stdout.write(`URL: ${stored.baseUrl}\n`);
    process.stdout.write(`Conta: ${stored.email}\n`);
    process.stdout.write("Credencial: guardada no cofre, não exibida\n");
  }

  return 0;
}

function clear(): number {
  const removed = clearStoredCredentials();
  process.stdout.write(removed ? "Credenciais removidas.\n" : "Nada para remover.\n");
  return 0;
}

function flagValue(argv: string[], name: string): string | null {
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === name) return argv[index + 1]?.trim() || null;
    if (argument?.startsWith(`${name}=`)) return argument.slice(name.length + 1).trim() || null;
  }
  return null;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function describeStore(kind: ReturnType<typeof storeKind>): string {
  switch (kind) {
    case "keychain":
      return "Keychain do macOS";
    case "secret-tool":
      return "secret-tool (Linux)";
    case "file":
      return "arquivo local com permissão 0600";
    default:
      return "desabilitado";
  }
}

function validationConfig(baseUrl: string, email: string, secret: string): Config {
  return {
    baseUrl,
    exportDir: "/tmp",
    origin: new URL(baseUrl).origin,
    auth: { email, secret },
    writes: "read-only",
    timeoutMs: 20_000,
    maxResponseBytes: 65_536,
    cacheTtlMs: 30_000,
    retryAttempts: 2,
    tools: "full",
    debug: false,
    http: { host: "127.0.0.1", port: 7317 },
  };
}

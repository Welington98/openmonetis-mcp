import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type StoredCredentials = {
  baseUrl: string;
  email: string;
  secret: string;
};

export type StoreKind = "keychain" | "secret-tool" | "file" | "none";

const serviceName = "openmonetis-mcp";
const accountName = "credentials";
const fileMode = 0o600;
const directoryMode = 0o700;

export function configDirectory(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.OPENMONETIS_CONFIG_DIR?.trim();
  if (configured) return configured;

  const xdg = env.XDG_CONFIG_HOME?.trim();
  return join(xdg || join(homedir(), ".config"), "openmonetis-mcp");
}

export function credentialsFilePath(env: NodeJS.ProcessEnv = process.env): string {
  return join(configDirectory(env), "credentials.json");
}

export function storeKind(env: NodeJS.ProcessEnv = process.env): StoreKind {
  const forced = env.OPENMONETIS_CREDENTIAL_STORE?.trim().toLowerCase();

  if (forced === "none") return "none";
  if (forced === "file") return "file";
  if (forced === "keychain") return "keychain";
  if (forced === "secret-tool") return "secret-tool";

  if (process.platform === "darwin" && hasBinary("security")) return "keychain";
  if (process.platform === "linux" && hasBinary("secret-tool")) return "secret-tool";

  return "file";
}

export function readStoredCredentials(
  env: NodeJS.ProcessEnv = process.env,
): StoredCredentials | null {
  const kind = storeKind(env);
  if (kind === "none") return null;

  if (kind === "keychain") return readKeychain(env);
  if (kind === "secret-tool") return readSecretTool(env);

  return readFileStore(env);
}

export function writeStoredCredentials(
  credentials: StoredCredentials,
  env: NodeJS.ProcessEnv = process.env,
): StoreKind {
  const kind = storeKind(env);
  if (kind === "none") {
    throw new Error("OPENMONETIS_CREDENTIAL_STORE=none: armazenamento desabilitado.");
  }

  if (kind === "keychain") writeKeychain(credentials);
  else if (kind === "secret-tool") writeSecretTool(credentials);
  else writeFileStore(credentials, env);

  return kind;
}

export function clearStoredCredentials(env: NodeJS.ProcessEnv = process.env): boolean {
  const kind = storeKind(env);
  if (kind === "none") return false;

  if (kind === "keychain") {
    try {
      execFileSync("security", ["delete-generic-password", "-s", serviceName, "-a", accountName], {
        stdio: "ignore",
      });
      return true;
    } catch {
      return false;
    }
  }

  if (kind === "secret-tool") {
    try {
      execFileSync("secret-tool", ["clear", "service", serviceName, "account", accountName], {
        stdio: "ignore",
      });
      return true;
    } catch {
      return false;
    }
  }

  const path = credentialsFilePath(env);
  if (!existsSync(path)) return false;

  rmSync(path, { force: true });
  return true;
}

function readKeychain(env: NodeJS.ProcessEnv): StoredCredentials | null {
  try {
    const value = execFileSync(
      "security",
      ["find-generic-password", "-s", serviceName, "-a", accountName, "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    return parseStored(value, env);
  } catch {
    return null;
  }
}

function writeKeychain(credentials: StoredCredentials): void {
  // O `security` exige o valor em argv; o processo roda como o próprio usuário.
  execFileSync(
    "security",
    [
      "add-generic-password",
      "-U",
      "-s",
      serviceName,
      "-a",
      accountName,
      "-w",
      serialize(credentials),
    ],
    { stdio: "ignore" },
  );
}

function readSecretTool(env: NodeJS.ProcessEnv): StoredCredentials | null {
  try {
    const value = execFileSync(
      "secret-tool",
      ["lookup", "service", serviceName, "account", accountName],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    return parseStored(value, env);
  } catch {
    return null;
  }
}

function writeSecretTool(credentials: StoredCredentials): void {
  const child = execFileSync(
    "secret-tool",
    ["store", "--label", "OpenMonetis MCP", "service", serviceName, "account", accountName],
    { input: serialize(credentials), stdio: ["pipe", "ignore", "ignore"] },
  );
  void child;
}

function readFileStore(env: NodeJS.ProcessEnv): StoredCredentials | null {
  const path = credentialsFilePath(env);
  if (!existsSync(path)) return null;

  try {
    return parseStored(readFileSync(path, "utf8"), env);
  } catch {
    return null;
  }
}

function writeFileStore(credentials: StoredCredentials, env: NodeJS.ProcessEnv): void {
  const directory = configDirectory(env);
  mkdirSync(directory, { recursive: true, mode: directoryMode });

  const path = credentialsFilePath(env);
  writeFileSync(path, `${serialize(credentials)}\n`, { mode: fileMode });
  chmodSync(path, fileMode);
}

function serialize(credentials: StoredCredentials): string {
  return JSON.stringify({
    baseUrl: credentials.baseUrl,
    email: credentials.email,
    secret: credentials.secret,
  });
}

function parseStored(value: string, env: NodeJS.ProcessEnv): StoredCredentials | null {
  void env;

  try {
    const parsed = JSON.parse(value) as Partial<StoredCredentials>;

    if (
      typeof parsed.baseUrl === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.secret === "string" &&
      parsed.baseUrl &&
      parsed.email &&
      parsed.secret
    ) {
      return { baseUrl: parsed.baseUrl, email: parsed.email, secret: parsed.secret };
    }
  } catch {
    return null;
  }

  return null;
}

function hasBinary(name: string): boolean {
  try {
    execFileSync("which", [name], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

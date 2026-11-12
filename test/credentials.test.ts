import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import { loadConfig } from "../src/config.js";
import {
  clearStoredCredentials,
  credentialsFilePath,
  readStoredCredentials,
  storeKind,
  writeStoredCredentials,
} from "../src/credentials/store.js";

const directories: string[] = [];

function sandboxEnv(): NodeJS.ProcessEnv {
  const directory = mkdtempSync(join(tmpdir(), "openmonetis-credentials-"));
  directories.push(directory);

  return {
    OPENMONETIS_CREDENTIAL_STORE: "file",
    OPENMONETIS_CONFIG_DIR: directory,
  };
}

const credentials = {
  baseUrl: "http://localhost:7002/api-proxy",
  email: "demo@openmonetis.local",
  secret: "demo2026",
};

describe("cofre de credenciais", () => {
  after(() => {
    for (const directory of directories) rmSync(directory, { recursive: true, force: true });
  });

  it("grava, lê e remove credenciais no backend de arquivo", () => {
    const env = sandboxEnv();

    assert.equal(readStoredCredentials(env), null);

    const kind = writeStoredCredentials(credentials, env);
    assert.equal(kind, "file");
    assert.deepEqual(readStoredCredentials(env), credentials);
    assert.equal(clearStoredCredentials(env), true);
    assert.equal(readStoredCredentials(env), null);
  });

  it("grava o arquivo com permissão 0600", () => {
    const env = sandboxEnv();
    writeStoredCredentials(credentials, env);

    const path = credentialsFilePath(env);
    const mode = statSync(path).mode & 0o777;

    assert.equal(mode, 0o600);
    assert.deepEqual(JSON.parse(readFileSync(path, "utf8")), credentials);
  });

  it("respeita OPENMONETIS_CREDENTIAL_STORE=none", () => {
    const env = { OPENMONETIS_CREDENTIAL_STORE: "none" };
    assert.equal(storeKind(env), "none");
    assert.equal(readStoredCredentials(env), null);
    assert.throws(() => writeStoredCredentials(credentials, env), /desabilitado/);
  });

  it("ignora conteúdo inválido em vez de falhar", () => {
    const env = sandboxEnv();
    writeStoredCredentials(credentials, env);

    const path = credentialsFilePath(env);
    writeFileSync(path, "{ nao é json");

    assert.equal(readStoredCredentials(env), null);
  });
});

describe("loadConfig com cofre", () => {
  it("usa as credenciais do cofre quando o ambiente não define nenhuma", () => {
    const env = sandboxEnv();
    writeStoredCredentials(credentials, env);

    const config = loadConfig(env);

    assert.equal(config.baseUrl, credentials.baseUrl);
    assert.deepEqual(config.auth, { email: credentials.email, secret: credentials.secret });
  });

  it("dá precedência às variáveis de ambiente", () => {
    const env = sandboxEnv();
    writeStoredCredentials(credentials, env);

    const config = loadConfig({
      ...env,
      OPENMONETIS_URL: "https://financas.exemplo.com/api-proxy",
      OPENMONETIS_EMAIL: "titular@exemplo.com",
      OPENMONETIS_PASSWORD: "outra-senha",
    });

    assert.equal(config.baseUrl, "https://financas.exemplo.com/api-proxy");
    assert.deepEqual(config.auth, { email: "titular@exemplo.com", secret: "outra-senha" });
  });

  it("funciona sem cofre nenhum", () => {
    const env = sandboxEnv();
    const config = loadConfig(env);

    assert.equal(config.auth, undefined);
    assert.equal(config.baseUrl, "http://localhost:7001");
  });
});

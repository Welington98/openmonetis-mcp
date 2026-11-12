import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { ApiClient, buildQueryString } from "../src/client/api-client.js";
import { ApiError, AuthError } from "../src/client/errors.js";
import { parseCookieHeader, SessionManager, serializeCookies } from "../src/client/session.js";
import { type Config, loadConfig } from "../src/config.js";
import { FakeApi } from "./helpers/fake-api.js";

function makeConfig(baseUrl: string, overrides: Partial<Config> = {}): Config {
  return {
    baseUrl,
    exportDir: "/tmp/openmonetis-mcp-test",
    origin: new URL(baseUrl).origin,
    auth: { email: "user@example.com", secret: "super-secret" },
    writes: "confirm",
    timeoutMs: 5_000,
    maxResponseBytes: 65_536,
    cacheTtlMs: 30_000,
    retryAttempts: 2,
    tools: "full",
    debug: false,
    http: { host: "127.0.0.1", port: 7317 },
    ...overrides,
  };
}

describe("buildQueryString", () => {
  it("serializa arrays como CSV e ignora valores vazios", () => {
    const query = buildQueryString({
      period: "2026-07",
      personIds: ["a", "b"],
      payables: true,
      q: "",
      categoryIds: [],
      sort: undefined,
    });

    assert.equal(query, "?period=2026-07&personIds=a%2Cb&payables=true");
  });

  it("retorna string vazia quando não há parâmetros", () => {
    assert.equal(buildQueryString({}), "");
  });
});

describe("cookies", () => {
  it("faz round-trip do header de cookies", () => {
    const parsed = parseCookieHeader("a=1; better-auth.session_token=abc; b=2");
    assert.deepEqual(parsed, [
      ["a", "1"],
      ["better-auth.session_token", "abc"],
      ["b", "2"],
    ]);
    assert.equal(serializeCookies(new Map(parsed)), "a=1; better-auth.session_token=abc; b=2");
  });
});

describe("SessionManager", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
  });

  after(async () => {
    await api.close();
  });

  it("autentica e reutiliza o cookie de sessão", async () => {
    const session = new SessionManager(makeConfig(api.url));
    const header = await session.ensure();

    assert.match(header, /better-auth\.session_token=/);
    assert.equal(session.hasSession, true);

    const before = api.signIns;
    await session.ensure();
    assert.equal(api.signIns, before, "não deve autenticar de novo com sessão válida");

    const signIn = api.received("POST", "/api/auth/sign-in/email").at(-1);
    assert.equal(signIn?.headers.origin, new URL(api.url).origin);
    assert.deepEqual(signIn?.body, {
      email: "user@example.com",
      password: "super-secret",
    });
  });

  it("reaproveita OPENMONETIS_COOKIE sem autenticar", async () => {
    const session = new SessionManager(
      makeConfig(api.url, { auth: undefined, sessionCookie: "better-auth.session_token=pasted" }),
    );

    assert.equal(await session.ensure(), "better-auth.session_token=pasted");
    assert.equal(session.canSignIn, false);
  });

  it("falha com mensagem clara quando não há credenciais", async () => {
    const session = new SessionManager(makeConfig(api.url, { auth: undefined }));

    await assert.rejects(
      () => session.ensure(),
      (error: unknown) => {
        assert.ok(error instanceof AuthError);
        assert.match(error.message, /Nenhuma credencial configurada/);
        return true;
      },
    );
  });

  it("propaga falha de login", async () => {
    api.on("POST", "/api/auth/sign-in/email", () => ({
      status: 401,
      body: { message: "Invalid email or password" },
    }));

    const session = new SessionManager(
      makeConfig(api.url, { auth: { email: "user@example.com", secret: "wrong" } }),
    );

    await assert.rejects(
      () => session.ensure(),
      (error: unknown) => {
        assert.ok(error instanceof AuthError);
        assert.match(error.message, /Falha ao autenticar/);
        return true;
      },
    );
  });
});

describe("ApiClient", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
  });

  after(async () => {
    await api.close();
  });

  it("desembrulha o envelope { data, error }", async () => {
    const client = new ApiClient(makeConfig(api.url), new SessionManager(makeConfig(api.url)));
    const dashboard = await client.get<{ period: string }>("/dashboard", { period: "2026-07" });

    assert.equal(dashboard.period, "2026-07");
  });

  it("converte erro da API em ApiError com mensagem", async () => {
    const client = new ApiClient(makeConfig(api.url), new SessionManager(makeConfig(api.url)));

    await assert.rejects(
      () => client.get("/nao-existe"),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 404);
        assert.equal(error.code, "not_found");
        assert.match(error.message, /Not found/);
        return true;
      },
    );
  });

  it("renova a sessão e repete a requisição em 401", async () => {
    let attempts = 0;
    api.on("GET", "/accounts", () => {
      attempts += 1;
      if (attempts === 1) {
        return { status: 401, body: { error: true, message: "Unauthorized" } };
      }
      return { body: { data: [{ id: "acc-1", name: "Conta" }], error: null } };
    });

    const config = makeConfig(api.url);
    const client = new ApiClient(config, new SessionManager(config));

    await client.get("/dashboard");
    const signInsBefore = api.signIns;

    const accounts = await client.get<Array<{ id: string }>>("/accounts");

    assert.equal(accounts.length, 1);
    assert.equal(attempts, 2, "deve repetir a requisição uma única vez");
    assert.equal(api.signIns, signInsBefore + 1, "deve autenticar de novo após 401");
  });

  it("respeita o timeout configurado", async () => {
    api.on("GET", "/slow", async () => {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      return { body: { data: {}, error: null } };
    });

    const config = makeConfig(api.url, { timeoutMs: 50 });
    const client = new ApiClient(config, new SessionManager(config));

    await assert.rejects(() => client.get("/slow"), /Falha de rede/);
  });
});

describe("cache e retry", () => {
  let api: FakeApi;

  before(async () => {
    api = await FakeApi.start();
  });

  after(async () => {
    await api.close();
  });

  it("serve GET repetido do cache sem nova requisição", async () => {
    let calls = 0;
    api.on("GET", "/cache-hit", () => {
      calls += 1;
      return { body: { data: { calls }, error: null } };
    });

    const config = makeConfig(api.url);
    const client = new ApiClient(config, new SessionManager(config));

    const first = await client.get<{ calls: number }>("/cache-hit");
    const second = await client.get<{ calls: number }>("/cache-hit");

    assert.equal(first.calls, 1);
    assert.equal(second.calls, 1, "o segundo GET deve vir do cache");
    assert.equal(calls, 1);
    assert.equal(api.received("GET", "/cache-hit").length, 1);
  });

  it("expira a entrada depois do TTL", async () => {
    let calls = 0;
    api.on("GET", "/cache-ttl", () => {
      calls += 1;
      return { body: { data: { calls }, error: null } };
    });

    const config = makeConfig(api.url, { cacheTtlMs: 20 });
    const client = new ApiClient(config, new SessionManager(config));

    await client.get("/cache-ttl");
    await new Promise((resolve) => setTimeout(resolve, 40));
    await client.get("/cache-ttl");

    assert.equal(calls, 2, "após o TTL a API deve ser consultada de novo");
  });

  it("com TTL 0 desliga o cache", async () => {
    let calls = 0;
    api.on("GET", "/cache-off", () => {
      calls += 1;
      return { body: { data: { calls }, error: null } };
    });

    const config = makeConfig(api.url, { cacheTtlMs: 0 });
    const client = new ApiClient(config, new SessionManager(config));

    await client.get("/cache-off");
    await client.get("/cache-off");

    assert.equal(calls, 2);
  });

  it("compartilha a mesma Promise em GETs concorrentes (single-flight)", async () => {
    let calls = 0;
    api.on("GET", "/cache-flight", async () => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 30));
      return { body: { data: { calls }, error: null } };
    });

    const config = makeConfig(api.url);
    const client = new ApiClient(config, new SessionManager(config));

    const [first, second] = await Promise.all([
      client.get<{ calls: number }>("/cache-flight"),
      client.get<{ calls: number }>("/cache-flight"),
    ]);

    assert.equal(calls, 1, "só uma requisição deve ser disparada");
    assert.equal(first.calls, 1);
    assert.equal(second.calls, 1);
  });

  it("invalida o cache do recurso escrito e preserva os demais", async () => {
    let invoiceCalls = 0;
    let otherCalls = 0;
    api.on("GET", "/bills", () => {
      invoiceCalls += 1;
      return { body: { data: { items: [], totalOpen: 0 }, error: null } };
    });
    api.on("GET", "/budgets", () => {
      otherCalls += 1;
      return { body: { data: [], error: null } };
    });
    api.on("POST", "/bills/2026-07/payments", () => ({
      status: 201,
      body: { data: { ok: true }, error: null },
    }));

    const config = makeConfig(api.url);
    const client = new ApiClient(config, new SessionManager(config));

    await client.get("/bills", { period: "2026-07" });
    await client.get("/budgets", { period: "2026-07" });
    await client.request("POST", "/bills/2026-07/payments", { body: {} });

    await client.get("/bills", { period: "2026-07" });
    await client.get("/budgets", { period: "2026-07" });

    assert.equal(invoiceCalls, 2, "escrita em /bills deve invalidar o cache de /bills");
    assert.equal(otherCalls, 1, "escrita em /bills não deve invalidar /budgets");
  });

  it("não cacheia respostas de erro", async () => {
    let calls = 0;
    api.on("GET", "/cache-error", () => {
      calls += 1;
      return { status: 500, body: { message: "boom" } };
    });

    const config = makeConfig(api.url, { retryAttempts: 0 });
    const client = new ApiClient(config, new SessionManager(config));

    await assert.rejects(() => client.get("/cache-error"));

    api.on("GET", "/cache-error", () => {
      calls += 1;
      return { body: { data: { ok: true }, error: null } };
    });

    const data = await client.get<{ ok: boolean }>("/cache-error");

    assert.equal(data.ok, true);
    assert.equal(calls, 2);
  });

  it("repete 503 até obter sucesso", async () => {
    let calls = 0;
    api.on("GET", "/retry-503", () => {
      calls += 1;
      if (calls < 3) return { status: 503, body: { message: "indisponível" } };
      return { body: { data: { ok: true }, error: null } };
    });

    const config = makeConfig(api.url, { retryAttempts: 2 });
    const client = new ApiClient(config, new SessionManager(config));

    const data = await client.get<{ ok: boolean }>("/retry-503");

    assert.equal(data.ok, true);
    assert.equal(calls, 3, "503, 503 e 200");
  });

  it("não repete 404", async () => {
    const config = makeConfig(api.url, { retryAttempts: 2 });
    const client = new ApiClient(config, new SessionManager(config));

    await assert.rejects(() => client.get("/nao-existe-retry"));

    assert.equal(api.received("GET", "/nao-existe-retry").length, 1);
  });

  it("não repete escrita, mesmo em 503", async () => {
    let calls = 0;
    api.on("POST", "/retry-write", () => {
      calls += 1;
      return { status: 503, body: { message: "indisponível" } };
    });

    const config = makeConfig(api.url, { retryAttempts: 2 });
    const client = new ApiClient(config, new SessionManager(config));

    await assert.rejects(() => client.request("POST", "/retry-write", { body: {} }));

    assert.equal(calls, 1);
  });

  it("respeita retryAttempts 0", async () => {
    let calls = 0;
    api.on("GET", "/retry-off", () => {
      calls += 1;
      return { status: 503, body: { message: "indisponível" } };
    });

    const config = makeConfig(api.url, { retryAttempts: 0 });
    const client = new ApiClient(config, new SessionManager(config));

    await assert.rejects(() => client.get("/retry-off"));
    assert.equal(calls, 1);
  });
});

describe("loadConfig", () => {
  it("usa o modo confirm por padrão", () => {
    const config = loadConfig({
      OPENMONETIS_URL: "http://localhost:7001",
      OPENMONETIS_CREDENTIAL_STORE: "none",
    });
    assert.equal(config.writes, "confirm");
    assert.equal(config.baseUrl, "http://localhost:7001");
  });

  it("rejeita http remoto sem opt-in explícito", () => {
    assert.throws(
      () =>
        loadConfig({
          OPENMONETIS_URL: "http://example.com",
          OPENMONETIS_CREDENTIAL_STORE: "none",
        }),
      /http:\/\/ para um host remoto/,
    );
  });

  it("exige token quando o servidor HTTP não é loopback", () => {
    assert.throws(() => loadConfig({ OPENMONETIS_MCP_HTTP_HOST: "0.0.0.0" }), /MCP_HTTP_TOKEN/);
  });

  it("usa cache, retry e catálogo padrão", () => {
    const config = loadConfig({
      OPENMONETIS_URL: "http://localhost:7001",
      OPENMONETIS_CREDENTIAL_STORE: "none",
    });

    assert.equal(config.cacheTtlMs, 30_000);
    assert.equal(config.retryAttempts, 2);
    assert.equal(config.tools, "full");
  });

  it("aceita cache, retry e perfil core configurados", () => {
    const config = loadConfig({
      OPENMONETIS_URL: "http://localhost:7001",
      OPENMONETIS_CREDENTIAL_STORE: "none",
      OPENMONETIS_MCP_CACHE_TTL_MS: "0",
      OPENMONETIS_MCP_RETRY_ATTEMPTS: "5",
      OPENMONETIS_MCP_TOOLS: "core",
    });

    assert.equal(config.cacheTtlMs, 0);
    assert.equal(config.retryAttempts, 5);
    assert.equal(config.tools, "core");
  });

  it("rejeita cache, retry e perfil inválidos", () => {
    assert.throws(
      () =>
        loadConfig({
          OPENMONETIS_MCP_CACHE_TTL_MS: "-1",
          OPENMONETIS_CREDENTIAL_STORE: "none",
        }),
      /OPENMONETIS_MCP_CACHE_TTL_MS/,
    );
    assert.throws(
      () =>
        loadConfig({
          OPENMONETIS_MCP_RETRY_ATTEMPTS: "6",
          OPENMONETIS_CREDENTIAL_STORE: "none",
        }),
      /OPENMONETIS_MCP_RETRY_ATTEMPTS/,
    );
    assert.throws(
      () =>
        loadConfig({
          OPENMONETIS_MCP_TOOLS: "turbo",
          OPENMONETIS_CREDENTIAL_STORE: "none",
        }),
      /OPENMONETIS_MCP_TOOLS/,
    );
  });
});

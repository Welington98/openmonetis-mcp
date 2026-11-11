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
    origin: new URL(baseUrl).origin,
    auth: { email: "user@example.com", secret: "super-secret" },
    writes: "confirm",
    timeoutMs: 5_000,
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

describe("loadConfig", () => {
  it("usa o modo confirm por padrão", () => {
    const config = loadConfig({ OPENMONETIS_URL: "http://localhost:7001" });
    assert.equal(config.writes, "confirm");
    assert.equal(config.baseUrl, "http://localhost:7001");
  });

  it("rejeita http remoto sem opt-in explícito", () => {
    assert.throws(
      () => loadConfig({ OPENMONETIS_URL: "http://example.com" }),
      /http:\/\/ para um host remoto/,
    );
  });

  it("exige token quando o servidor HTTP não é loopback", () => {
    assert.throws(() => loadConfig({ OPENMONETIS_MCP_HTTP_HOST: "0.0.0.0" }), /MCP_HTTP_TOKEN/);
  });
});

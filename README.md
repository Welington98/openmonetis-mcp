# openmonetis-mcp

Servidor [MCP](https://modelcontextprotocol.io) para o [OpenMonetis](https://github.com/felipegcoutinho/openmonetis-v2).
Permite que agentes de IA leiam e alterem seus dados financeiros conversando com a API oficial do
OpenMonetis — sem acesso direto ao banco e sem duplicar regra de negócio.

- **Cliente HTTP puro** da API pública do OpenMonetis (`/openapi.json` é o contrato).
- **Autenticação** por sessão Better Auth (`email` + `senha`), com renovação automática em `401`.
- **36 ferramentas** de leitura e escrita, com *dry-run* obrigatório nas alterações.
- **Dois transportes**: `stdio` (local) e Streamable HTTP (remoto, protegido por bearer token).

## Como funciona

```
cliente MCP  ──stdio/HTTP──▶  openmonetis-mcp  ──HTTP + cookie──▶  API do OpenMonetis
```

1. No primeiro uso o servidor faz `POST {OPENMONETIS_URL}/api/auth/sign-in/email` com
   `OPENMONETIS_EMAIL`/`OPENMONETIS_PASSWORD` e mantém o cookie de sessão em memória.
2. Se a API responder `401`, a sessão é renovada uma única vez e a requisição é repetida.
3. Toda resposta é desembrulhada do envelope `{ "data": ..., "error": null }` da API.

O servidor nunca lê o banco, nunca importa código do OpenMonetis e nunca imprime credenciais.

## Instalação

```bash
# direto do GitHub
npx -y github:Welington98/openmonetis-mcp

# ou a partir do código
git clone git@github.com:Welington98/openmonetis-mcp.git
cd openmonetis-mcp
pnpm install
pnpm build
node dist/index.js
```

## Configuração

Copie `.env.example` para `.env` e preencha pelo menos `OPENMONETIS_URL` e as credenciais.

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `OPENMONETIS_URL` | não | `http://localhost:7001` | Raiz da instalação. Em produção use `https://seu-host/api-proxy`. |
| `OPENMONETIS_EMAIL` | sim¹ | — | E-mail da conta usada pelo agente. |
| `OPENMONETIS_PASSWORD` | sim¹ | — | Senha da conta. Prefira `op run`/Keychain em vez de arquivo. |
| `OPENMONETIS_COOKIE` | não | — | Alternativa: header `Cookie` de uma sessão já autenticada. |
| `OPENMONETIS_ORIGIN` | não | origem de `OPENMONETIS_URL` | Enviado como `Origin` no login. Precisa constar em `trustedOrigins` (`WEB_URL`/`BETTER_AUTH_TRUSTED_ORIGINS`). |
| `OPENMONETIS_MCP_WRITES` | não | `confirm` | `read-only`, `confirm` (dry-run) ou `full`. |
| `OPENMONETIS_TIMEOUT_MS` | não | `20000` | Timeout por chamada à API. |
| `OPENMONETIS_ALLOW_INSECURE` | não | — | `1` libera `http://` para host remoto. Evite. |
| `OPENMONETIS_MCP_HTTP_HOST` | não | `127.0.0.1` | Host do transporte HTTP. |
| `OPENMONETIS_MCP_HTTP_PORT` | não | `7317` | Porta do transporte HTTP. |
| `MCP_HTTP_TOKEN` | sim² | — | Bearer token exigido pelo transporte HTTP. |

¹ Ou defina `OPENMONETIS_COOKIE`.
² Obrigatório quando o host HTTP não é loopback.

### Qual URL usar

| Cenário | `OPENMONETIS_URL` |
| --- | --- |
| `pnpm dev` no OpenMonetis (API em 7001) | `http://localhost:7001` |
| Docker Compose (web em 7002, proxy em `/api-proxy`) | `http://localhost:7002/api-proxy` |
| Produção | `https://seu-dominio/api-proxy` |

## Clientes

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "openmonetis": {
      "command": "npx",
      "args": ["-y", "github:Welington98/openmonetis-mcp"],
      "env": {
        "OPENMONETIS_URL": "https://financas.exemplo.com/api-proxy",
        "OPENMONETIS_EMAIL": "voce@exemplo.com",
        "OPENMONETIS_PASSWORD": "sua-senha",
        "OPENMONETIS_MCP_WRITES": "confirm"
      }
    }
  }
}
```

```bash
claude mcp add openmonetis \
  -e OPENMONETIS_URL=https://financas.exemplo.com/api-proxy \
  -e OPENMONETIS_EMAIL=voce@exemplo.com \
  -e OPENMONETIS_PASSWORD=sua-senha \
  -- npx -y github:Welington98/openmonetis-mcp
```

### opencode

```json
{
  "mcp": {
    "openmonetis": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "github:Welington98/openmonetis-mcp"],
      "environment": {
        "OPENMONETIS_URL": "https://financas.exemplo.com/api-proxy",
        "OPENMONETIS_EMAIL": "voce@exemplo.com",
        "OPENMONETIS_PASSWORD": "sua-senha"
      }
    }
  }
}
```

### Codex CLI

```toml
[mcp_servers.openmonetis]
command = "npx"
args = ["-y", "github:Welington98/openmonetis-mcp"]
env = { OPENMONETIS_URL = "https://financas.exemplo.com/api-proxy", OPENMONETIS_EMAIL = "voce@exemplo.com", OPENMONETIS_PASSWORD = "sua-senha" }
```

### Transporte HTTP

```bash
OPENMONETIS_MCP_HTTP_HOST=0.0.0.0 \
OPENMONETIS_MCP_HTTP_PORT=7317 \
MCP_HTTP_TOKEN=um-token-longo-e-aleatorio \
OPENMONETIS_URL=https://financas.exemplo.com/api-proxy \
OPENMONETIS_EMAIL=voce@exemplo.com \
OPENMONETIS_PASSWORD=sua-senha \
node dist/http.js
```

- Endpoint MCP: `POST http://host:7317/mcp` com `Authorization: Bearer <MCP_HTTP_TOKEN>`.
- Health check: `GET http://host:7317/health`.
- Modo **stateless** e **single-user**: um processo atende uma credencial. Para várias pessoas,
  rode um processo por conta (ou aguarde suporte a token de API por usuário no backend).

### Docker

O `Dockerfile` gera uma imagem enxuta (multi-stage, `node:22-alpine`, usuário `node`) cujo entrypoint
é o transporte HTTP. Para subir como serviço, veja
[Rodando como serviço (container)](#rodando-como-serviço-container).

## Rodando como serviço (container)

O transporte `stdio` não faz sentido dentro de um container: o serviço expõe **Streamable HTTP** em
`/mcp`, com health check em `/health` e autenticação por [BEARER_REDACTED].

### docker compose (recomendado)

```bash
cp .env.example .env       # preencha OPENMONETIS_URL, credenciais e MCP_HTTP_TOKEN
docker compose up -d --build
docker compose logs -f
```

O `compose.yaml` já traz `restart: unless-stopped`, healthcheck, `read_only`, `no-new-privileges`,
rotação de logs e publicação **apenas em loopback** (`127.0.0.1:7317`).

```bash
docker compose ps          # status + healthy
docker compose pull && docker compose up -d   # atualizar a imagem
docker compose down        # parar
```

### docker run

```bash
docker build -t openmonetis-mcp .

docker run -d --name openmonetis-mcp \
  --restart unless-stopped \
  -p 127.0.0.1:7317:7317 \
  --add-host=host.docker.internal:host-gateway \
  -e MCP_HTTP_TOKEN=um-token-longo-e-aleatorio \
  -e OPENMONETIS_URL=https://financas.exemplo.com/api-proxy \
  -e OPENMONETIS_EMAIL=voce@exemplo.com \
  -e OPENMONETIS_PASSWORD=sua-senha \
  openmonetis-mcp
```

### Imagem publicada

O workflow `.github/workflows/release-image.yml` publica `ghcr.io/welington98/openmonetis-mcp` em
`linux/amd64` e `linux/arm64` quando uma tag `vX.Y.Z` é criada (ou por execução manual). Antes da
primeira publicação, use `docker compose build` / `docker build`.

### Container falando com OpenMonetis no mesmo host

Dentro do container, `localhost` é o próprio container. Aponte para o host com
`host.docker.internal` — e, como esse tráfego é `http://`, libere explicitamente:

```dotenv
OPENMONETIS_URL=http://host.docker.internal:7002/api-proxy
OPENMONETIS_ALLOW_INSECURE=1        # necessário: http:// não-loopback
OPENMONETIS_ORIGIN=http://localhost:7002   # precisa estar em trustedOrigins (WEB_URL)
MCP_HTTP_TOKEN=um-token-longo-e-aleatorio
```

`OPENMONETIS_ORIGIN` é obrigatório nesse caso porque o default é a origem de `OPENMONETIS_URL`
(`http://host.docker.internal:7002`), que não consta em `trustedOrigins` do Better Auth. Se o
OpenMonetis for público em HTTPS, nenhum desses três ajustes é necessário.

Se o OpenMonetis também roda em Docker Compose, o mais limpo é colocar os dois na mesma rede e usar
o nome do serviço:

```yaml
services:
  openmonetis-mcp:
    networks: [openmonetis]
  # ...
networks:
  openmonetis:
    external: true
```

Com `OPENMONETIS_URL=http://api:7001` (ou `http://web:7002/api-proxy`) e `OPENMONETIS_ALLOW_INSECURE=1`.

### Acesso remoto com reverse proxy

Mantenha a porta publicada em loopback e exponha via proxy com TLS:

```nginx
location /mcp {
    proxy_pass http://127.0.0.1:7317/mcp;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

O `Authorization` do cliente atravessa o proxy; o token do OpenMonetis nunca é exposto, porque vive
apenas na memória do container.

### Iniciar com o host

`restart: unless-stopped` já cobre reboot desde que o Docker esteja habilitado no boot
(`systemctl enable docker`). Para amarrar explicitamente ao ciclo do systemd:

```ini
# /etc/systemd/system/openmonetis-mcp.service
[Unit]
Description=OpenMonetis MCP
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/openmonetis-mcp
ExecStart=/usr/bin/docker compose up -d --remove-orphans
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now openmonetis-mcp
```

## Ferramentas

### Leitura

| Ferramenta | O que faz |
| --- | --- |
| `get_dashboard_overview` | Métricas do mês: receitas, despesas, saldo, projeção e histórico de 6 meses. |
| `get_dashboard_snapshot` | Todas as seções do dashboard em uma chamada. |
| `get_dashboard_attention` | Faturas, contas, orçamentos e metas que exigem atenção. |
| `list_transactions` | Transações paginadas com filtros por período, texto, tipo, pessoa, categoria, tag, conta, cartão e valor. |
| `get_transaction` | Todos os campos de uma transação. |
| `list_accounts` / `get_account` | Contas e saldos. |
| `get_account_cash_flow` | Fluxo de caixa diário e histórico mensal de uma conta. |
| `list_cards` / `get_card` | Cartões de crédito. |
| `get_invoice_history` | Histórico de faturas de um cartão. |
| `list_invoices` | Faturas de todos os cartões no mês. |
| `list_bills` | Contas a pagar do mês, com rateio por pessoa. |
| `list_budgets` | Orçamentos por categoria. |
| `list_goals` | Metas, progresso e ritmo. |
| `list_categories` / `list_tags` | IDs e nomes para filtros e criação. |
| `list_people` / `get_person_summary` | Pessoas e resumo financeiro individual. |
| `get_person_report` | Relatório mensal completo de uma pessoa. |
| `get_financial_distribution` | Distribuição de receitas/despesas no mês. |
| `get_category_trends` | Evolução por categoria entre dois meses. |
| `list_commitments` | Compromissos futuros (parcelas, recorrências). |
| `list_recurring_expenses` | Despesas recorrentes ativas no mês. |
| `get_settings` / `list_notifications` | Preferências e notificações acionáveis. |

### Escrita

| Ferramenta | O que faz |
| --- | --- |
| `create_transaction` | Cria receita, despesa, transferência, parcelamento ou recorrência. |
| `update_transaction` | Atualiza campos de uma transação. |
| `delete_transaction` | Exclui uma transação (destrutivo). |
| `settle_transactions` | Marca/desmarca transações como pagas ou recebidas. |
| `create_account` / `update_account` | Cria e atualiza contas. |
| `add_invoice_payment` | Registra pagamento de fatura com rateio por pessoa. |
| `pay_bill` | Registra pagamento de conta a pagar. |
| `create_budget` | Define orçamento de uma categoria no mês. |
| `create_goal` | Cria meta manual ou vinculada a uma conta. |

### Modos de escrita

| `OPENMONETIS_MCP_WRITES` | Comportamento |
| --- | --- |
| `read-only` | Ferramentas de escrita retornam erro explicativo. |
| `confirm` (padrão) | Sem `confirm: true` a ferramenta devolve um **dry-run** com método, rota e payload exatos; nada é enviado. |
| `full` | Executa direto. Use apenas em ambiente controlado. |

No dry-run de uma exclusão o servidor busca a transação antes, para mostrar nome, valor e data do
alvo. Ferramentas destrutivas também enviam `destructiveHint: true` ao cliente MCP, permitindo que
ele peça aprovação ao usuário.

## Segurança

- **Credenciais**: a senha é enviada apenas ao endpoint de login da sua instalação; o cookie de
  sessão fica em memória e nunca é gravado em disco ou logado. Prefira `op run` (`1Password`),
  Keychain ou variáveis de ambiente do cliente MCP a arquivos `.env` versionados.
- **Menor privilégio**: `read-only` ou `confirm` são o padrão. `full` é opt-in.
- **Rede**: `http://` é aceito apenas para loopback; para host remoto o servidor exige `https://`
  (ou `OPENMONETIS_ALLOW_INSECURE=1`, desencorajado).
- **HTTP remoto**: sem `MCP_HTTP_TOKEN` o servidor só sobe em loopback. A comparação do token é
  feita em tempo constante.
- **Sessão**: a duração é a da instalação (`AUTH_SESSION_EXPIRES_IN_DAYS`, padrão 30 dias).
  Revogar a sessão na web (`Ajustes → Segurança`) invalida o MCP imediatamente.

## Desenvolvimento

```bash
pnpm install
pnpm dev          # stdio via tsx
pnpm dev:http     # HTTP via tsx
pnpm lint         # Biome
pnpm typecheck    # tsc --noEmit
pnpm test         # node:test com API fake local
pnpm build        # tsup → dist/
pnpm check        # lint + typecheck + test + build

# valida todos os endpoints usados contra uma instância viva
OPENMONETIS_URL=http://localhost:7002/api-proxy pnpm check:contract
```

Os testes sobem uma API fake em `127.0.0.1` (sem rede externa) e exercitam login, renovação de
sessão, envelope de erro, paginação, dry-run e o gate de escrita.

## Troubleshooting

| Sintoma | Causa provável | Correção |
| --- | --- | --- |
| `403 Missing or null Origin` | `Origin` ausente ou fora de `trustedOrigins` | Defina `OPENMONETIS_ORIGIN` com a origem pública do web (ex.: `http://localhost:7002` em dev). |
| `401 Invalid email or password` | Credenciais erradas | Revise `OPENMONETIS_EMAIL`/`OPENMONETIS_PASSWORD`. |
| `429` no login | Rate limit de 5 tentativas/minuto | Aguarde um minuto; o servidor reaproveita a sessão e só reautentica em `401`. |
| `404` no login | `OPENMONETIS_URL` sem o prefixo correto | Em produção inclua `/api-proxy`; em dev use a porta da API (`7001`). |
| Sessão expira e ferramentas falham | Uso de `OPENMONETIS_COOKIE` sem credenciais | Prefira `OPENMONETIS_EMAIL`/`OPENMONETIS_PASSWORD`, que renovam sozinhos. |

## Limitações

- **Single-user** por processo; não há multi-tenancy nem OAuth por usuário.
- Cobre os endpoints financeiros principais, não a totalidade das ~150 rotas da API (inbox de
  notificações, importação de extratos, anexos, IA e integrações ficam de fora da v0.1).
- `@openmonetis/*` não é importado de propósito: este repositório é independente do monorepo, e o
  contrato é a API HTTP pública.

## Contribuindo

Issues e PRs são bem-vindos. Antes de abrir PR: `pnpm check` verde e `CHANGELOG.md` atualizado.

## Licença

MIT — veja [LICENSE](./LICENSE).

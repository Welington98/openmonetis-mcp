# openmonetis-mcp

Servidor [MCP](https://modelcontextprotocol.io) para o [OpenMonetis](https://github.com/felipegcoutinho/openmonetis-v2).
Permite que agentes de IA leiam e alterem seus dados financeiros conversando com a API oficial do
OpenMonetis — sem acesso direto ao banco e sem duplicar regra de negócio.

- **Cliente HTTP puro** da API pública do OpenMonetis (`/openapi.json` é o contrato).
- **Autenticação** por sessão Better Auth (`email` + `senha`), com renovação automática em `401`.
- **75 ferramentas** de leitura e escrita, com *dry-run* obrigatório nas alterações.
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

## Cofre de credenciais (recomendado)

Em vez de espalhar e-mail e senha no JSON de cada cliente MCP, guarde-os uma vez no cofre local:

```bash
npx -y github:Welington98/openmonetis-mcp auth set
# URL do OpenMonetis: https://financas.exemplo.com/api-proxy
# E-mail: voce@exemplo.com
# Credencial de voce@exemplo.com (não será exibida): ********
# Login validado. Guardado em: Keychain do macOS.
```

O login é **validado antes de salvar** — se a credencial estiver errada, nada é gravado.

| Comando | O que faz |
| --- | --- |
| `auth set` | Valida o login e grava URL, e-mail e credencial |
| `auth set --url=... --email=... --password-stdin` | Modo não-interativo (systemd, Docker, CI): lê o segredo do stdin |
| `auth status` | Mostra o cofre em uso e a origem efetiva das credenciais, sem revelar o segredo |
| `auth clear` | Remove o que está guardado |

Onde fica:

| Plataforma | Backend |
| --- | --- |
| macOS | Keychain (`security`) |
| Linux | `secret-tool` (libsecret) |
| Fallback | `~/.config/openmonetis-mcp/credentials.json` com permissão `0600` |

Precedência: `OPENMONETIS_EMAIL`/`OPENMONETIS_PASSWORD` do ambiente **sempre ganham** do cofre. Com o
cofre preenchido, os exemplos de cliente abaixo podem omitir essas duas variáveis.

```bash
# provisionamento sem interação
printf '%s' "$SENHA" | openmonetis-mcp auth set \
  --url=https://financas.exemplo.com/api-proxy --email=voce@exemplo.com --password-stdin
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
| `OPENMONETIS_EXPORT_DIR` | não | `~/Downloads/openmonetis-mcp` | Diretório onde exportações e modelos de importação são gravados. |
| `OPENMONETIS_CREDENTIAL_STORE` | não | `keychain`/`secret-tool`/`file` | Força o backend do cofre: `keychain`, `secret-tool`, `file` ou `none`. |
| `OPENMONETIS_CONFIG_DIR` | não | `~/.config/openmonetis-mcp` | Diretório do cofre quando o backend é arquivo. |
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

### Hermes Agent (Nous Research)

O [Hermes Agent](https://hermes-agent.nousresearch.com/) tem suporte nativo a MCP e normalmente roda
em container, então o caminho recomendado é **HTTP**, não `stdio`. Coloque o MCP na mesma rede
Docker do Hermes e aponte a URL para o nome do serviço.

**1. Serviço no mesmo `docker-compose.yml` do Hermes**

```yaml
services:
  openmonetis-mcp:
    image: ghcr.io/welington98/openmonetis-mcp:0.2.0
    restart: unless-stopped
    environment:
      # OpenMonetis na mesma máquina do host Docker:
      OPENMONETIS_URL: http://host.docker.internal:7002/api-proxy
      OPENMONETIS_ALLOW_INSECURE: "1"
      OPENMONETIS_ORIGIN: http://localhost:7002
      OPENMONETIS_EMAIL: demo@openmonetis.local
      OPENMONETIS_PASSWORD: demo2026
      OPENMONETIS_MCP_HTTP_HOST: 0.0.0.0
      MCP_HTTP_TOKEN: ${OPENMONETIS_MCP_TOKEN}
      # Exportações e uploads precisam de volume próprio (ver "Arquivos locais")
      OPENMONETIS_EXPORT_DIR: /data/exports
    volumes:
      - ./openmonetis-exports:/data/exports
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Se o OpenMonetis for público em HTTPS, use `OPENMONETIS_URL: https://seu-dominio/api-proxy` e remova
`OPENMONETIS_ALLOW_INSECURE` e `OPENMONETIS_ORIGIN`.

**2. Token** no `.env` do projeto do Hermes

```bash
OPENMONETIS_MCP_TOKEN=$(openssl rand -hex 32)
```

**3. `hermes-data/config.yaml`**

```yaml
mcp_servers:
  openmonetis:
    url: "http://openmonetis-mcp:7317/mcp"
    headers:
      Authorization: "Bearer ${OPENMONETIS_MCP_TOKEN}"
    timeout: 120          # export, importação e diagnóstico podem passar dos 20s padrão
    lazy: true            # registra as ferramentas pelo cache e conecta no primeiro uso
    tools:
      include:
        - get_dashboard_overview
        - get_dashboard_attention
        - list_transactions
        - get_transaction
        - list_accounts
        - list_bills
        - list_invoices
        - list_budgets
        - list_goals
        - list_categories
        - list_people
        - get_financial_distribution
        - get_category_trends
        - list_commitments
        - create_transaction
        - settle_transactions
        - export_transactions
```

`${OPENMONETIS_MCP_TOKEN}` é resolvido por Hermes a partir de `~/.hermes/.env`; no container, esse
arquivo fica em `hermes-data/.env`.

**4. Aplicar e verificar**

```bash
hermes mcp test openmonetis     # testa conexão e lista as ferramentas
# em uma sessão aberta:
/reload-mcp
```

O Hermes registra cada ferramenta com o prefixo do servidor: `list_transactions` aparece como
`mcp_openmonetis_list_transactions`. O `hermes gateway run` também recarrega sozinho quando o
`config.yaml` muda (cerca de um minuto).

**Escolha do filtro de ferramentas**

| Estratégia | Config | Quando usar |
| --- | --- | --- |
| Whitelist (acima) | `tools.include` | Uso diário: menos schema por chamada, menos ruído |
| Tudo liberado | omita `tools` | Exploração: as 75 ferramentas disponíveis |
| Tudo menos destrutivas | `tools.exclude` | Cobertura ampla sem `delete_*`/`revoke_*` |

```yaml
    tools:
      exclude:
        - delete_transaction
        - delete_attachment
        - delete_inbox_rule
        - delete_import_batch
        - revoke_person_connection
        - delete_person_settlement
        - delete_ai_chat
        - undo_installment_anticipation
```

Mantenha `OPENMONETIS_MCP_WRITES=confirm` (padrão): o agente recebe dry-run e só aplica com
`confirm: true`, o que combina com a aprovação de comandos do Hermes.

**Se o Hermes estiver fora do Docker** (CLI/desktop nativo), use `stdio` como em qualquer cliente:

```yaml
mcp_servers:
  openmonetis:
    command: "npx"
    args: ["-y", "github:Welington98/openmonetis-mcp"]
    env:
      OPENMONETIS_URL: "http://localhost:7002/api-proxy"
      OPENMONETIS_EMAIL: "demo@openmonetis.local"
      OPENMONETIS_PASSWORD: "demo2026"
      OPENMONETIS_ORIGIN: "http://localhost:7002"
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
cp .env.example .env              # preencha OPENMONETIS_URL, credenciais e MCP_HTTP_TOKEN
docker compose pull && docker compose up -d   # usa a imagem publicada
# ou, para construir localmente:
# docker compose up -d --build
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

```bash
docker pull ghcr.io/welington98/openmonetis-mcp:latest
```

| Imagem | Arquiteturas | Tags |
| --- | --- | --- |
| `ghcr.io/welington98/openmonetis-mcp` | `linux/amd64`, `linux/arm64` | `latest`; `X.Y.Z` e `X.Y` a partir de tags `vX.Y.Z` |

O pacote é público (pull anônimo funciona). A publicação é feita pelo workflow
`.github/workflows/release-image.yml`, disparado por tag `vX.Y.Z` ou execução manual. Tags SemVer só
aparecem quando a tag Git é criada; execuções manuais publicam apenas `latest`.

Para fixar uma versão em produção, use um digest ou a tag exata:

```yaml
services:
  openmonetis-mcp:
    image: ghcr.io/welington98/openmonetis-mcp:0.1.0
```

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

## Releases

O versionamento é automático, dirigido por [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
via [semantic-release](https://semantic-release.gitbook.io). Cada push na `main` executa o workflow
`release`, que calcula a próxima versão, atualiza `package.json` e `CHANGELOG.md`, cria a tag
`vX.Y.Z`, publica o GitHub Release e então gera a imagem com as tags SemVer.

| Commit | Efeito |
| --- | --- |
| `feat:` | **minor** (`0.1.0` → `0.2.0`) |
| `fix:`, `perf:`, `refactor:`, `build:` | **patch** (`0.2.0` → `0.2.1`) |
| `feat!:` ou `BREAKING CHANGE:` | **major** (`0.2.1` → `1.0.0`) |
| `docs:`, `ci:`, `test:`, `style:`, `chore:` | nenhuma release |

Regras do fluxo:

- Nunca edite a versão em `package.json` nem crie tags à mão: ambas são derivadas dos commits.
- `src/version.ts` lê a versão do `package.json` em tempo de build (`define` do tsup), então
  `/health` e o handshake MCP sempre reportam a versão publicada.
- O commit de release (`chore(release): x.y.z [skip ci]`) não dispara a própria pipeline.
- A imagem recebe `<versão>`, `<major>.<minor>` e `latest` na mesma execução.
- Para republicar a imagem sem novo release: `Actions → release image → Run workflow`
  (opcionalmente informando a versão, ex.: `0.1.0`).

Repositório ainda sem tag? O semantic-release parte de `1.0.0` quando não existe tag anterior, por
isso a primeira tag (`v0.1.0`) precisa existir antes de automatizar.

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

| `list_inbox_items` | Notificações capturadas, por status e app de origem. |
| `get_inbox_snapshot` | Contagens e últimos itens pendentes da caixa de entrada. |
| `list_inbox_rules` | Regras que categorizam capturas automaticamente. |
| `suggest_inbox_item` | Categoria/pessoa que as regras aplicariam a um item. |
| `preview_transaction_import` | Lê OFX/CSV/XLSX por caminho local e mostra o que seria importado. |
| `export_transactions` | Exporta CSV/XLSX para arquivo no host e devolve o caminho. |
| `get_import_template` | Baixa a planilha modelo de importação. |
| `list_transaction_attachments` / `list_attachments` | Anexos de uma transação ou do mês. |
| `get_attachment_download_url` | URL assinada e temporária de um anexo. |
| `list_installments` | Séries parceladas do mês com progresso e parcelas pendentes. |
| `quote_installments` | Cotação da antecipação de parcelas para uma fatura. |
| `list_person_connections` / `list_person_invitations` | Conexões e convites entre pessoas. |
| `list_person_settlements` / `get_person_balance` | Acertos e saldo com cada pessoa. |
| `get_ai_status` | Provedores de IA, ferramentas e escopos de dados compartilhados. |
| `list_ai_diagnoses` / `get_ai_diagnosis` | Diagnósticos financeiros gerados por IA. |
| `list_ai_chats` / `get_ai_chat` | Conversas com o assistente financeiro. |

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
| `confirm_inbox_item` | Converte um item da caixa de entrada em lançamento. |
| `discard_inbox_items` | Descarta itens da caixa de entrada. |
| `create_inbox_rule` / `delete_inbox_rule` | Cria e exclui regras de categorização automática. |
| `import_transactions` / `delete_import_batch` | Importa o extrato revisado e desfaz um lote. |
| `upload_attachment` / `delete_attachment` | Envia arquivo do host (prepare → upload → confirm) e exclui anexos. |
| `anticipate_installments` / `undo_installment_anticipation` | Antecipa parcelas para uma fatura e desfaz. |
| `create_person_invitation` / `cancel_person_invitation` | Convida uma pessoa e cancela o convite. |
| `revoke_person_connection` | Revoga o acesso de uma pessoa conectada. |
| `create_person_settlement` / `delete_person_settlement` | Registra e exclui acertos entre pessoas. |
| `create_ai_diagnosis` / `cancel_ai_diagnosis` | Solicita e cancela um diagnóstico de IA. |
| `delete_ai_chat` | Exclui uma conversa com a IA. |

### Arquivos locais

`export_transactions`, `get_import_template` e `upload_attachment` leem/gravam **no host onde o MCP
roda** — no transporte `stdio` é a sua máquina; no modo HTTP é o container (por isso o volume em
`compose.yaml` e no exemplo do Hermes). Nesse caso, monte um
volume para o diretório de exportação:

```yaml
    volumes:
      - ./exports:/home/node/Downloads/openmonetis-mcp
```

e defina `OPENMONETIS_EXPORT_DIR=/home/node/Downloads/openmonetis-mcp`.

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

# contrato: gera tipos + snapshot a partir da instância e valida as rotas usadas
OPENMONETIS_URL=http://localhost:7002/api-proxy pnpm gen:contract
pnpm check:contract                                  # offline, contra contract/
OPENMONETIS_URL=http://localhost:7002/api-proxy pnpm check:contract   # + instância viva
```

Os testes unitários sobem uma API fake em `127.0.0.1` (sem rede externa) e exercitam login,
renovação de sessão, envelope de erro, paginação, dry-run, gate de escrita e o cofre de credenciais.

O workflow **`e2e`** vai além: em cada push/PR ele sobe Postgres + migrações + a imagem oficial da API,
cria uma conta, popula 6 meses de dados e roda as 75 ferramentas de verdade (`SMOKE_WRITES=1`), além
de falhar se `contract/` divergir do `/openapi.json` da versão usada. É o que pega mudanças de
contrato antes de chegarem ao usuário.

### Contrato

`contract/openapi.snapshot.json` (especificação) e `contract/openapi.d.ts` (tipos) são gerados por
`pnpm gen:contract` e versionados. A lista de rotas em `scripts/check-contract.ts` é tipada por eles:
um path ou método que deixe de existir **quebra o `tsc`**. Quando a API mudar, rode `pnpm gen:contract`
e commite o diff.

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
- Cobre **79 dos ~170 endpoints** da API. Fora do escopo: configuração de provedores de IA
  (login OAuth), regras de vencimento, importação de despesas externas, antecipação de faturas,
  device tokens, releases, notificações individuais e o CRUD completo de preferências.
- **Chat com IA não é exposto**: `/ai-chats/{id}/messages` responde em SSE e o streaming não cabe
  bem no protocolo de ferramentas. Diagnósticos (`create_ai_diagnosis`) funcionam normalmente.
- **Anexos** exigem storage S3 configurado na instância; sem isso o upload retorna 503.
- `@openmonetis/*` não é importado de propósito: este repositório é independente do monorepo, e o
  contrato é a API HTTP pública.

## Contribuindo

A `main` tem histórico protegido por ruleset: **force-push, deleção e recriação do branch são
bloqueados**. Mudanças entram por pull request com os checks `check` (CI) e `e2e` verdes — o
semantic-release continua commitando direto na `main` porque o repositório é de usuário, onde o
GitHub não permite dar bypass ao Actions.

> Para exigir PR de forma *impositiva* (e não por convenção), é preciso um token de release
> (PAT ou GitHub App) com bypass de administrador — o semantic-release passaria a usar esse token.

```bash
git switch -c feat/minha-mudanca
# ... commits em Conventional Commits ...
pnpm check            # lint + typecheck + test + build
git push -u origin feat/minha-mudanca
gh pr create --fill
```

Regras do fluxo:

- Um PR = um assunto. Título em Conventional Commits, porque é ele que define a versão no squash.
- Mudou endpoint ou schema? Rode `pnpm gen:contract` e commite `contract/` no mesmo PR — o job
  `e2e` falha se o contrato divergir da API.
- Nova ferramenta de escrita precisa de `plan()` com dry-run legível; sem isso o revisor humano não
  consegue avaliar o que o agente faria.
- Nunca inclua credenciais. Use `openmonetis-mcp auth set` localmente, nunca no repositório.

## Licença

MIT — veja [LICENSE](./LICENSE).

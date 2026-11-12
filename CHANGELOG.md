# Changelog

Todas as mudanças notáveis deste projeto são registradas aqui, seguindo
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
[SemVer](https://semver.org/lang/pt-BR/). O conteúdo de cada versão é gerado a partir dos commits
[Conventional Commits](https://www.conventionalcommits.org/pt-br/).

## [0.3.0](https://github.com/Welington98/openmonetis-mcp/compare/v0.2.0...v0.3.0) (2026-11-12)

### Features

* cofre de credenciais, contrato gerado e E2E no CI ([d3a1cca](https://github.com/Welington98/openmonetis-mcp/commit/d3a1cca49a56742918f463d7e2558f9767b2d2fc))

## [0.2.0](https://github.com/Welington98/openmonetis-mcp/compare/v0.1.1...v0.2.0) (2026-11-12)

### Features

* cobrir inbox, importação, anexos, parcelamentos, pessoas e IA ([5e87847](https://github.com/Welington98/openmonetis-mcp/commit/5e878476de98639baea01e7a17fe7f7bcb0aca4c))

## [0.1.1](https://github.com/Welington98/openmonetis-mcp/compare/v0.1.0...v0.1.1) (2026-11-11)

### Bug Fixes

* **mcp:** não enviar campos omitidos em update_transaction ([948223c](https://github.com/Welington98/openmonetis-mcp/commit/948223c79f61bc00de60a164ee42701ab7729029))

## 0.1.0 - 2026-11-11

### Adicionado

- Servidor MCP para a API do OpenMonetis com transporte `stdio` e Streamable HTTP.
- Autenticação por sessão Better Auth (`email` + senha) com renovação automática em `401`,
  além de suporte a cookie de sessão pré-existente.
- 26 ferramentas de leitura: dashboard, transações, contas, fluxo de caixa, cartões, faturas,
  contas a pagar, orçamentos, metas, categorias, tags, pessoas, relatórios, distribuição
  financeira, tendências, compromissos, recorrências, preferências e notificações.
- 10 ferramentas de escrita com gate `read-only | confirm | full` e dry-run obrigatório no modo
  `confirm`.
- Anotações MCP (`readOnlyHint`, `destructiveHint`) e mensagens de erro em PT-BR.
- Servidor HTTP com token Bearer, health check e modo stateless.
- Imagem Docker multi-stage (`node:22-alpine`, usuário `node`) com healthcheck, `read_only` e
  `no-new-privileges`, além de `compose.yaml` para subir como serviço (`restart: unless-stopped`,
  porta publicada apenas em loopback).
- Imagem publicada em `ghcr.io/welington98/openmonetis-mcp` (linux/amd64 e linux/arm64), via
  workflow disparado por tag `vX.Y.Z` ou execução manual.
- Script `check:contract` que valida as 37 rotas usadas pelas ferramentas contra o `/openapi.json`
  de uma instância viva.
- Script `smoke:live` que exercita as 36 ferramentas contra uma instância real, com ciclo de
  escrita opcional (`SMOKE_WRITES=1`).
- Suíte de testes com API fake local, Biome, `tsc --noEmit`, build via tsup e CI no GitHub Actions.

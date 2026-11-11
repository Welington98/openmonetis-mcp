# Changelog

Todas as mudanças notáveis deste projeto são registradas aqui, seguindo
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
[SemVer](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [0.1.0] - 2026-11-11

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
- Servidor HTTP com bearer token, health check e modo stateless.
- Suíte de testes com API fake local, Biome, `tsc --noEmit`, build via tsup e CI no GitHub Actions.

[Unreleased]: https://github.com/Welington98/openmonetis-mcp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Welington98/openmonetis-mcp/releases/tag/v0.1.0

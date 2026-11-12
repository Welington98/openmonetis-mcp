# Pull request

## O que muda

<!-- Uma ou duas frases. Se a mudança for de contrato ou de ferramenta, diga quais. -->

## Tipo

- [ ] `feat` — nova ferramenta, cofre, transporte ou integração
- [ ] `fix` — correção de comportamento existente
- [ ] `docs` — documentação apenas
- [ ] `ci` — workflow, build ou release
- [ ] `refactor` / `perf` / `test` — sem mudança de comportamento esperado

## Checklist

- [ ] `pnpm check` verde (lint + typecheck + test + build)
- [ ] Se mudou endpoints ou schemas: `pnpm gen:contract` rodado e `contract/` commitado
- [ ] Ferramentas novas ou alteradas descritas no `README.md` (tabela de ferramentas)
- [ ] Escritas novas passam pelo gate `confirm` e têm `plan()` com dry-run útil
- [ ] Nenhum segredo, token ou credencial no diff
- [ ] Se toca o transporte HTTP ou autenticação, testado contra uma instância real

## Verificação

<!-- Cole o resumo do `pnpm smoke:live` ou do workflow `e2e` quando aplicável. -->

## Notas para o revisor

<!-- Trade-offs, limitações conhecidas, follow-ups. -->

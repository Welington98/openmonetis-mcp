/**
 * `prepare` roda em `npm install` (inclusive em `npx github:...`) e também em instalações que
 * ainda não copiaram `src/` — por exemplo, o build da imagem Docker, que instala dependências
 * antes de copiar o código para preservar o cache de camadas. Sem código-fonte, não há o que
 * compilar: saímos com sucesso em vez de quebrar a instalação.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const hasSources = existsSync(new URL("../src/index.ts", import.meta.url));

if (!hasSources) {
  console.log("[prepare] src/ ausente: pulando o build (nada a compilar neste estágio).");
  process.exit(0);
}

const result = spawnSync("tsup", { stdio: "inherit", shell: process.platform === "win32" });

process.exit(result.status ?? 1);

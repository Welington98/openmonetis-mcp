import { createInterface } from "node:readline";

export function promptLine(question: string, fallback = ""): Promise<string> {
  const readline = createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      readline.close();
      const trimmed = answer.trim();
      resolve(trimmed || fallback);
    });
  });
}

/** Lê a senha sem ecoar nada no terminal (nem asteriscos). */
export function promptSecret(question: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(
        new Error(
          "Terminal interativo necessário para digitar a senha. Rode `openmonetis-mcp auth set` num terminal.",
        ),
      );
      return;
    }

    process.stdout.write(question);

    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    let value = "";

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const cleanup = () => {
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
      stdin.removeListener("data", onData);
      process.stdout.write("\n");
    };

    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          cleanup();
          if (!value) reject(new Error("Senha vazia."));
          else resolve(value);
          return;
        }

        if (char === "\u0003") {
          cleanup();
          reject(new Error("Cancelado."));
          return;
        }

        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
          continue;
        }

        if (char >= " ") value += char;
      }
    };

    stdin.on("data", onData);
  });
}

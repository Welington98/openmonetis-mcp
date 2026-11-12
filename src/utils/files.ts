import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { NetworkError } from "../client/errors.js";

const maximumImportBytes = 5_000_000;

export type SavedFile = {
  path: string;
  bytes: number;
};

export function sanitizeFileName(name: string): string {
  const base = basename(name.trim() || "arquivo").replace(/[^\w.\- ]+/g, "_");
  return base.slice(0, 120) || "arquivo";
}

export async function saveBase64File(
  directory: string,
  fileName: string,
  contentBase64: string,
): Promise<SavedFile> {
  await mkdir(directory, { recursive: true });

  const buffer = Buffer.from(contentBase64, "base64");
  const target = await availablePath(directory, sanitizeFileName(fileName));

  await writeFile(target, buffer);

  return { path: target, bytes: buffer.byteLength };
}

export async function readLocalFile(
  filePath: string,
  maxBytes = maximumImportBytes,
): Promise<{ fileName: string; contentBase64: string; bytes: number }> {
  let info: Awaited<ReturnType<typeof stat>>;

  try {
    info = await stat(filePath);
  } catch {
    throw new NetworkError(`Arquivo não encontrado: ${filePath}`);
  }

  if (!info.isFile()) {
    throw new NetworkError(`O caminho não é um arquivo: ${filePath}`);
  }

  if (info.size > maxBytes) {
    throw new NetworkError(
      `Arquivo com ${info.size} bytes excede o limite de ${maxBytes} bytes para importação.`,
    );
  }

  const buffer = await readFile(filePath);

  return {
    fileName: basename(filePath),
    contentBase64: buffer.toString("base64"),
    bytes: buffer.byteLength,
  };
}

export function guessMimeType(fileName: string): string | null {
  switch (extname(fileName).toLowerCase()) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return null;
  }
}

async function availablePath(directory: string, fileName: string): Promise<string> {
  const direct = join(directory, fileName);

  try {
    await stat(direct);
  } catch {
    return direct;
  }

  const extension = extname(fileName);
  const stem = fileName.slice(0, fileName.length - extension.length);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

  return join(directory, `${stem}-${stamp}${extension}`);
}

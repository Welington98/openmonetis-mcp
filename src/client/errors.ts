export class OpenMonetisError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class ConfigError extends OpenMonetisError {}

export class NetworkError extends OpenMonetisError {}

/** Erro de uso da ferramenta (argumento inconsistente), não de rede ou da API. */
export class InputError extends OpenMonetisError {}

export class AuthError extends OpenMonetisError {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
  }
}

export class ApiError extends OpenMonetisError {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly path?: string,
  ) {
    super(message);
  }
}

export function describeStatus(status: number): string {
  switch (status) {
    case 400:
      return "A API rejeitou os dados enviados (400). Revise os campos obrigatórios e os formatos de data/período (YYYY-MM).";
    case 401:
      return "Sessão inválida ou expirada (401). Verifique OPENMONETIS_EMAIL/OPENMONETIS_PASSWORD ou OPENMONETIS_COOKIE.";
    case 403:
      return "Acesso negado (403). O usuário não tem permissão para este recurso nesta instalação.";
    case 404:
      return "Recurso não encontrado (404). Confirme o identificador informado.";
    case 409:
      return "Conflito de estado (409). Recarregue o recurso antes de tentar novamente.";
    case 413:
      return "Payload muito grande (413).";
    case 422:
      return "Dados inválidos (422). Revise os campos informados.";
    case 429:
      return "Limite de requisições atingido (429). Aguarde alguns segundos antes de tentar novamente.";
    default:
      return status >= 500
        ? `A API do OpenMonetis falhou (${status}). Tente novamente em instantes.`
        : `A API respondeu com status ${status}.`;
  }
}

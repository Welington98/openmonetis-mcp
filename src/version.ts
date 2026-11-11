declare const __APP_VERSION__: string;

/**
 * A versão vem do `package.json` e é injetada pelo tsup no build (`define`), então acompanha
 * automaticamente os bumps do semantic-release. Em desenvolvimento (`tsx`) não há injeção.
 */
export const VERSION = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "0.0.0-dev";

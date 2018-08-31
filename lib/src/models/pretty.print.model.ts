/**
 * Pino PrettyPrint Options
 * @see https://github.com/pinojs/pino-pretty
 */
export interface IPrettyPrintOptions {
    colorize?: boolean;
    crlf?: boolean;
    errorLikeObjectKeys?: string[];
    errorProps?: string;
    levelFirst?: boolean;
    messageKey?: string;
    translateTime?: boolean;
    search?: string;
}

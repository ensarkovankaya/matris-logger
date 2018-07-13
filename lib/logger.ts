import * as http from 'http';
import { Logger as PinoLogger } from 'pino';
import { LogLevel } from './log.level';

export interface ILoggerOptions {
    level?: LogLevel;
}

export class Logger {
    private logger: PinoLogger;

    /**
     * Child logger object.
     * @param {string} name: Child logger name.
     * @param {string[]} labels: Aditional identifier for logger.
     * @param {PinoLogger} root: Root pino logger object.
     * @param {ILoggerOptions} overwrites: Overwrite options for child.
     */
    constructor(
        public name: string,
        public labels: string[] = [],
        root: PinoLogger,
        overwrites: ILoggerOptions = {}
    ) {
        this.logger = root.child({name, labels, nodeEnv: process.env.NODE_ENV, ...overwrites});
    }

    /**
     * Changes log level
     * @param {LogLevel} level: new Log level.
     */
    public setLevel(level: LogLevel) {
        this.logger.level = level;
    }

    /**
     * Critical Level log
     * @param {string} message Log message
     * @param {Error} error Optinal Error object
     * @param meta Optional data
     */
    public fatal(message: string, error?: Error, meta?: any) {
        this.logger.fatal({
            error: error ? {name: error.name, message: error.message, stack: error.stack} : error,
            meta
        }, message);
    }

    /**
     * Error Level log
     * @param {string} message Log message
     * @param {Error} error Error object
     * @param meta Optional data
     */
    public error(message: string, error: Error, meta?: any) {
        this.logger.error({
            error: {name: error.name, message: error.message, stack: error.stack},
            meta
        }, message);
    }

    /**
     * Warning Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public warn(message: string, meta?: any) {
        this.logger.warn({meta}, message);
    }

    /**
     * Info Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public info(message: string, meta?: any) {
        this.logger.info({meta}, message);
    }

    /**
     * Debug Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public debug(message: string, meta?: any) {
        this.logger.debug({meta}, message);
    }

    /**
     * Http Level Log
     * @param {string} message: Log message
     * @param {http.IncomingMessage} req: Request object
     * @param meta: Optional data
     */
    public http(message: string, req?: http.IncomingMessage, res?: http.OutgoingMessage, meta?: any) {
        this.logger.debug({meta, req, res, type: 'http'}, message);
    }
}

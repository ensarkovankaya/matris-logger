import * as http from 'http';
import { Logger as PinoLogger } from 'pino';

export class Logger {
    private logger: PinoLogger;

    /**
     * Child logger object.
     * @param {string} name: Child logger name.
     * @param {PinoLogger} root: Root pino logger object.
     */
    constructor(public name: string, public labels: string[] = [], root: PinoLogger) {
        this.logger = root.child({ name, labels });
    }

    /**
     * Critical level log
     * @param {string} msg Optinal log message
     * @param {Error} error Optinal Error object
     * @param meta Optional meta data
     */
    public fatal(payload: { msg?: string, error?: Error, meta?: any, method?: string }) {
        this.logger.fatal({
            error: payload.error ? {
                name: payload.error.name,
                msg: payload.error.message,
                stack: payload.error.stack
            } : payload.error,
            meta: payload.meta,
            method: payload.method
        }, payload.msg || '');
    }

    /**
     * Error level log
     * @param {string} msg Optinal log message
     * @param {Error} error Error object
     * @param meta Optional meta data
     */
    public error(payload: { msg?: string, error: Error, meta?: any, method?: string }) {
        this.logger.error({
            error: payload.error ? {
                name: payload.error.name,
                msg: payload.error.message,
                stack: payload.error.stack
            } : payload.error,
            meta: payload.meta,
            method: payload.method
        }, payload.msg || '');
    }

    /**
     * Warning level log
     * @param {string} msg Optinal log message
     * @param meta Optional meta data
     */
    public warn(payload: { msg?: string, meta?: any, method?: string }) {
        this.logger.warn({ meta: payload.meta, method: payload.method }, payload.msg || '');
    }

    /**
     * Info level log
     * @param {string} msg Optinal log message
     * @param meta Optional meta data
     */
    public info(payload: { msg?: string, meta?: any, method?: string }) {
        this.logger.info({ meta: payload.meta, method: payload.method }, payload.msg || '');
    }

    /**
     * Debug level log
     * @param {string} msg Optinal log message
     * @param meta Optional meta data
     */
    public debug(payload: { msg?: string, meta?: any, method?: string }) {
        this.logger.debug({ meta: payload.meta, method: payload.method }, payload.msg || '');
    }

    /**
     * Http level Log
     * @param {string} msg: Optinal log message
     * @param {http.IncomingMessage} req: Request object
     * @param {http.OutgoingMessage} res: Response object
     * @param meta: Optional meta data
     */
    public http(payload: {
        msg?: string,
        req?: http.IncomingMessage,
        res?: http.OutgoingMessage,
        meta?: any,
        method?: string
    }) {
        this.logger.debug({
            meta: payload.meta,
            req: payload.req,
            res: payload.res,
            method: payload.method
        }, payload.msg || '');
    }
}

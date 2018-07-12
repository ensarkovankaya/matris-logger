import { createLogger as wCreateLogger, Logger as wLogger, LoggerOptions } from 'winston';
import { IRequest } from './models/request.model';

export class Logger {
    private logger: wLogger;

    constructor(private name: string, private labels: string[] = [], private options: LoggerOptions = {}) {
        this.logger = wCreateLogger(options);
    }

    /**
     * Critical Level log
     * @param {string} message Log message
     * @param {Error} error Optinal Error object
     * @param meta Optional data
     */
    public critical(message: string, error?: Error, meta?: any) {
        this.log('critical', message, {
            error: error ? {name: error.name, message: error.message, stack: error.stack} : error,
            meta
        });
    }

    /**
     * Error Level log
     * @param {string} message Log message
     * @param {Error} error Error object
     * @param meta Optional data
     */
    public error(message: string, error: Error, meta?: any) {
        this.log('error', message, {
            error: {name: error.name, message: error.message, stack: error.stack},
            meta
        });
    }

    /**
     * Warning Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public warn(message: string, meta?: any) {
        this.log('warning', message, {meta});
    }

    /**
     * Info Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public info(message: string, meta?: any) {
        this.log('info', message, {meta});
    }

    /**
     * Debug Level log
     * @param {string} message Log message
     * @param meta Optional data
     */
    public debug(message: string, meta?: any) {
        this.log('debug', message, {meta});
    }

    /**
     * Http Level Log
     * @param {string} message: Log message
     * @param {IRequest} req: Request object
     * @param meta: Optional data
     */
    public http(message: string, req: IRequest, meta?: any) {
        this.log('http', message, {
            meta,
            request: {
                params: req.params,
                query: req.query,
                headers: req.headers,
                body: req.body,
                baseUrl: req.baseUrl,
                originalUrl: req.originalUrl,
                httpVersion: req.httpVersion,
                url: req.url,
                method: req.method
            }
        });
    }

    /**
     * Log
     * @param {string} level: Log level
     * @param {string} message: Log message
     * @param {object} fields: Other fields
     */
    private log(level: string, message: string, fields: object = {}) {
        this.logger.log(level, message, {name: this.name, labels: this.labels, ...fields});
    }
}

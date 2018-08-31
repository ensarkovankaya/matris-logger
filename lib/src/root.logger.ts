import * as pino from 'pino';
import * as pinoStdSerializers from 'pino-std-serializers';
import { InvalidLogLevel, LoggerNotInitialized } from './errors';
import { Logger } from './logger';
import { LogLevel } from './models/log.level';
import { ILoggerOptions } from './models/logger.options';
import { IPrettyPrintOptions } from './models/pretty.print.model';
import { userSerializer } from './serializers/user.serializer';

const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

export class RootLogger {

    public level: string;
    public serializers: {[key: string]: pino.SerializerFn};
    public prettyPrint: boolean | IPrettyPrintOptions;
    public labels: string[];
    public root: pino.Logger;

    /**
     *
     * @param {string} name
     * @param {string} level Log Level. Must be one of fatal, error, warn, info, debug, trace or silent.
     * @param serializers
     */
    constructor(options: ILoggerOptions = {}) {
        this.level = options.level || 'info';
        this.prettyPrint = options.prettyPrint || false;
        this.labels = options.labels || [];

        const serializers = options.serializers || {};
        this.serializers =  {
            user: userSerializer,
            req: pinoStdSerializers.req,
            res: pinoStdSerializers.res,
            ...serializers
        };
        this.root = pino(this.getOptions());
    }

    /**
     * Returns new child logger.
     * @param {string} name Logger name that uses this logger
     * @param {string[]} labels Aditional identifiers for logger
     */
    public getLogger(name: string, labels: string[] = []): Logger {
        return new Logger(name, this.labels.concat(labels), this.root);
    }

    /**
     * Changes log level
     * @param {LogLevel} level Log Level. Must be one of fatal, error, warn, info, debug, trace or silent.
     */
    public setLevel(level: LogLevel) {
        if (!this.root) {
            throw new LoggerNotInitialized();
        }
        this.checkLogLevel(level);
        this.root.level = level;
    }

    /**
     * Return options for root logger
     */
    public getOptions(): pino.LoggerOptions {
        this.checkLogLevel(this.level);
        return {
            level: this.level,
            serializers: this.serializers,
            prettyPrint: this.prettyPrint
        };
    }

    public checkLogLevel(level: string): void {
        if (typeof level !== 'string') {
            throw new InvalidLogLevel('Log level must be a string');
        }

        // Check log level valid
        if (!logLevels.find(l => level === l)) {
            throw new InvalidLogLevel('Log level must be one of fatal, error, warn, info, debug, trace or silent.');
        }
    }
}

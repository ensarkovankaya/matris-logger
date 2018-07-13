import * as pino from 'pino';
import { IChildLoggerOptions, Logger } from './logger';
import { LogLevel } from './models/loglevel.model';
import { userSerializer } from './serializers/user.serializer';
import { isDevelopment, isTest } from './utils';

export interface ILoggerOptions {
    name: string;
    level: LogLevel;
    serializers?: { [key: string]: pino.SerializerFn };
}

interface IRootLoggerOptions extends ILoggerOptions {
    nodeEnv?: string;
}

export class RootLogger {

    public options: IRootLoggerOptions;

    constructor(options: Partial<ILoggerOptions> = {}) {
        const nodeEnv = process ? (process.env ? process.env.NODE_ENV : undefined) : undefined;
        this.options = {
            name: '',
            level: isTest() ? 'silent' : isDevelopment() ? 'debug' : 'info',
            serializers: {
                user: userSerializer
            },
            nodeEnv,
            ...options
        };
    }

    public getLogger(name: string, labels: string[] = [], overwrites: Partial<IChildLoggerOptions> = {}): Logger {
        return new Logger(name, labels, pino(this.options), overwrites);
    }
}

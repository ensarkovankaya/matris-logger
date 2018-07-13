import * as pino from 'pino';
import * as serializers from 'pino-std-serializers';
import { LogLevel } from './log.level';
import { ILoggerOptions, Logger } from './logger';
import { userSerializer } from './serializers/user.serializer';
import { isDevelopment, isTest } from './utils';

export interface IRootConfig {
    level: LogLevel;
    serializers?: { [key: string]: pino.SerializerFn };
}

export class RootLogger {

    public options: IRootConfig;

    constructor(options: Partial<IRootConfig> = {}) {
        this.options = {
            level: isTest() ? 'silent' : isDevelopment() ? 'debug' : 'info',
            serializers: {
                user: userSerializer,
                req: serializers.req,
                res: serializers.res
            },
            ...options
        };
    }

    public getLogger(name: string, labels: string[] = [], overwrites: ILoggerOptions = {}): Logger {
        return new Logger(name, labels, pino(this.options), overwrites);
    }
}

import { SerializerFn } from 'pino';
import { LogLevel } from './log.level';
import { IPrettyPrintOptions } from './pretty.print.model';

export interface ILoggerOptions {
    level?: LogLevel;
    prettyPrint?: boolean | IPrettyPrintOptions;
    labels?: string[];
    serializers?: {[key: string]: SerializerFn};
}

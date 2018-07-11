import {
    format,
    transports as wTransports,
    LoggerOptions
} from 'winston';
import { LogFolderNotDefined, LogFolderNotFound } from './error';
import { Logger } from './logger';
import { isDevelopment, isTest } from './utils';
import { existsSync } from 'fs';

export const initLogger = (logFolder: string, overwrite: LoggerOptions = {}): (name: string, labels?: string[]) => Logger => {
    if (!logFolder) {
        throw new LogFolderNotDefined();
    }
    if (!existsSync(logFolder)) {
        throw new LogFolderNotFound(logFolder);
    }
    const transports = isDevelopment() ? [
        new wTransports.Console(),
        new wTransports.File({
            filename: 'debug.log',
            dirname: logFolder,
            level: 'debug',
            maxsize: 1024 * 50, // 50 MB
            maxFiles: 10,
            tailable: true
        }),
        new wTransports.File({
            filename: 'info.log',
            dirname: logFolder,
            level: 'info',
            maxsize: 1024 * 10, // 10 MB
            maxFiles: 10,
            tailable: true
        }),
        new wTransports.File({
            filename: 'error.log',
            dirname: logFolder,
            level: 'error',
            maxsize: 1024 * 10, // 10 MB
            maxFiles: 10,
            tailable: true
        })
    ] : [
        new wTransports.Console(),
        new wTransports.File({
            filename: 'info.log',
            dirname: logFolder,
            level: 'info',
            maxsize: 1024 * 10, // 10 MB
            maxFiles: 10,
            tailable: true
        }),
        new wTransports.File({
            filename: 'error.log',
            dirname: logFolder,
            level: 'error',
            maxsize: 1024 * 10, // 10 MB
            maxFiles: 10,
            tailable: true
        })
    ];

    const config = {
        level: isDevelopment() ? 'debug' : 'info',
        levels: {
            critical: 0,
            error: 1,
            warning: 2,
            info: 3,
            http: 4,
            debug: 5
        },
        format: format.combine(format.timestamp(), format.json()),
        silent: isTest(),
        transports,
        ...overwrite
    };
    return (name: string, labels: string[] = []) => new Logger(name, labels, config);
};

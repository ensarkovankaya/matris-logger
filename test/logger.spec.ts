import { expect } from 'chai';
import { describe, it } from 'mocha';
import { RootLogger } from '../lib';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('Logger', () => {
    it('should initialize root logger', () => {
        const rootLogger = new RootLogger();
        expect(rootLogger).to.be.an('object');
        expect(rootLogger.getLogger).to.be.a('function');
        expect(rootLogger.root).to.be.an('object');
        expect(rootLogger.level).to.be.eq('info');
        expect(rootLogger.labels).to.be.deep.eq([]);
    });
    it('should return child logger', () => {
        const rootLogger = new RootLogger();
        expect(rootLogger.getLogger).to.be.a('function');
        const logger = rootLogger.getLogger('TestService');
        expect(logger).to.be.an('object');
        expect(logger.name).to.be.eq('TestService');
        expect(logger.labels).to.be.deep.eq([]);
        expect(logger.debug).to.be.a('function');
        expect(logger.fatal).to.be.a('function');
        expect(logger.error).to.be.a('function');
        expect(logger.warn).to.be.a('function');
        expect(logger.info).to.be.a('function');
        expect(logger.http).to.be.a('function');
    });
    it('should raise InvalidLogLevel', () => {
        try {
            new RootLogger({level: 'notALogLevel' as any});
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('InvalidLogLevel');
        }
    });
    it('should except labels', () => {
        const rootLogger = new RootLogger();
        const logger = rootLogger.getLogger('TestLogger', ['service']);
        expect(logger).to.be.an('object');
        expect(logger.labels).to.be.an('array');
        expect(logger.labels).to.have.lengthOf(1);
        expect(logger.labels).to.be.deep.eq(['service']);
    });
    it('should log debug', () => {
        const rootLogger = new RootLogger({level: 'debug'});
        const logger = rootLogger.getLogger('TestLogger');
        logger.debug({msg: 'Debug Message', meta: {a: 1, b: 2}, method: 'debug'});
    });
    it('should log warning', () => {
        const rootLogger = new RootLogger({level: 'warn'});
        const logger = rootLogger.getLogger('TestLogger');
        logger.warn({msg: 'Warning Message', meta: {a: 1, b: 2}, method: 'warn'});
    });
    it('should log fatal', () => {
        const rootLogger = new RootLogger({level: 'fatal'});
        const logger = rootLogger.getLogger('TestLogger');
        
        class FatalError extends Error {
            public name = 'FatalError';
            public message = 'System Error';
        }
        
        try {
            throw new FatalError();
        } catch (e) {
            logger.fatal({msg: 'Fatal Message', meta: {a: 1, b: 2}, method: 'fatal', error: e});
        }
    });
    it('should log error', () => {
        const rootLogger = new RootLogger({level: 'error'});
        const logger = rootLogger.getLogger('TestLogger');
        
        class TestError extends Error {
            public name = 'TestError';
            public message = 'Test Error Message'
        }
        
        try {
            throw new TestError();
        } catch (e) {
            expect(e.name).to.be.eq('TestError');
            logger.error({msg: 'Error Message', meta: {a: 1, b: 2}, method: 'error', error: e});
        }
    });

    it('should log http', () => {
        const rootLogger = new RootLogger({level: 'debug'});
        const logger = rootLogger.getLogger('TestLogger');
        const req = {
            method: 'GET',
            url: '/',
            headers: {
                host: 'localhost:50201',
                connection: 'close'
            },
            remoteAddress: '::ffff:127.0.0.1',
            remotePort: 50202
        };
        const res = {
            statusCode: 200,
            header: 'HTTP/1.1 200 OK\r\nDate: Mon, 07 Mar 2016 12:23:18 GMT\r\nConnection: close\r\nContent-Length: 5\r\n\r\n'
        };
        logger.http({msg: 'Http Message', meta: {a: 1, b: 2}, method: 'http', req: req as any, res: res as any});
    });
    it('should pretty print', () => {
        const root = new RootLogger({prettyPrint: true});
        const logger = root.getLogger('TestLogger', ['test']);
        logger.info({msg: 'Test Message', meta: {a: 1, b: 2}, method: 'method'});
    });
});

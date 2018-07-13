import { expect } from 'chai';
import { describe, it, Test } from 'mocha';
import { RootLogger } from '../lib';
import * as http from 'http';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
    public message = 'This test should not suscced';
}

describe('Logger', () => {
    it('should initialize root logger', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        expect(rootLogger).to.be.an('object');
        expect(rootLogger.getLogger).to.be.a('function');
        expect(rootLogger).to.have.keys(['options']);
        expect(rootLogger.options).to.have.keys(['name', 'level', 'serializers', 'nodeEnv']);
    });
    it('should get child logger', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        expect(rootLogger.getLogger).to.be.a('function');
        const childLogger = rootLogger.getLogger('TestService');
        expect(childLogger).to.be.an('object');
        expect(childLogger.name).to.be.eq('TestService');
    });
    it('should except labels', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        expect(rootLogger.getLogger).to.be.a('function');
        const childLogger = rootLogger.getLogger('TestService', ['service']);
        expect(childLogger).to.be.an('object');
        expect(childLogger.labels).to.be.an('array');
        expect(childLogger.labels).to.have.lengthOf(1);
        expect(childLogger.labels[0]).to.be.eq('service');
    });
    it('should log info', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
        childLogger.info('Info Message', {a: 1, b: {c: 2}});
    });
    it('should log debug', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
        childLogger.debug('Debug Message', {a: 1, b: {c: 2}});
    });
    it('should log warning', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
        childLogger.warn('Warning Message', {a: 1, b: {c: 2}});
    });
    it('should log fatal', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
        
        class FatalError extends Error {
            public name = 'FatalError';
            public message = 'System Error';
        }
        
        try {
            throw new FatalError();
        } catch (e) {
            childLogger.fatal('Fatal Message', e, {a: 1, b: {c: 2}});
        }
    });
    it('should log error', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
        
        class TestError extends Error {
            public name = 'TestError';
            public message = 'Test Error Message'
        }
        
        try {
            throw new TestError();
        } catch (e) {
            expect(e.name).to.be.eq('TestError');
            childLogger.error('Error Message', e, {a: 1, b: {c: 2}});
        }
    });
    
    it('should log http', () => {
        const rootLogger = new RootLogger({name: 'libs/logger'});
        const childLogger = rootLogger.getLogger('TestService');
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
        childLogger.http('Warning Message', req as any, res as any, {a: 1, b: {c: 2}});
    });
});

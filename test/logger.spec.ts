import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as os from 'os';
import * as path from 'path';
import { initLogger } from '../lib';
import * as fs from 'fs';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

const generateTempFolder = (prefix: string = 'logs-'): string => fs.mkdtempSync(path.join(os.tmpdir(), prefix));

describe('Logger', () => {
    it('should raise LogFolderNotDefined error', () => {
        try {
            initLogger('');
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('LogFolderNotDefined')
        }
    });
    it('should raise LogFolderNotFound error', () => {
        try {
            initLogger('logs');
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('LogFolderNotFound');
        }
    });
    it('should initialize', () => {
        const tmpDir = generateTempFolder();
        const getLogger = initLogger(tmpDir);
        expect(getLogger).to.be.a('function');
        const logger = getLogger('TestLogger');
        expect(logger).to.be.an('object');
        expect(logger.debug).to.be.a('function');
        expect(logger.info).to.be.a('function');
        expect(logger.warn).to.be.a('function');
        expect(logger.error).to.be.a('function');
        expect(logger.critical).to.be.a('function');
        expect(logger.http).to.be.a('function');
        expect(logger['log']).to.be.a('function');
        expect(logger['name']).to.be.eq('TestLogger');
        expect(logger['logger']).to.be.a('object');
        expect(logger['labels']).to.be.an('array');
        expect(logger['labels']).to.be.lengthOf(0);
    });
    it('should except options', () => {
        const env = String(process.env.NODE_ENV);
        // Temporary change environment to Development so logging will not be silent default
        process.env.NODE_ENV = 'dev';

        const tmpDir = generateTempFolder();
        const getLogger = initLogger(tmpDir, {silent: true});
        const logger = getLogger('TestLogger');

        process.env.NODE_ENV = env; // Change environment before status

        expect(logger['options']).to.be.an('object');
        expect(logger['options'].silent).to.be.eq(true);
    });
    it('should create info, error and debug log files in development',(done) => {
        const env = process.env.NODE_ENV;
        // Temporary change environment to Development
        process.env.NODE_ENV = 'dev';

        const tmpDir = generateTempFolder();
        initLogger(tmpDir);
        const infoFile = `${tmpDir}/info.log`;
        const errorFile = `${tmpDir}/error.log`;
        const debugFile = `${tmpDir}/debug.log`;

        process.env.NODE_ENV = env; // Change environment before status

        // Files creating async so wait little bit before check
        setTimeout(() => {
            expect(fs.existsSync(infoFile)).to.be.eq(true);
            expect(fs.existsSync(errorFile)).to.be.eq(true);
            expect(fs.existsSync(debugFile)).to.be.eq(true);
            done();
        }, 20);
    });

    it('should create only info, error log files in production',(done) => {
        const env = process.env.NODE_ENV;
        // Temporary change environment to Development
        process.env.NODE_ENV = 'prod';

        const tmpDir = generateTempFolder();
        initLogger(tmpDir);
        const infoFile = `${tmpDir}/info.log`;
        const errorFile = `${tmpDir}/error.log`;
        const debugFile = `${tmpDir}/debug.log`;

        process.env.NODE_ENV = env; // Change environment before status

        // Files creating async so wait little bit before check
        setTimeout(() => {
            expect(fs.existsSync(infoFile)).to.be.eq(true);
            expect(fs.existsSync(errorFile)).to.be.eq(true);
            expect(fs.existsSync(debugFile)).to.be.eq(false);
            done();
        }, 20);
    });

    it('should log info',(done) => {
        const env = process.env.NODE_ENV;
        // Temporary change environment to Development
        process.env.NODE_ENV = 'prod';

        const tmpDir = generateTempFolder();
        const getLogger = initLogger(tmpDir);
        const logger = getLogger('TestLogger', ['service']);
        logger.info('Info Message', {a: 1, b: {c: 2}});

        process.env.NODE_ENV = env; // Change environment before status

        const filePath = `${tmpDir}/info.log`;

        // Files creating async so wait little bit before check
        setTimeout(() => {
            const data = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf8'}));

            expect(data).to.be.an('object');

            expect(data.name).to.be.eq('TestLogger');

            expect(data.labels).to.be.an('array');
            expect(data.labels).to.have.lengthOf(1);
            expect(data.labels[0]).to.be.eq('service');

            expect(data.level).to.be.eq('info');
            expect(data.message).to.be.eq('Info Message');
            expect(data.timestamp).to.be.a('string');
            expect(new Date(data.timestamp).toString()).to.be.not.eq('Invalid Date');
            done();
        }, 20);
    });
});

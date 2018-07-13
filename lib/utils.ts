export const isTest = (): boolean => String(process.env.NODE_ENV).toLowerCase() === 'test';

export const isDevelopment = (): boolean => {
    const env = String(process.env.NODE_ENV).toLowerCase();
    return env === 'dev' || env === 'development';
};

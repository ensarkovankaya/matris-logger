export class LogFolderNotDefined extends Error {
    public name = 'LogFolderNotDefined';

    constructor() {
        super('Log folder not defined in environment');
    }
}

export class LogFolderNotFound extends Error {
    public name = 'LogFolderNotFound';

    constructor(path: string) {
        super(`Log folder not found in path: ${path}`);
    }
}

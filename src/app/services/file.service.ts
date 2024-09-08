export class FileFeatureNotAvailableError extends Error {
};

export class FileHandleInvalidError extends Error {
};

export class FileReadFailedError extends Error {
};

export class FileWriteFailedError extends Error {
};

export class FileFeatures {
    public get canOpenFile(
    ): boolean {
        return "showOpenFilePicker" in window;
    }

    public get canSaveFile(
    ): boolean {
        return "showSaveFilePicker" in window;
    }

    public get canOpenAndSaveFile(
    ): boolean {
        return this.canOpenFile && this.canOpenFile;
    }
};

export class FileService {
    private _features: FileFeatures = new FileFeatures();
    private _fileHandle: FileSystemFileHandle | null = null;

    constructor(
    ) {
    }

    public get features(
    ): FileFeatures {
        return this._features;
    }
    
    private setHandle(
        handle: FileSystemFileHandle | null
    ): void {
        this._fileHandle = handle;
    }

    public get hasHandle(
    ): boolean {
        return this._fileHandle != null;
    }

    public async create(
    ): Promise<boolean> {
        if (!this.features.canSaveFile) {
            throw new FileFeatureNotAvailableError(
                'File Feature "Write" is not available with current Operating System & version of the Browser',
            );
        }

        try {
            const fileHandle: FileSystemFileHandle = await window.showSaveFilePicker();
        
            this.setHandle(fileHandle);

            return true;
        } catch {
            // Just to avoid console log for "AbortError" if user click on cancel button
        }

        return false;
    }

    public async open(
    ): Promise<boolean> {
        if (!this.features.canOpenFile) {
            throw new FileFeatureNotAvailableError(
                'File Feature "Open" is not available with current Operating System & version of the Browser',
            );
        }

        try {
            const [fileHandle]: FileSystemFileHandle[] = await window.showOpenFilePicker();
        
            this.setHandle(fileHandle);
            
            return true;
        } catch {
            // Just to avoid console log for "AbortError" if user click on cancel button
        }

        return false;
    }

    public close(
    ): void {
        this.setHandle(null);
    }

    private validateHandleAndThrow(
    ): void {
        if (!this.hasHandle) {
            throw new FileHandleInvalidError(
                'File Handle is not valid, please use File "open" or "create" to obtain valid file handle',
            );
        }
    }

    public get name(
    ): string | null {
        if (this.hasHandle) {
            return this._fileHandle!.name;
        }

        return null;
    }

    public async lastModified(
    ): Promise<Date> {
        this.validateHandleAndThrow();

        try {
            const file: File = await this._fileHandle!.getFile();
            const dateTime: number = await file.lastModified;
            return new Date(dateTime);
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async type(
    ): Promise<string> {
        this.validateHandleAndThrow();

        try {
            const file: File = await this._fileHandle!.getFile();
            const type: string = await file.type;
            return type;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async readAsString(
    ): Promise<string> {
        this.validateHandleAndThrow();

        try {
            const file: File = await this._fileHandle!.getFile();
            const content: string = await file.text();
            return content;
        } catch (error) {
            console.error(error);

            throw new FileReadFailedError();
        }
    }

    public async readAsArray(
    ): Promise<ArrayBuffer> {
        this.validateHandleAndThrow();

        try {
            const file: File = await this._fileHandle!.getFile();
            const content: ArrayBuffer = await file.arrayBuffer();
            return content;
        } catch (error) {
            console.error(error);

            throw new FileReadFailedError();
        }
    }

    public async readAsStream(
    ): Promise<ReadableStream> {
        this.validateHandleAndThrow();

        try {
            const file: File = await this._fileHandle!.getFile();
            const content: ReadableStream = await file.stream();
            return content;
        } catch (error) {
            console.error(error);

            throw new FileReadFailedError();
        }
    }

    public async writeString(
        value: string,
        overWriteExistingData: boolean = true,
    ): Promise<void> {
        this.validateHandleAndThrow();

        try {
            const fileWritableOptions: FileSystemCreateWritableOptions = {
                keepExistingData: !overWriteExistingData,
            };
            const writableStream: FileSystemWritableFileStream =
                await this._fileHandle!.createWritable(fileWritableOptions);
            await writableStream.write(value);
            await writableStream.close();
        } catch (error) {
            console.error(error);

            throw new FileWriteFailedError();
        }
    }

    public async writeArray(
        value: ArrayBuffer,
        overWriteExistingData: boolean = true,
    ): Promise<void> {
        this.validateHandleAndThrow();

        try {
            const fileWritableOptions: FileSystemCreateWritableOptions = {
                keepExistingData: !overWriteExistingData,
            };
            const writableStream: FileSystemWritableFileStream =
                await this._fileHandle!.createWritable(fileWritableOptions);
            await writableStream.write(value);
            await writableStream.close();
        } catch (error) {
            console.error(error);

            throw new FileWriteFailedError();
        }
    }
};
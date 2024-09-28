import {
    FileService,
} from './file.service';
import {
    RootModel,
} from './data.models';

export class DataNotUniqueError extends Error {
};

export class DataNotFoundError extends Error {
};

export class DataReferenceError extends Error {
};

export class DataService extends FileService {
    private readonly _jsonIndentation: string = '    ';

    private _root: RootModel | null = null;

    constructor(
    ) {
        super();

        this.resetRoot();
    }

    public get newGuid(
    ): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : ((r & 0x3) | 0x8);
            
            return v.toString(16);
          });
    }

    private get currentUTCDateAsString(
    ): string {
        return new Date().toUTCString();
    }

    private async get<TJsonObject>(
    ): Promise<TJsonObject> {
        const jsonString: string = await this.readAsString();
        const jsonObject: TJsonObject = JSON.parse(jsonString);
        return jsonObject;
    }

    private async save<TJsonObject>(
        jsonObject: TJsonObject
    ): Promise<void> {
        const jsonString: string = JSON.stringify(jsonObject, null, this._jsonIndentation);
        await this.writeString(jsonString);
    }

    private resetRoot(
    ): void {
        this._root = {
            eTag: this.newGuid,
            lastUpdatedAt: this.currentUTCDateAsString,
            products: null,
            orders: null,
        };
    }

    public get isDirty(
    ): boolean {
        if (this.hasHandle) {
            return false;
        }

        return (
            (this._root?.products?.length ?? 0) > 0
        );
    }

    public close(
    ): void {
        this.resetRoot();
        super.close();
    }

    public async getRoot(
    ): Promise<RootModel> {
        if (this.hasHandle) {
            this._root = await this.get();
        }
        
        return this._root!;
    }

    public async saveRoot(
        root: RootModel
    ): Promise<void> {
        this._root = root;
        this._root.lastUpdatedAt = this.currentUTCDateAsString;

        if (this.hasHandle) {
            await this.save(root);
        }
    }

    public async saveAsRoot(
    ): Promise<void> {
        this.saveRoot(this._root!);
    }
};
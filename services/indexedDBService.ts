import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SalArchManDB extends DBSchema {
    images: {
        key: string;
        value: {
            id: string;
            data: string; // Base64 image data
            timestamp: number;
        };
    };
}

const DB_NAME = 'salarchman_db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

class IndexedDBService {
    private dbPromise: Promise<IDBPDatabase<SalArchManDB>>;

    constructor() {
        this.dbPromise = openDB<SalArchManDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            },
        });
    }

    async saveImage(id: string, data: string): Promise<string> {
        const db = await this.dbPromise;
        await db.put(STORE_NAME, {
            id,
            data,
            timestamp: Date.now(),
        });
        return id;
    }

    async getImage(id: string): Promise<string | undefined> {
        const db = await this.dbPromise;
        const result = await db.get(STORE_NAME, id);
        return result?.data;
    }

    async deleteImage(id: string): Promise<void> {
        const db = await this.dbPromise;
        await db.delete(STORE_NAME, id);
    }

    async clearAllImages(): Promise<void> {
        const db = await this.dbPromise;
        await db.clear(STORE_NAME);
    }

    async getAllKeys(): Promise<string[]> {
        const db = await this.dbPromise;
        const keys = await db.getAllKeys(STORE_NAME);
        return keys.map(k => String(k));
    }
}

export const indexedDBService = new IndexedDBService();

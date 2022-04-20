import client from "../config/db.config";

export type Record = {
    id?: number;
    name?: string;
    userId?: number;
    content?: string;
};

export class RecordStore {
    async list(userId: number): Promise<Record[]>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT "id", "userId", "name", "content" FROM "records" WHERE "userId"=$1';
            const result = await conn.query(sql, [userId]);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get records, ${err}`);
        }
    }

    async get(id: string): Promise<Record>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM "records" WHERE "id"=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get that record, ${err}`);
        }
    }

    async create(record: Record): Promise<Record>{
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO "records" ("userId","name", "content") VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [record.userId, record.name, record.content]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create that record, ${err}`);
        }
    }

    async update(record: Record): Promise<Record>{
        try {
            const conn = await client.connect();
            const sql = 'UPDATE "records" SET "name"=$2, "content"=$3 WHERE "id"=$1 RETURNING *';
            const result = await conn.query(sql, [record.id, record.name, record.content]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot update that record, ${err}`);
        }
    }

    async delete(record: Record): Promise<void>{
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM "records" WHERE "id"=$1';
            await conn.query(sql, [record.id]);
            conn.release();
        } catch (err) {
            throw new Error(`Cannot delete that record, ${err}`);
        }
    }
}
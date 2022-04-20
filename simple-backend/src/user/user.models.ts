import * as bcrypt from 'bcrypt';
import client from '../config/db.config';

export type User = {
    id?: number;
    passwordDigest?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
};

export type UserWithCredentials = User & {
    password: string;
};

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserStore {
    async list(): Promise<User[]>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT "id", "firstName", "lastName", "email" FROM "users"';
            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get users, ${err}`);
        }
    }

    async get(id: string): Promise<User>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM "users" WHERE "id"=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get that user, ${err}`);
        }
    }

    async create(user: UserWithCredentials): Promise<User>{
        try {
            const conn = await client.connect();
            const hash = bcrypt.hashSync(`${user.password}${pepper}`, parseInt(`${saltRounds}`, 10));
            const sql = 'INSERT INTO "users" ("firstName", "lastName", "email", "passwordDigest") VALUES ($1, $2, $3, $4) RETURNING *';
            const result = await conn.query(sql, [user.firstName, user.lastName, user.email, hash]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create that user, ${err}`);
        }
    }

    async authenticate(user: UserWithCredentials): Promise<User | null>{
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM "users" WHERE "email"=($1)';
            const result = await conn.query(sql, [user.email]);
            if (result.rows.length === 1) {
                const selectedUser = result.rows[0];
                if (bcrypt.compareSync(`${user.password}${pepper}`, selectedUser.passwordDigest)) {
                    return selectedUser;
                }
            }
            conn.release();

            return null;
        } catch (err) {
            throw new Error(`Cannot authenticate. ${err}`);
        }
    }
}
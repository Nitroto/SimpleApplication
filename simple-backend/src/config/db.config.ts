import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export default new Pool({
    connectionString: process.env.DATABASE_URL,
});
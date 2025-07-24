import dotenv from "dotenv";
import { Pool } from "pg";


dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 50,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
    // ssl: {
    //     rejectUnauthorized: true,
    // },

});

export default pool;
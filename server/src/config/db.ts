import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const host = process.env.PG_HOST
const database = process.env.PG_DATABASE
const user = process.env.PG_USER
const password = process.env.PG_PASSWORD
const port = process.env.PG_PORT

const pool = new Pool({
    user: user,
    password: password,
    host: host,
    port: Number(port),
    database: database,
    ssl: true
});

export default pool;

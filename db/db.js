// db/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg; // <-- import Pool from pg

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Connection error:", err));

export default pool;

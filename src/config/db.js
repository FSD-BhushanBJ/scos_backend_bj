import pkg from "pg";
const { Pool } = pkg;

// Use environment variable (Render DB)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render
  },
});

// Test DB connection
export const connectDB = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(" DB Connected:", res.rows[0]);
  } catch (error) {
    console.error(" DB ERROR:", error);
    process.exit(1);
  }
};

export default pool;
import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name FROM tournament ORDER BY id ASC;'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}



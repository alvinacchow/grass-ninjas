// app/api/roster/route.js
import { Pool } from 'pg';
import { NextResponse } from 'next/server';

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
    const result = await pool.query('SELECT * FROM person');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching roster:', error);
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 });
  }
}

export async function PUT(request) {
    try {
      const updates = await request.json();
  
      await pool.query('BEGIN');
  
      for (const { id, included } of updates) {
        await pool.query('UPDATE person SET included = $1 WHERE id = $2', [included, id]);
      }
  
      await pool.query('COMMIT');
  
      return NextResponse.json({ message: 'Updates successful' });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error updating roster:', error);
      return NextResponse.json({ error: 'Failed to update roster' }, { status: 500 });
    }
  }
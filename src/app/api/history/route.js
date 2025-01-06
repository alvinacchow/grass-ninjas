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

export async function GET(request) {
    let result;
    const url = new URL(request.url);
    const personId = url.searchParams.get('person_id');

    if (!personId) {
        return NextResponse.json({ error: 'person_id is required' }, { status: 400 });
    }

    try {
        result = await pool.query(
            `SELECT p.tournament_id, p.person_id, p.paired_with_id, pp.name AS paired_with_name
            FROM pairing p
            JOIN person pp ON p.paired_with_id = pp.id
            WHERE p.person_id = $1`, [personId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'No pairings found for this person' }, { status: 404 });
        }
        return NextResponse.json(result.rows);
      
    } catch (queryError) {
    console.error('Query error:', queryError);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

  }
  
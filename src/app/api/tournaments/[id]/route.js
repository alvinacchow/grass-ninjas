// app/api/tournaments/[id]/route.js
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

export async function GET(request, { params }) {
  const { id } = params;  // Retrieve tournament ID from the URL params

  try {
    console.log("Executing SQL query for tournament ID:", id);
    const query = `
      SELECT
        p1.name AS person_name,
        p2.name AS paired_with_name,
        t.name AS tournament_name,
        t.year AS tournament_year
      FROM
        pairing pr
      INNER JOIN person p1 ON pr.person_id = p1.id
      INNER JOIN person p2 ON pr.paired_with_id = p2.id
      INNER JOIN tournament t ON pr.tournament_id = t.id
      WHERE
        pr.tournament_id = $1
      ORDER BY p1.name ASC;
      `;
    const result = await pool.query(query, [id]);
    console.log("success");
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows); // Return all pairings for the tournament
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 });
  }
}


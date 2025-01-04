// app/api/pairings/route.js
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

export async function POST(request) {
    console.log('API POST route reached');
    try {
      const { name, year, pairings } = await request.json();
  
      console.log('Received data:', { name, year, pairings });
      // Ensure the input data is valid
      if (!name || !year || !pairings) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      // Insert data into the PostgreSQL database

      const query1 = `
      INSERT INTO tournament (name, year)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const result1 = await pool.query(query1, [name, year]);
    const tournamentId = result1.rows[0].id; // Extract the tournament id from the result

    // Prepare the pairing insert queries
    const query2 = `
      INSERT INTO pairing (tournament_id, person_id, paired_with_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    // Create a list of queries for each pair in the pairings array
    const pairingPromises = pairings.map(pair => {
        if (pair.length === 2) {
          return [
            pool.query(query2, [tournamentId, pair[0].id, pair[1].id])
              .then(res => console.log('Pair A--B inserted:', res.rows[0]))
              .catch(error => console.error('Error inserting pair A--B:', pair, error)),
            pool.query(query2, [tournamentId, pair[1].id, pair[0].id])
              .then(res => console.log('Pair B--A inserted:', res.rows[0]))
              .catch(error => console.error('Error inserting pair B--A:', pair, error)),
          ];
        }
      
        if (pair.length === 3) {
          return [
            pool.query(query2, [tournamentId, pair[0].id, pair[1].id])
              .then(res => console.log('Pairing A--B inserted:', res.rows[0]))
              .catch(error => console.error('Error inserting pairing A--B:', pair, error)),
            
            pool.query(query2, [tournamentId, pair[1].id, pair[2].id])
              .then(res => console.log('Pairing B--C inserted:', res.rows[0]))
              .catch(error => console.error('Error inserting pairing B--C:', pair, error)),
            
      
            pool.query(query2, [tournamentId, pair[2].id, pair[0].id])
              .then(res => console.log('Pairing C--A inserted:', res.rows[0]))
              .catch(error => console.error('Error inserting pairing C--A:', pair, error)),
            
          ];
        }
      }).flat();
      
      

    // Execute all the pairing insertions concurrently
    await Promise.all(pairingPromises);

    // Return a success response
    return NextResponse.json({
      message: 'Tournament and pairings submitted successfully',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error submitting tournament and pairings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

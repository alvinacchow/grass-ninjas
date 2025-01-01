'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


const TournamentDetail = () => {
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const id = pathname.split('/').pop(); // Gets the last segment of the path

  useEffect(() => {
    if (!id) return; // If there's no ID, don't attempt to fetch

    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('fetched data: ', data);
        setTournament(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tournament:', err);
      }
    };

    fetchTournament();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!tournament) {
    return <p>Loading tournament details...</p>;
  }

  return (
    <div className="flex-1 flex flex-col p-5">
      <div className="p-5 flex-col items-center text-center">
        <a href="/" className="absolute top-5 left-5">
          <img src="/logo.svg" alt="Home" className="w-20 h-20" />
        </a>
        <h1 className="text-2xl font-bold mb-2">{tournament[0]?.tournament_name}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Roster Size: {tournament.length}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Year: {tournament[0]?.tournament_year}
        </p>
       
      </div>
  
      <ul className="px-40 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournament.length > 0 ? (
          tournament.map((entry, index) => (
            <li
              key={index}
              className="border border-gray-200 rounded-lg shadow-md dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="p-5 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {entry.person_name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Paired With: {entry.paired_with_name}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No entries found.
          </p>
        )}
      </ul>
    </div>
  );
};
export default TournamentDetail;  
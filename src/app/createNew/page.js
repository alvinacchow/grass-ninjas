'use client'
import { useState, useEffect, useCallback } from 'react';
import Sortable from 'sortablejs';
import { useRouter } from "next/navigation";

const createNew = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(new Map());
  const router = useRouter();
  
  const previewSend = () => {
    router.push("/previewSend");
  }

  const fetchPeople = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/roster');
      if (!response.ok) throw new Error('Failed to fetch roster');
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      const sortedPeople = [...data].sort((a, b) => {
        if (a.status === "Vet" && b.status !== "Vet") return -1;
        if (a.status !== "Vet" && b.status === "Vet") return 1;
        return a.name.localeCompare(b.name);
      });

      setPeople(sortedPeople);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load roster data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const togglePerson = (personId) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) => {
        if (person.id === personId) {
          const newIncluded = !person.included;
          setPendingChanges((prev) =>
            new Map(prev).set(personId, { id: personId, included: newIncluded })
          );
          return { ...person, included: newIncluded };
        }
        return person;
      })
    );
  };

  // Filtered people based on "included"
  const filteredPeople = people.filter(person => person.included);
  
  
  useEffect(() => {
    if (filteredPeople.length > 0) {
      const list = document.getElementById('sortableList');
      if (list) {
        new Sortable(list, {
          group: 'shared',
          animation: 150,
        });
      }
    }
  }, [filteredPeople]);

  const link = process.env.NEXT_PUBLIC_SHEET_24_25;
  const defaultMessage = `GOOD AFTERNOON [PLAYER_1]!! 💕 Hope you are pumped for the tourney!! Your tournament buddy is [PLAYER_2]!!!🥳  Remember that the maximum limit to spend is $10. It would be awesome to include a letter/note 💌  and cheer for them on the sideline. You can refer to the Secret Sister spreadsheet on FRISBEE 🥏 LINKS🔗  to see what snacks/drinks 🥂  your tourney buddy would like. See you tomorrow!!\n ${link}`

  return (
    <div>
      <div className="p-5 mb-5 flex-col items-center text-center">
        <a href="/" className="absolute top-5 left-5">
          <img src="logo.svg" alt="Home" className="w-20 h-20" />
        </a>
        <h1 className="mb-5 text-xl text-gray-900 dark:text-white text-center">
          Create New Event
        </h1>

        {/* Horizontal Layout */}
        <div className="my-16 flex">
          {/* Event Roster Sidebar */}
          <div className="w-1/5">
            <h2 className="text-left text-md mb-4 text-gray-900 dark:text-white">Event Roster</h2>
            <ul className="px-4 grid grid-cols-1 justify-start gap-2 max-w-full">
              {people.length > 0 ? (
                people.map((person) => (
                  <li key={person.id} className="border-none bg-transparent shadow-none dark:border-none dark:bg-transparent">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`checkbox-${person.id}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={Boolean(person.included)}
                        onChange={() => togglePerson(person.id)}
                      />
                      <label htmlFor={`checkbox-${person.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
                        {person.name}
                      </label>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center">No people found.</p>
              )}
            </ul>
          </div>

          {/* Pairings */}
          <div className="flex-1 flex">
            {/* Pairings Section */}
            <div className="w-1/2 p-5">
              <h2 className="mb-4 text-md text-gray-900 dark:text-white">Pairings</h2>
              <ul id="sortableList" className="grid grid-cols-2 gap-2">
                {filteredPeople.map((person) => (
                  <li
                    key={person.id}
                    className="sortable-item text-sm inline-flex items-center justify-between w-full p-2 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span>{person.name}</span>
                    <div className="flex items-center">
                      <img src="drag.svg" alt="drag icon" className="w-4 h-4 filter invert" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Input Section */}
            <div className="w-1/2 p-5">
              <label htmlFor="textarea" className="mb-4 block text-md font-medium text-gray-900 dark:text-white">
                Message
              </label>
              <textarea
                id="textarea"
                rows="20"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
                placeholder="Type something..."
                defaultValue={defaultMessage}
              />

              <button
                className="flex bg-blue-500 text-white px-4 py-2 text-sm rounded mb-4 hover:bg-blue-600 ml-auto"
                onClick={previewSend}
              >
                Preview Send
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>

  );
};  

export default createNew;

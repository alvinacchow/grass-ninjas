'use client';

import { useState, useEffect, useCallback } from 'react';

const ModifyRoster = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(new Map());

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

  const handleSaveChanges = async () => {
    if (pendingChanges.size === 0) return;
    setSaving(true);
    setError(null);
  
    try {
      const updates = Array.from(pendingChanges.values());
  
      const response = await fetch('/api/roster', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
  
      if (!response.ok) throw new Error('Failed to save changes');
  
      setPendingChanges(new Map());
      await fetchPeople();
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="animate-pulse">Loading roster...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-5 flex-col items-center text-center">
        {/* Add Image with Link */}
        <a href="/" className="absolute top-5 left-5">
          <img
            src="logo.svg" // Replace with your image URL
            alt="Home"
            className="w-20 h-20" // Adjust size as needed
          />
        </a>

        <h1 className="mb-5 text-xl text-gray-900 dark:text-white text-center">
          Set Default Roster
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSaveChanges}
          disabled={saving || pendingChanges.size === 0}
        >
          {saving ? 'Saving...' : `Save Changes`}
        </button>
      
        {error && (
          <div className="mb-4 text-center text-red-600">
            {error}
          </div>
        )}
      </div>

      <ul className="px-40 grid w-full gap-6 md:grid-cols-6">
        {people.length > 0 ? (
          people.map((person) => (
            <li
              key={person.id}
              className="border border-gray-200 rounded-lg shadow-md dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <input
                type="checkbox"
                id={`checkbox-${person.id}`}
                className="hidden peer"
                checked={Boolean(person.included)}
                onChange={() => togglePerson(person.id)}
              />
              <label
                htmlFor={`checkbox-${person.id}`}
                className={`inline-flex flex-col items-center justify-center w-full p-5 text-gray-500 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                <div className="block text-center">
                  <div className="w-full text-lg font-semibold">
                    {person.name}
                  </div>
                </div>
              </label>
            </li>
          ))
        ) : (
          <p className="text-center">No people found.</p>
        )}
      </ul>
    </div>
  );
};

export default ModifyRoster;
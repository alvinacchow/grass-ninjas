'use client';
import { useEffect, useState } from 'react';

const FinalizedInfoPage = () => {
    const [pairings, setPairings] = useState([]);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        // Retrieve data from sessionStorage
        const storedPairings = sessionStorage.getItem('pairings');
        const storedMessage = sessionStorage.getItem('message');
        const storedName = sessionStorage.getItem('name');
        const storedYear = sessionStorage.getItem('year');
    
        if (storedPairings) {
          setPairings(JSON.parse(storedPairings));
        }
    
        if (storedMessage) {
            setMessage(storedMessage);
        }

        if (storedName) {
            setName(storedName);
        }

        if (storedYear) {
            setYear(storedYear);
        }
      }, []);

  // Function to replace placeholders in the message
  const getPersonalizedMessage = (pair, fromPlayerIndex, toPlayerIndex) => {
    let personalizedMessage = message;

    // Ensure fromPlayer and toPlayer are valid
    const fromPlayer = pair[fromPlayerIndex];
    const toPlayer = pair[toPlayerIndex];

    // If the player exists and has a name, replace the placeholder; otherwise, keep the placeholder
    personalizedMessage = fromPlayer && fromPlayer.name
      ? personalizedMessage.replace('[PLAYER_1]', fromPlayer.name)
      : personalizedMessage;

    if (pair.length > 1) {
      personalizedMessage = toPlayer && toPlayer.name
        ? personalizedMessage.replace('[PLAYER_2]', toPlayer.name)
        : personalizedMessage;
    }

    return personalizedMessage;
  };
  return (
    <div className="p-5 relative">
        <div className="flex items-center w-full">
            <a href="/" className="top-5 left-5">
                <img src="logo.svg" alt="Home" className="w-20 h-20" />
            </a>
            <h1 className="text-xl font-bold text-center flex-grow">
                {name} {year}
            </h1>
        </div>
        <div id="alert-additional-content-1" className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
            <div className="flex items-center">
                <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg font-medium">This is an info alert</h3>
            </div>
            <div className="mt-2 mb-4 text-sm">
                Make sure you copy and send all messages before you navigate away from this page!
            </div>
        </div>

      {/* Table htmlFor displaying pairings and personalized messages */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left text-gray-700">Send To</th>
              <th className="p-2 text-left text-gray-700">Message</th>
              <th className="p-2 text-left text-gray-700">Send To</th>
              <th className="p-2 text-left text-gray-700">Message</th>
            </tr>
          </thead>
          <tbody>
            {pairings.length > 0 ? (
            pairings.map((pair, index) => {
              const isThreesome = pair.length === 3; // Check if this pairing has three people
              return [
                // First Row htmlFor Pairing
                <tr key={`pair-${index}`} className="border-b border-gray-200">
                  <td className="p-2 items-right">
                    <p>{pair[0]?.name || ''}</p>
                    <button id={`copy-button-${index}-0`}
                      onClick={() => {
                        const textArea = document.getElementById(`textarea-${index}-0`);
                        const button = document.getElementById(`copy-button-${index}-0`);
                    
                        if (textArea && button) {
                          navigator.clipboard.writeText(textArea.value);
                          button.classList.add('opacity-50');
                          console.log('Button clicked. Grayed out.');
                          setTimeout(() => {
                            button.classList.remove('opacity-50');
                          }, 2000);  // 2000ms (2 seconds)
                        }
                      }}
                    >
                      <img
                        src="/copy.svg"
                        alt="Copy"
                        className="w-5 h-5 filter invert transition-transform transform group-hover:scale-110"
                      />
                    </button>
                  </td>
                  <td className="p-2">
                    <textarea
                      id={`textarea-${index}-0`} // Unique ID
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-green-600 dark:focus:border-green-600"
                      rows="6"
                      value={pair[1] ? getPersonalizedMessage(pair, 0, 1) : ''}
                      readOnly
                    />
                  </td>
                  <td className="p-2">
                    <p>{pair[1]?.name || ''}</p>
                    <button id={`copy-button-${index}-1`}
                      onClick={() => {
                        const textArea = document.getElementById(`textarea-${index}-1`);
                        const button = document.getElementById(`copy-button-${index}-1`);
                    
                        if (textArea && button) {
                          // Copy the text to clipboard
                          navigator.clipboard.writeText(textArea.value);
                    
                          // Add 'opacity-50' and 'cursor-not-allowed' to gray out the button
                          button.classList.add('opacity-50');
                    
                          // Log htmlFor debugging purposes
                          console.log('Button clicked. Grayed out.');
                    
                          // Remove grayed-out effect after 2 seconds
                          setTimeout(() => {
                            button.classList.remove('opacity-50');
                          }, 2000);  // 2000ms (2 seconds)
                        }
                      }}
                    >
                      <img
                        src="/copy.svg"
                        alt="Copy"
                        className="w-5 h-5 filter invert transition-transform transform group-hover:scale-110"
                      />
                    </button>
                  </td>
                  <td className="p-2">
                    <textarea
                      id={`textarea-${index}-1`} // Unique ID htmlFor the second textarea
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-green-600 dark:focus:border-green-600"
                      rows="6"
                      value={pair[2] ? getPersonalizedMessage(pair, 1, 2) : getPersonalizedMessage(pair, 1, 0) }
                      readOnly
                    />
                  </td>
                </tr>,

                // Second Row htmlFor Third Person if it’s a threesome
                isThreesome && (
                  <tr key={`third-${index}`} className="border-b border-gray-200">
                    <td className="p-2">
                      <p>{pair[2]?.name || ''}</p>
                      <button id={`copy-button-${index}-2`}
                      onClick={() => {
                        const textArea = document.getElementById(`textarea-${index}-2`);
                        const button = document.getElementById(`copy-button-${index}-2`);
                    
                        if (textArea && button) {
                          // Copy the text to clipboard
                          navigator.clipboard.writeText(textArea.value);
                    
                          // Add 'opacity-50' and 'cursor-not-allowed' to gray out the button
                          button.classList.add('opacity-50');
                    
                          // Log htmlFor debugging purposes
                          console.log('Button clicked. Grayed out.');
                    
                          // Remove grayed-out effect after 2 seconds
                          setTimeout(() => {
                            button.classList.remove('opacity-50');
                          }, 2000);  // 2000ms (2 seconds)
                        }
                      }}
                    >
                      <img
                        src="/copy.svg"
                        alt="Copy"
                        className="w-5 h-5 filter invert transition-transform transform group-hover:scale-110"
                      />
                    </button>
                    </td>
                    <td colSpan="3" className="p-2">
                      <textarea
                        id={`textarea-${index}-2`} // Unique ID htmlFor the third person
                        className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-green-600 dark:focus:border-green-600"
                        rows="6"
                        value={
                          pair[2]
                            ? `${getPersonalizedMessage(pair, 2, 0)}`
                            : ''
                        }
                        readOnly
                      />
                    </td>
                  </tr>
                ),
              ];
            })
          ) : (
            <tr>
              <td colSpan="4" className="p-2 text-center">
                No pairings available.
              </td>
            </tr>
          )}
        </tbody>


        </table>
      </div>
    </div>
  );
};

export default FinalizedInfoPage;
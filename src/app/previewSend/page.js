'use client';
import { useEffect, useState } from 'react';

const PreviewSendPage = () => {
  const [pairings, setPairings] = useState([]);
  const [message, setMessage] = useState('');
  const [personalizedMessages, setPersonalizedMessages] = useState([]);

  useEffect(() => {
    console.log("reached");
    // Retrieve data from sessionStorage
    const storedPairings = sessionStorage.getItem('pairings');
    const storedMessage = sessionStorage.getItem('message');

    if (storedPairings) {
      setPairings(JSON.parse(storedPairings));
    }

    if (storedMessage) {
      setMessage(storedMessage);
    }
    console.log("pairings from storage", storedPairings);
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

  // Handle changes in the personalized message inputs
  const handleMessageChange = (event, pairIndex, fromPlayerIndex, toPlayerIndex) => {
    const newMessages = [...personalizedMessages];
    newMessages[pairIndex] = newMessages[pairIndex] || [];
    newMessages[pairIndex][fromPlayerIndex] = event.target.value;

    setPersonalizedMessages(newMessages);
  };

  // Function to send all messages (just logs in this case)
  const handleSendAllMessages = () => {
    console.log('Sending all messages:', personalizedMessages);
    // Logic for sending the messages can be added here
  };

  return (
    <div>
        <div className="p-5 flex items-center justify-between">
            <a href="/" className="flex-shrink-0">
                <img src="logo.svg" alt="Home" className="w-20 h-20" />
            </a>
            <h1 className="text-xl font-bold text-center flex-grow">Preview Message</h1>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSendAllMessages}
            >
                Send All Messages
            </button>
        </div>
      
      {/* Table for displaying pairings and personalized messages */}
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
              pairings.map((pair, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-2">
                    {/* Only show the first player in the Send From column */}
                    <p>{pair[0]?.name}</p>
                  </td>
                  <td className="p-2">
                    <textarea
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
                      rows="6"
                      value={getPersonalizedMessage(pair, 0, 1)} // A to B
                      onChange={(e) => {
                        // Handle message change if needed
                      }}
                    />
                  </td>
                  <td className="p-2">
                    {/* Only show the first player in the Send From column */}
                    <p>{pair[1]?.name}</p>
                  </td>
                  <td className="p-2">
                    <textarea
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-500"
                      rows="6"
                      value={pair[1] ? getPersonalizedMessage(pair, 1, 0) : ''} // B to A
                      onChange={(e) => {
                        // Handle message change if needed
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">No pairings available.</td>
              </tr>
            )}
          </tbody>

        
        </table>
      </div>
    </div>
  );
};

export default PreviewSendPage;
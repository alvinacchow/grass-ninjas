'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

const PreviewSendPage = () => {
  const [pairings, setPairings] = useState([]);
  const [message, setMessage] = useState('');
  const [personalizedMessages, setPersonalizedMessages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedPairings = sessionStorage.getItem('pairings');
    const storedMessage = sessionStorage.getItem('message');

    if (storedPairings) {
      setPairings(JSON.parse(storedPairings));
    }

    if (storedMessage) {
      setMessage(storedMessage);
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

  const showWarning = () => {
    setShowAlert(true); 
  };


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form default behavior

    // Gather form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const year = formData.get('year');
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('year', year);

    const dataToSend = {
      name,
      year,
      pairings,
    };

    try {
      console.log("Data being sent:", JSON.stringify(dataToSend, null, 2)); // Pretty print JSON

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pairings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      // Handle the response
      if (response.ok) {
        console.log('Pairings submitted successfully');
        router.push('/finalizedInfo'); 
      } else {
        console.error('Error submitting pairings');
      }
    } catch (error) {
      console.error('Error submitting pairings:', error);
    }
  };


  return (
    <div>
      {/* Modal */}
      {showModal && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          className={`modal-container fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex ${
            showModal ? 'backdrop-blur-sm' : ''
          }`} 
          onClick={closeModal} 
        >
   
          <div 
            className="relative p-4 w-full max-w-md max-h-full"
            onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Enter Information
                </h3>
                
                <button
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                
              </div>
              <div className="p-4 md:p-5">
                <p className="pb-2">
                  <span className="text-green-500">Are you sure? Pairings will be submitted to the database and cannot be changed.</span>
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tournament Name
                    </label>
                    <input
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Irvine Open"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      min="2020"
                      name="year"
                      id="year"
                      placeholder="2024"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-800 dark:focus:ring-green-800"
                  >
                    Submit All
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert */}
      <div className="p-5 relative">
        <div className="flex items-center justify-between w-full">
          <a href="/" className="top-5 left-5">
            <img src="logo.svg" alt="Home" className="w-20 h-20" />
          </a>
          <h1 className="text-xl text-gray-900 dark:text-white">
            Preview Messages
          </h1>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
            onClick={openModal}
          >
            Finalize and Save
          </button>
        </div>

        <div className="p-5 text-left bg-gray-800 rounded-lg resize-none focus:outline-none mt-10 w-full">
          <p className="text-sm mb-2">
            The table below shows all pairings and their respective personalized messages. If you are satisifed with these pairings, press the <span className="text-green-500">Finalize and Save</span> button. Finally, enter the tournament name and year.
          </p>
        </div>
      </div>

      
      {/* Table htmlFor displaying pairings and personalized messages */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-green-700 text-white dark:bg-green-600 dark:text-white border border-green-700">
              <th className="p-2 text-left text-white">Send To</th>
              <th className="p-2 text-left text-white">Message</th>
              <th className="p-2 text-left text-white">Send To</th>
              <th className="p-2 text-left text-white">Message</th>
            </tr>
          </thead>
          <tbody>
            {pairings.length > 0 ? (
            pairings.map((pair, index) => {
              const isThreesome = pair.length === 3; // Check if this pairing has three people
              return [
                // First Row htmlFor Pairing
                <tr key={`pair-${index}`} className="border-b border-gray-200">
                  <td className="p-2 items-right border border-green-700">
                    <p>{pair[0]?.name || ''}</p>
                    <button id={`copy-button-${index}-0`}
                      onClick={() => {
                        const textArea = document.getElementById(`textarea-${index}-0`);
                        const button = document.getElementById(`copy-button-${index}-0`);
                    
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
                  <td className="p-2 border border-green-700">
                    <textarea
                      id={`textarea-${index}-0`} // Unique ID
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-green-600 dark:focus:border-green-600"
                      rows="6"
                      value={pair[1] ? getPersonalizedMessage(pair, 0, 1) : ''}
                      readOnly
                    />
                  </td>
                  <td className="p-2 border border-green-700">
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
                  <td className="p-2 border border-green-700">
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
                    <td className="p-2 border border-green-700">
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
                    <td colSpan="3" className="p-2 border border-green-700">
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
              <td colSpan="4" className="p-2 text-center border border-green-700">
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

export default PreviewSendPage;
"use client"; 
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ tournaments }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateNew = () => {
    router.push("/createNew");
  }

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white px-4 fixed left-0 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-center pb-3">
            <button className="flex bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
            onClick={handleCreateNew}>
              Create New Event
            </button>
          </div>

          <Link href="/modifyRoster">
            <button 
              className="flex justify-between w-full text-lg font-semibold py-2 hover:text-gray-400">
              Modify Roster
            </button>
          </Link>

          <button
            onClick={toggleNavbar}
            className="flex justify-between w-full text-lg font-semibold py-2"
          >
            <span>History</span>
            <span
              className={`transform transition-all duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <img
                src="arrow.svg"
                alt="arrow icon"
                className="w-10 h-10 filter invert"
              />
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "h-auto" : "h-0"
            }`}
          >
          <ul>
            {tournaments.map((tournament) => (
              <li key={tournament.id} className="py-2">
                <a
                  href={`/tournamentPage/${tournament.id}`} 
                  className="hover:text-blue-400"
                >
                  {tournament.name}
                </a>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

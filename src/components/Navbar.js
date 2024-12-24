"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Toggle the navbar visibility
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateNew = () => {
    router.push("/createNew");
  }

  return (
    <div className="flex">
      {/* Navbar container */}
      <div className="w-64 bg-gray-800 text-white px-4 fixed left-0 h-full">
        {/* Create New Button */}
        <div className="flex justify-center pb-3">
          <button className="flex bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
            onClick={handleCreateNew}>
            Create New
          </button>
        </div>

        {/* Toggle button */}
        <Link href="/modifyRoster">
        <button className="flex justify-between w-full text-lg font-semibold py-2 hover:text-gray-400">
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
            ↓
          </span>
        </button>

        {/* Collapsible menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "h-auto" : "h-0"
          }`}
        >
          <ul className="mt-4">
            <li className="py-2">
              <a href="#" className="hover:text-gray-400">UCLA One-Day</a>
            </li>
            <li className="py-2">
              <a href="#" className="hover:text-gray-400">UCSD K-Fall</a>
            </li>
            <li className="py-2">
              <a href="#" className="hover:text-gray-400">USC One-Day</a>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  );
}

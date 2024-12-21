"use client";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the navbar visibility
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Navbar container */}
      <div className="w-64 bg-gray-800 text-white p-4 fixed left-0 h-full">
        {/* Toggle button */}
        <button
          onClick={toggleNavbar}
          className="flex items-center justify-between w-full text-lg font-semibold"
        >
          <span>Menu</span>
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
              <a href="#" className="hover:text-gray-400">Roster</a>
            </li>
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

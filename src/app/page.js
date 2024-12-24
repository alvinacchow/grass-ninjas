import Navbar from '@/components/Navbar';
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex">

      {/* Sidebar container with logo and collapsible menu */}
      <div className="w-64 bg-gray-800 text-white p-4 flex-col items-start">

        {/* Logo */}
        <Image
          className="mb-5 mx-auto"  // margin bottom to add some space between logo and menu
          src="/logo.svg"  // Ensure logo.svg is inside the /public folder
          alt="Grass Ninjas logo"
          width={180}
          height={38}
          priority
        />

        {/* Navbar component */}
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8">
        <h1>Welcome to the Grass Ninjas site!</h1>
        {/* Your content */}
      </div>
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Image from "next/image";

// Fetch tournaments on the server side
async function fetchTournaments() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tournament`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tournaments");
  }
  return response.json();
}

export default async function Home() {
  const tournaments = await fetchTournaments(); // Call fetchTournaments here

  return (
    <div className="min-h-screen flex">
      {/* Sidebar container with logo and collapsible menu */}
      <div className="w-64 bg-gray-800 text-white p-4 flex-col items-start">
        {/* Logo */}
        <Image
          className="mb-5 mx-auto" // margin bottom to add some space between logo and menu
          src="/logo.svg" // Ensure logo.svg is inside the /public folder
          alt="Grass Ninjas logo"
          width={180}
          height={38}
          layout="responsive"
          priority
        />

        {/* Navbar component */}
        <Navbar tournaments={tournaments} />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8">
        <div className="w-full p-3 my-3 bg-gray-800 rounded-lg resize-none focus:outline-none">
          <h1 className="text-left text-xl p-2 text-green-500" style={{ fontWeight: 'bold' }}>To Get Started</h1>
        </div>
  
        <div className="w-full p-5 text-left my-3 bg-gray-800 rounded-lg resize-none focus:outline-none">
          <p className="py-2 text-sm">
            To start the buddy pairing process for a new tournament, use the <span className="text-green-500">Create New Event</span> button located on the left side of the interface. Clicking this button initiates the setup for a new event and automatically includes players from the default roster. These pre-selected players are those who typically attend every tournament, streamlining the setup process.
            For more details about configuring the default roster, refer to the <span className="text-green-500">Set Default Roster</span> section.
          </p>
        </div>

        <div className="w-full p-5 text-left my-3 bg-gray-800 rounded-lg resize-none focus:outline-none">
          <p className="py-2 text-sm">
            The <span className="text-green-500">Set Default Roster</span> page allows you to configure a default roster, which should simplify the pairing process by pre-selecting players who consistently attend every tournament. When setting the default roster, you can identify and toggle these reliable attendees in advance. Once set, these players will automatically be included in the roster for each tournament, saving time and reducing the need for manual selections.
            By having certain players pre-toggled, the system ensures a more efficient and seamless pairing experience while maintaining flexibility for adjustments as needed.
          </p>
        </div>

        <div className="w-full p-5 text-left my-3 bg-gray-800 rounded-lg resize-none focus:outline-none">
          <p className="py-2 text-sm">
          The <span className="text-green-500">History</span> menu provides an overview of previous tournaments. By expanding the menu, you can see a list of past tournaments. Selecting a specific tournament from the list will navigate you to its dedicated page, where you can view detailed information, including the buddy pairings for that tournament.
          This feature helps you quickly reference past tournaments and their pairings, making it easy to review or analyze historical data.


          </p>
        </div>
        
      </div>
    </div>
    
  );
}

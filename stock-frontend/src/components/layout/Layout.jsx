import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Header toggleSidebar={() => setIsOpen(!isOpen)} />
      <Sidebar isOpen={isOpen} />

      {/* Main Content */}
      <main className="pt-16 md:ml-[25%] lg:ml-[15%] p-4 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
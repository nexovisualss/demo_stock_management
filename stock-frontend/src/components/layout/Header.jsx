// src/components/layout/Header.jsx
import { Bell, Menu, Search } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-sm z-50 flex items-center justify-between px-4 md:px-8">

      {/* LEFT: Logo + Hamburger */}
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-bold text-indigo-600">
          StockPro
        </h1>
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-4">
        <Bell className="text-gray-600 cursor-pointer" />

        <div className="w-9 h-9 bg-indigo-500 text-white flex items-center justify-center rounded-full font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
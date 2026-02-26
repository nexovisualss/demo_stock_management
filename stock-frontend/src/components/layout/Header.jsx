// src/components/layout/Header.jsx
import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

export default function Header({ toggleSidebar, alerts = [] }) {
  const [open, setOpen] = useState(false);
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
      <div className="relative">
        {/* 🔔 Bell */}
        <div onClick={() => setOpen(!open)} className="cursor-pointer relative">
          <Bell className="text-gray-600" />

          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>

        {/* 🔽 Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded p-3 z-50">
            <h3 className="font-semibold mb-2">Low Stock Alerts</h3>

            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">No alerts</p>
            ) : (
              alerts.map((p) => (
                <p key={p._id} className="text-sm border-b py-1">
                  {p.name} (Stock: {p.stock})
                </p>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
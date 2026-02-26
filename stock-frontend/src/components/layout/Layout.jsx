import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  // 🔥 FETCH LOW STOCK ALERTS
  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API}/api/dashboard?filter=all`);
      setAlerts(res.data.lowStock || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div>
      {/* 🔥 PASS ALERTS HERE */}
      <Header
        toggleSidebar={() => setIsOpen(!isOpen)}
        alerts={alerts}
      />

      <Sidebar isOpen={isOpen} />

      <main className="pt-16 md:ml-[25%] lg:ml-[15%] p-4 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
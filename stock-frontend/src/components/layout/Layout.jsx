import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const API = import.meta.env.VITE_API_URL;

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
      <Header
        toggleSidebar={() => setIsOpen(!isOpen)}
        alerts={alerts} // ✅ IMPORTANT
      />
      <Sidebar isOpen={isOpen} />

      <main className="pt-16 md:ml-[25%] lg:ml-[15%] p-4 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
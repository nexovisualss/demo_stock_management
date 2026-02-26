import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({});
  const [filter, setFilter] = useState("today");

  const fetchDashboard = async () => {
    const res = await axios.get(`${API}/api/dashboard?filter=${filter}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  // 📊 Dummy graph data (clean UI)
  const chartData = [
    { name: "Mon", value: 20 },
    { name: "Tue", value: 40 },
    { name: "Wed", value: 35 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 45 },
    { name: "Sat", value: 60 },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* 🔥 FILTER */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["today", "month", "year", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* STOCK IN */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Stock In</h2>
          <p className="text-2xl font-bold">{data.stockIn || 0}</p>
        </div>

        {/* STOCK OUT */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Stock Out</h2>
          <p className="text-2xl font-bold">{data.stockOut || 0}</p>
        </div>

        {/* TOTAL */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Total Stock</h2>
          <p className="text-2xl font-bold">{data.totalStock || 0}</p>
        </div>
      </div>

      {/* 🔥 GRAPHS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* LINE */}
        <div className="bg-white p-4 rounded shadow h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white p-4 rounded shadow h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔥 CATEGORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Shirt", "T-shirt", "Pant", "Track"].map((cat) => (
          <div key={cat} className="bg-white p-4 rounded shadow text-center">
            <h2 className="font-semibold">{cat}</h2>
            <p className="text-2xl font-bold text-indigo-600">
              {data.categoryStats?.[cat] || 0}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
// src/pages/Dashboard.jsx
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
  Legend,
} from "recharts";

export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState({});
  const [filter, setFilter] = useState("all");
  
  // 🔥 FETCH DASHBOARD
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${API}/api/dashboard?filter=${filter}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filter]);

  // ✅ REAL GRAPH DATA FROM BACKEND
  const chartData = data.graphData || [];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* 🔥 FILTER */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["today", "month", "year", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        
        {/* STOCK IN */}
        <div className="bg-white p-5 rounded-xl shadow flex flex-col gap-2">
          <p className="text-gray-500 text-sm">Stock In</p>
          <h2 className="text-3xl font-bold text-green-600">
            {data.stockIn || 0}
          </h2>
        </div>

        {/* STOCK OUT */}
        <div className="bg-white p-5 rounded-xl shadow flex flex-col gap-2">
          <p className="text-gray-500 text-sm">Stock Out</p>
          <h2 className="text-3xl font-bold text-red-500">
            {data.stockOut || 0}
          </h2>
        </div>

        {/* TOTAL */}
        <div className="bg-white p-5 rounded-xl shadow flex flex-col gap-2">
          <p className="text-gray-500 text-sm">Total Stock</p>
          <h2 className="text-3xl font-bold text-indigo-600">
            {data.totalStock || 0}
          </h2>
        </div>
      </div>

      {/* 🔥 GRAPHS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* 📈 LINE CHART */}
        <div className="bg-white p-4 rounded-xl shadow h-72">
          <h2 className="font-semibold mb-2">Stock Movement (Line)</h2>

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="in"
                stroke="#22c55e"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="out"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 BAR CHART */}
        <div className="bg-white p-4 rounded-xl shadow h-72">
          <h2 className="font-semibold mb-2">Stock Movement (Bar)</h2>

          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="in" fill="#22c55e" />
              <Bar dataKey="out" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔥 CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {["Shirt", "T-shirt", "Pant", "Track"].map((cat) => (
          <div
            key={cat}
            className="bg-white p-5 rounded-xl shadow text-center"
          >
            <h2 className="text-gray-600">{cat}</h2>

            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {data.categoryStats?.[cat] || 0}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
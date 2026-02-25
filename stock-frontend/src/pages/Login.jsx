// Login.jsx
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/login", form);

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Stock Manager
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}
// src/components/layout/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Stock", path: "/stock" },
    { name: "Add Product", path: "/add-product" },
    { name: "Edit Product", path: "/view-product" },
  ];

  // 🔐 Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const token = localStorage.getItem("token");

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-gray-900 text-white p-5 flex flex-col transition-transform duration-300
      w-[75%] sm:w-[60%] md:w-[25%] lg:w-[15%]
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* TOP MENU */}
      <nav className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-indigo-600"
                : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* BOTTOM BUTTON */}
      <div className="mt-auto">
        {token ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/"
            className="block text-center bg-green-500 hover:bg-green-600 p-3 rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
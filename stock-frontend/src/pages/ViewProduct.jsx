// src/pages/ViewProduct.jsx
import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const API = import.meta.env.VITE_API_URL;

  // ✅ fetch data
  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [location]);

  // ✅ delete
  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/products/${id}`);
    fetchProducts(); // 🔥 real-time update
  };

  // ✅ search filter
  const filtered = products.filter((p) => {
    const value = search.replace(/\s+/g, "").toLowerCase();

    const combined = `
  ${p.name || ""}
  ${p.sku || ""}
  ${p.category || ""}
  ${p.subCategory || ""}
  ${p.gsm || ""}
  ${p.stock || ""}
`
      .replace(/\s+/g, "")
      .toLowerCase();

    return combined.includes(value);
  });

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">Product List</h1>

        {/* SEARCH + BUTTON */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg w-full md:w-1/3"
          />

          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Action</th>
                <th className="p-3">Image</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">GSM</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sub Category</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t">
                  {/* ACTION */}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-product/${p._id}`)}
                      className="px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>

                  {/* IMAGE */}
                  <td className="p-3">
                    {p.images?.map((img, i) => (
                      <img
                        src={`${API}${img}`}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/50")
                        }
                        className="w-12 h-12 object-cover inline mr-2 rounded"
                      />
                    ))}
                  </td>

                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.gsm}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.subCategory}</td>
                  <td className="p-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

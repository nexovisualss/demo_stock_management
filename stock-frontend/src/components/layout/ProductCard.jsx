//src/components/layout/ProductCard.jsx

import { useState } from "react";
import axios from "axios";

export default function ProductCard({ product, refresh }) {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState(""); // restock / sell
  const [qty, setQty] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // ✅ HANDLE SUBMIT
  const handleSubmit = async () => {
    try {
      if (!qty || qty <= 0) {
        alert("Enter valid quantity");
        return;
      }

      if (type === "restock") {
        await axios.put(`${API}/api/products/restock/${product._id}`, {
          quantity: qty,
        });
      } else {
        await axios.put(`${API}/api/products/sell/${product._id}`, {
          quantity: qty,
        });
      }

      setShowModal(false);
      setQty("");
      refresh(); // 🔥 update UI everywhere
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-white p-4 rounded shadow flex flex-col h-full min-h-[320px]">
        <div className="flex-grow">
          <img
            src={
              product.images?.length
                ? product.images[0].startsWith("http")
                  ? product.images[0]
                  : `${API}${product.images[0]}`
                : "https://via.placeholder.com/300"
            }
            className="h-40 w-full object-cover rounded"
          />

          <h2 className="font-bold mt-2">{product.name}</h2>
          <p>GSM: {product.gsm}</p>
          <p>SKU: {product.sku}</p>

          <p
            className={`font-semibold ${
              product.stock === 0 ? "text-red-500" : ""
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
          </p>
        </div>
        {/* BUTTONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setType("restock");
              setShowModal(true);
            }}
            className="bg-green-500 text-white p-2 rounded w-full"
          >
            Restock
          </button>

          <button
            onClick={() => {
              setType("sell");
              setShowModal(true);
            }}
            className="bg-red-500 text-white p-2 rounded w-full"
          >
            Sold
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)} // ✅ click outside close
        >
          <div
            className="bg-white p-6 rounded w-80"
            onClick={(e) => e.stopPropagation()} // ❗ prevent closing inside
          >
            <h2 className="text-lg font-semibold mb-3">
              {type === "restock" ? "Restock Product" : "Sell Product"}
            </h2>

            <input
              type="number"
              placeholder="Enter quantity"
              className="border p-2 w-full mb-4"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                Submit
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white p-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

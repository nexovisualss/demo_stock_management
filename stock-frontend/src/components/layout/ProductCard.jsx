import { useState } from "react";
import axios from "axios";

export default function ProductCard({ product, refresh }) {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");

  const API = "http://localhost:5000/api";

  const handleSubmit = async () => {
    if (!qty) return;

    if (type === "restock") {
      await axios.put(`${API}/products/restock/${product._id}`, {
        quantity: qty,
      });
    } else {
      await axios.put(`${API}/products/sell/${product._id}`, {
        quantity: qty,
      });
    }

    setShowModal(false);
    setQty("");
    refresh();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <img
        src={`http://localhost:5000${product.images[0]}`}
        className="h-40 w-full object-cover rounded"
      />

      <h2 className="font-bold mt-2">{product.name}</h2>
      <p>GSM: {product.gsm}</p>
      <p>SKU: {product.sku}</p>

      <p className={`font-semibold ${product.stock === 0 ? "text-red-500" : ""}`}>
        {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-2">
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded">
            <h2 className="mb-2">
              {type === "restock" ? "Restock" : "Sell"} Product
            </h2>

            <input
              type="number"
              placeholder="Enter quantity"
              className="border p-2 w-full mb-2"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 w-full rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
//src/pages/Stock.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/layout/ProductCard";

export default function Stock() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // ✅ FETCH ALL PRODUCTS (ONLY ON LOAD)
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setAllProducts(res.data);
      setFilteredProducts(res.data); // 👈 show all initially
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // ✅ SEARCH + FILTER LOGIC (FRONTEND)
  useEffect(() => {
    let data = [...allProducts];

    // 🔍 SEARCH
    if (search.trim()) {
      const value = search.replace(/\s+/g, "").toLowerCase();

      data = data.filter((p) => {
        const combined = `
          ${p.name || ""}
          ${p.sku || ""}
          ${p.category || ""}
          ${p.subCategory || ""}
          ${p.gsm || ""}
        `
          .replace(/\s+/g, "")
          .toLowerCase();

        return combined.includes(value);
      });
    }

    // 🎯 CATEGORY FILTER
    if (category) {
      data = data.filter((p) => p.category === category);
    }

    // 🎯 SUBCATEGORY FILTER
    if (subCategory) {
      data = data.filter((p) => p.subCategory === subCategory);
    }

    setFilteredProducts(data);
  }, [search, category, subCategory, allProducts]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Stock</h1>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name, GSM, SKU..."
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* FILTER */}
        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
            <option value="T-shirt">T-shirt</option>
            <option value="Track">Track</option>
          </select>

          <select
            className="border p-2 rounded"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">All SubCategory</option>
            <option value="Cotton Shirt">Cotton Shirt</option>
            <option value="Normal Shirt">Normal Shirt</option>
            <option value="Jeans Pant">Jeans Pant</option>
            <option value="Cargo Pant">Cargo Pant</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              refresh={fetchAllProducts} // ✅ important
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
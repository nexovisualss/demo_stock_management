import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/layout/ProductCard"; // ✅ IMPORTANT

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const API = import.meta.env.VITE_API_URL; // ✅ FIXED

  // 🔍 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products/search`, {
        params: {
          search,
          category,
          subCategory,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, subCategory]);

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
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">All SubCategory</option>
            <option value="Cotton Shirt">Cotton Shirt</option>
            <option value="Jeans Pant">Jeans Pant</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      {/* PRODUCT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} refresh={fetchProducts} />
        ))}
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/layout/Layout";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const API = "http://localhost:5000/api";

  // 🔍 FETCH PRODUCTS
  const fetchProducts = async () => {
    const res = await axios.get(
      `${API}/products/search?search=${search}&category=${category}&subCategory=${subCategory}`
    );
    setProducts(res.data);
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
            <option value="Cotton">Cotton</option>
            <option value="Polyester">Polyester</option>
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">All SubCategory</option>
            <option value="Shirt">Shirt</option>
            <option value="Pant">Pant</option>
          </select>
        </div>
      </div>

      {/* PRODUCT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} refresh={fetchProducts} />
        ))}
      </div>
    </Layout>
  );
}
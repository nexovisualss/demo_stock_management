import Layout from "../components/layout/Layout";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios"; // ✅ added
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const navigate = useNavigate();

  // ✅ form state added
  const [form, setForm] = useState({
    name: "",
    gsm: "",
    sku: "",
    stock: "",
  });

  const [images, setImages] = useState([]); // ✅ multiple images

  const subCategories = {
    Shirt: [
      "Cotton Shirt",
      "Normal Shirt",
      "Full Hand Shirt",
      "Half Hand Shirt",
    ],
    "T-shirt": [
      "Oversized T-shirt",
      "Polo T-Shirt",
      "Round Neck T-Shirt",
      "Normal T-shirt",
    ],
    Pant: ["Cotton Pant", "Lycra Pant", "Jeans Pant", "Cargo Pant"],
    Track: ["Shorts", "Cotton Track", "Normal Track", "Elastic Track"],
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // ✅ handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ submit function
  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("gsm", form.gsm);
      data.append("sku", form.sku);
      data.append("stock", form.stock);
      data.append("category", category);
      data.append("subCategory", subCategory);

      // ✅ IMPORTANT
      images.forEach((img) => {
        data.append("images", img); // must match backend
      });

      await axios.post("http://localhost:5000/api/products", data);

      alert("Product Added ✅");
      navigate("/view-product");
    } catch (err) {
      console.log(err);
      alert("Error adding product");
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Add the Product Details
          </h2>

          {/* CATEGORY ROW */}
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            {/* MAIN CATEGORY */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Main Category
              </label>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory("");
                  }}
                  className="w-full p-3 pr-10 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select the main category</option>
                  <option>Shirt</option>
                  <option>T-shirt</option>
                  <option>Pant</option>
                  <option>Track</option>
                </select>

                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* SUB CATEGORY */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Sub Category
              </label>

              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select the sub category</option>
                  {category &&
                    subCategories[category]?.map((sub, i) => (
                      <option key={i}>{sub}</option>
                    ))}
                </select>

                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* NAME */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">
              Product Name
            </label>
            <input
              type="text"
              name="name" // ✅ added
              value={form.name} // ✅ added
              onChange={handleChange} // ✅ added
              placeholder="Enter product name..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* GSM + SKU */}
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block mb-2 text-sm font-medium">GSM</label>
              <input
                type="text"
                name="gsm"
                value={form.gsm}
                onChange={handleChange}
                placeholder="Enter GSM"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">SKU</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* STOCK */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Product Image
            </label>
            <input
              type="file"
              multiple // ✅ important
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100"
            >
              Back
            </button>

            <button
              onClick={handleSubmit} // ✅ added
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

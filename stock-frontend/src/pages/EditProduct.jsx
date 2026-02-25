//editProduct.jsx
import Layout from "../components/layout/Layout";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [preview, setPreview] = useState(""); // ✅ image preview
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    gsm: "",
    sku: "",
    stock: "",
    image: "",
  });

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

  // ✅ FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);

      setForm({
        name: res.data.name,
        gsm: res.data.gsm,
        sku: res.data.sku,
        stock: res.data.stock,
      });

      setCategory(res.data.category);
      setSubCategory(res.data.subCategory);

      setExistingImages(res.data.images || []);
    };

    fetchProduct();
  }, [id]);

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setPreviewImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = [...previewImages];
    updated.splice(index, 1);
    setPreviewImages(updated);
  };

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("gsm", form.gsm);
      data.append("sku", form.sku);
      data.append("stock", form.stock);
      data.append("category", category);
      data.append("subCategory", subCategory);

      data.append("existingImages", JSON.stringify(existingImages));

      previewImages.forEach((img) => {
        data.append("images", img); // keep same key (correct)
      });

      await axios.put(`http://localhost:5000/api/products/${id}`, data);

      alert("Updated ✅");
      navigate("/view-product");
      console.log("Existing:", existingImages);
      console.log("New:", previewImages);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Edit the Product Details
          </h2>

          {/* CATEGORY */}
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
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* GSM + SKU */}
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div>
              <label className="block mb-2 text-sm font-medium">GSM</label>
              <input
                name="gsm"
                value={form.gsm}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* ✅ IMAGE PREVIEW */}
          {preview && (
            <div className="relative w-32 h-32 mb-4">
              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-full border"
              />

              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* IMAGE INPUT */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Product Images
            </label>

            {/* EXISTING IMAGES */}
            <div className="flex gap-3 flex-wrap mb-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={`http://localhost:5000${img}`}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <button
                    onClick={() => removeExistingImage(i)}
                    className="absolute -top-2 -right-2 bg-white/70 backdrop-blur rounded-full w-6 h-6 flex items-center justify-center shadow"
                  >
                    <span className="text-black text-sm">✕</span>
                  </button>
                </div>
              ))}
            </div>

            {/* NEW IMAGES */}
            <div className="flex gap-3 flex-wrap mb-3">
              {previewImages.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 bg-white/70 backdrop-blur rounded-full w-6 h-6 flex items-center justify-center shadow"
                  >
                    <span className="text-black text-sm">✕</span>
                  </button>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <input
              type="file"
              multiple
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
              onClick={handleUpdate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Product
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

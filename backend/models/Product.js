//Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: String,
  subCategory: String,
  name: String,
  gsm: String,
  sku: String,
  stock: Number,
  images: [String],
});

export default mongoose.model("Product", productSchema);
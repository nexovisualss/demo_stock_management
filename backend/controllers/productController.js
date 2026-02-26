//productController.js
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const imagePaths = req.files
      ? req.files.map(file => file.path)
      : [];

    const product = new Product({
      ...req.body,
      images: imagePaths,
    });

    await product.save();
    res.json({ msg: "Product added", product });
  } catch (err) {
    res.status(500).json({ msg: "Error adding product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ msg: "Error fetching products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // ✅ parse existing images
    let existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    // ✅ new uploaded images
    const newImages = req.files
      ? req.files.map(file => file.path)
      : [];

    // ✅ FINAL LOGIC (IMPORTANT)
    if (newImages.length > 0) {
      // replace OR add new images
      updatedData.images = [...existingImages, ...newImages];
    } else {
      // only keep existing images (after delete)
      updatedData.images = existingImages;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({ msg: "Updated", product });
  } catch (err) {
    res.status(500).json({ msg: "Error updating product" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching product" });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { search = "", category = "", subCategory = "" } = req.query;

    let query = {};

    // ✅ SEARCH ONLY IF VALUE EXISTS
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { gsm: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ FILTER ONLY IF EXISTS
    if (category) {
      query.category = category;
    }

    if (subCategory) {
      query.subCategory = subCategory;
    }

    console.log("QUERY:", query); // 🔍 DEBUG

    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    console.error("SEARCH ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ msg: "Search failed", error: err.message });
  }
};


// ➕ RESTOCK PRODUCT
export const restockProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (Number(quantity) <= 0) {
      return res.status(400).json({ msg: "Invalid quantity" });
    }

    product.stock += Number(quantity);

    await product.save();

    res.json({ msg: "Stock increased", product });
  } catch (err) {
    res.status(500).json({ msg: "Restock failed" });
  }
};

// ➖ SELL PRODUCT
export const sellProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (Number(quantity) <= 0) {
      return res.status(400).json({ msg: "Invalid quantity" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Not enough stock" });
    }

    product.stock -= Number(quantity);

    await product.save();

    res.json({ msg: "Stock reduced", product });
  } catch {
    res.status(500).json({ msg: "Sell failed" });
  }
};
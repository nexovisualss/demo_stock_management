import express from "express";   // ✅ ADD THIS LINE

import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// routes
router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);
router.delete("/products/:id", deleteProduct);
router.post("/products", upload.array("images", 5), addProduct);
router.put("/products/:id", upload.array("images", 5), updateProduct);

export default router;
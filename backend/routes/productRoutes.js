import express from "express";   // ✅ ADD THIS LINE

import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  searchProducts,
  restockProduct,
  sellProduct
} from "../controllers/productController.js";

import { upload } from "../middleware/upload.js";
import { getDashboardData } from "../controllers/productController.js";

const router = express.Router();

// routes
router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);
router.delete("/products/:id", deleteProduct);
router.post("/products", upload.array("images", 5), addProduct);
router.put("/products/:id", upload.array("images", 5), updateProduct);
import { generateHistory } from "../controllers/productController.js";

// 🔍 SEARCH + FILTER
router.get("/products/search", searchProducts);

// ➕ RESTOCK
router.put("/products/restock/:id", restockProduct);

// ➖ SELL
router.put("/products/sell/:id", sellProduct);

router.get("/dashboard", getDashboardData);

router.get("/products/generate-history", generateHistory);

export default router;
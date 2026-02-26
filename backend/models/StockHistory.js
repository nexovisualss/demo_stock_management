import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    type: {
      type: String, // "IN" or "OUT"
      required: true,
    },
    quantity: Number,
    category: String,
    subCategory: String,
  },
  { timestamps: true } // 🔥 IMPORTANT
);

export default mongoose.model("StockHistory", stockHistorySchema);
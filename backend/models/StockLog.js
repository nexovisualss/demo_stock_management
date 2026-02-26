import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  type: {
    type: String, // IN or OUT
  },
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("StockLog", stockLogSchema);
// controllers/dashboardController.js
import StockHistory from "../models/StockHistory.js";
import Product from "../models/Product.js";

export const getDashboard = async (req, res) => {
  try {
    const { filter = "today" } = req.query;

    let startDate = new Date();

    if (filter === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "month") {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else if (filter === "year") {
      startDate = new Date(startDate.getFullYear(), 0, 1);
    } else {
      startDate = new Date(0);
    }

    // ✅ USE CORRECT MODEL
    const history = await StockHistory.find({
      createdAt: { $gte: startDate },
    });

    let stockIn = 0;
    let stockOut = 0;

    const graphMap = {};
    const productSales = {};

    history.forEach((h) => {
      const date = new Date(h.createdAt).toLocaleDateString("en-GB");

      if (!graphMap[date]) {
        graphMap[date] = { date, in: 0, out: 0 };
      }

      if (h.type === "IN") {
        stockIn += h.quantity;
        graphMap[date].in += h.quantity;
      } else {
        stockOut += h.quantity;
        graphMap[date].out += h.quantity;

        productSales[h.productId] =
          (productSales[h.productId] || 0) + h.quantity;
      }
    });

    const graphData = Object.values(graphMap);

    // ✅ TOTAL STOCK
    const totalStockAgg = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);

    const totalStock = totalStockAgg[0]?.total || 0;

    // ✅ CATEGORY STATS
    const categoryStatsAgg = await Product.aggregate([
      { $group: { _id: "$category", total: { $sum: "$stock" } } },
    ]);

    const categoryStats = {};
    categoryStatsAgg.forEach((c) => {
      categoryStats[c._id] = c.total;
    });

    // ✅ LOW STOCK
    const lowStock = await Product.find({ stock: { $lte: 10 } })
      .select("name stock category");

    res.json({
      stockIn,
      stockOut,
      totalStock,
      categoryStats,
      graphData,
      lowStock,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Dashboard error" });
  }
};
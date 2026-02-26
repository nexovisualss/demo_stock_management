// controllers/dashboardController.js
import StockHistory from "../models/StockHistory.js";
import Product from "../models/Product.js";

export const getDashboard = async (req, res) => {
  try {
    const { filter } = req.query;

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

    const history = await StockHistory.find({
      createdAt: { $gte: startDate },
    });

    let stockIn = 0;
    let stockOut = 0;

    const graphMap = {};

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
      }
    });

    const graphData = Object.values(graphMap);

    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: "$stock" } } },
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$stock" },
        },
      },
    ]);

    const categoryObj = {};
    categoryStats.forEach((c) => {
      categoryObj[c._id] = c.total;
    });

    res.json({
      stockIn,
      stockOut,
      totalStock: totalStock[0]?.total || 0,
      categoryStats: categoryObj,
      graphData, // ✅ IMPORTANT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Dashboard error" });
  }
};
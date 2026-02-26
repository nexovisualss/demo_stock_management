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

    history.forEach((h) => {
      if (h.type === "IN") stockIn += h.quantity;
      else stockOut += h.quantity;
    });

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
    });
  } catch (err) {
    res.status(500).json({ msg: "Dashboard error" });
  }
};
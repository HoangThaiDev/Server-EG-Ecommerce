// Import Models
const Category = require("../model/category");

// Create Controllers Action
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

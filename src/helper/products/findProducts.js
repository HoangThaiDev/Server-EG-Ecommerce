// Import Models
const Product = require("../../model/product");

// Create Function
exports.findProductByName = async (valueName) => {
  const valueNameSearch = valueName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

  try {
    const products = await Product.find().populate("categoryId", "title -_id");
    const findProductsByName = products.filter((p) =>
      p.name.toLowerCase().includes(valueNameSearch)
    );
    if (findProductsByName.length === 0) return [];

    return findProductsByName;
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.findProductByCategory = async (res, valueId) => {
  try {
    const products = await Product.find({ categoryId: valueId }).populate(
      "categoryId",
      "title -_id"
    );

    if (products.length === 0) {
      res
        .status(400)
        .json({ message: "No found products with your value search!" });
      return false;
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

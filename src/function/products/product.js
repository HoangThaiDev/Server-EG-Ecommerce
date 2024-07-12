// Import Models
const Product = require("../../model/product");

// Create Function
exports.findProductByName = async (res, valueName) => {
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
    if (findProductsByName.length === 0) {
      res
        .status(400)
        .json({ message: "No found products with your value search!" });
      return false;
    }

    res.status(200).json(findProductsByName);
  } catch (error) {
    console.log(">>> Error of action (search Products By Name):", error);
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
    console.log(">>> Error of action (search Products By Category):", error);
  }
};

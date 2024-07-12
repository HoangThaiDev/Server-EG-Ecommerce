// Import Models
const Product = require("../model/product");

// Import Functions
const functProducts = require("../function/products/product");

// Create Controllers Action
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId", "title -_id");

    res.status(200).json(products);
  } catch (error) {
    console.log(">>> Error of action (get Products):", error);
  }
};

exports.postGetProductDetail = async (req, res) => {
  const { productId } = req.params;
  try {
    const productById = await Product.findById(productId).populate(
      "categoryId",
      "title -_id"
    );

    if (!productById) {
      res.status(400).json({ message: "This product is defective!" });
      return false;
    }

    res.status(200).json(productById);
  } catch (error) {
    console.log(">>> Error of action (getProduct Detail):", error);
  }
};

exports.postSearchProductByOptions = async (req, res) => {
  const valueSearchObj = req.query;
  const optionSearch = Object.keys(valueSearchObj)[0];

  switch (optionSearch) {
    case "name":
      functProducts.findProductByName(res, valueSearchObj.name);
      break;
    case "category":
      functProducts.findProductByCategory(res, valueSearchObj.category);
      break;
    default:
      res
        .status(400)
        .json({ message: "No found products with your value search!" });
      break;
  }
};

// Import Models
const Product = require("../model/product");

// Import Functions
const functProducts = require("../helper/products/findProducts");
const { pagination } = require("../helper/products/pagination");
const {
  filterProductsByCategory,
  filterProductsBySort,
  filterProductsByRate,
  filterProductsByPrice,
  filterProductsByTags,
} = require("../helper/products/filterProduct");

// Create Controllers Action
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "title -_id")
      .lean();

    // Calculate price discount when product have sale off
    const updateProducts = products.map((product) => {
      const priceNumber = parseFloat(product.price);
      if (product.percent_discount > 0) {
        product.price_discount = (
          priceNumber -
          (priceNumber * product.percent_discount) / 100
        ).toFixed(2);
        return product;
      }
      return product;
    });

    res.status(200).json(updateProducts);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getProductDetail = async (req, res) => {
  const { productId } = req.params;

  try {
    const productById = await Product.findById(productId).populate(
      "categoryId",
      "title -_id"
    );

    if (!productById) {
      return res.status(400).json({ message: "This product is defective!" });
    }

    res.status(200).json(productById);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.getProductsByQueries = async (req, res) => {
  // Get value queries from req.query
  const {
    name: nameValue,
    page: pageValue = 1,
    category: valueCategory,
    sort: valueSort,
    star: valueRate,
    price_min,
    price_max,
    tags,
  } = req.query;

  // Create + use vars
  const pageSize = 12;
  let productsUpdate;

  try {
    // Check client has searched or not
    if (nameValue && nameValue.length > 0) {
      const searchProductsByName = await functProducts.findProductByName(
        nameValue
      );

      if (searchProductsByName.length === 0)
        return res.status(400).json({
          message: 'No found product with your "value name" search!',
        });

      productsUpdate = searchProductsByName;
    } else {
      const products = await Product.find().populate("categoryId", "-_id");
      productsUpdate = products;
    }

    // Start to filter by query (if have)
    // --------------- Query: Sort --------------------
    productsUpdate = filterProductsBySort(productsUpdate, valueSort);

    // --------------- Query: Category ----------------
    productsUpdate = filterProductsByCategory(productsUpdate, valueCategory);

    // --------------- Query: Rate --------------------
    productsUpdate = filterProductsByRate(productsUpdate, valueRate);

    // --------------- Query: Price -------------------
    productsUpdate = filterProductsByPrice(
      productsUpdate,
      +price_min,
      +price_max
    );

    // --------------- Query: Tag ---------------------
    productsUpdate = filterProductsByTags(productsUpdate, tags);

    // Get products by page with Pagesize
    const sliceProducts = pagination(productsUpdate, pageValue, pageSize);

    res.status(200).json({ totalProducts: productsUpdate, sliceProducts });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

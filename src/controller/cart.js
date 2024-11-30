// Import Modules
const Cart = require("../model/cart");

exports.postAddToCart = async (req, res) => {
  const product = req.body;
  const userId = req.user;

  try {
    // Find cart of client current
    const cartOfClient = await Cart.findOne({ userId: userId });

    if (!cartOfClient) {
      return res.status(400).json({ message: "No found your cart!" });
    }

    // Check quantity item was existed in cart > 20 or not
    const result = cartOfClient.chechItemExistCart(product);

    if (!result) {
      return res
        .status(400)
        .json({ message: "Quantity item was overlimited in cart!" });
    }

    const isSuccess = await cartOfClient.addToCart(product);

    if (!isSuccess) {
      return res.status(400).json({ message: "Add to cart failled!" });
    }

    // Get cart from database
    const cartCurrent = await Cart.findOne({ userId: userId }).populate(
      "cart_detail.items.itemId"
    );
    const modifiedCart = await cartCurrent.updateCart(cartCurrent.cart_detail);

    res.status(200).json({ cart: modifiedCart });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

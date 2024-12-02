// Import Modules
const Cart = require("../model/cart");

// Import Func Helpers
const { getCart } = require("../helper/cart/getCart");

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
    const newCart = await getCart(userId);

    res.status(200).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user;

  try {
    const findCart = await Cart.findOne({ userId: userId }).populate(
      "cart_detail.items.itemId"
    );

    // Filter product that client select delete
    const newItems = findCart.cart_detail.items.filter(
      (item) => item.itemId._id.toString() !== productId
    );

    // Calculate total price of cart
    const newTotalPriceCart = newItems.reduce(
      (acc, cur) => (parseFloat(acc) + parseFloat(cur.totalPrice)).toFixed(2),
      0
    );

    // Save value cart after update in database
    findCart.cart_detail.items = newItems;
    findCart.cart_detail.totalPriceCart = newTotalPriceCart;

    const cartAfterDelete = await findCart.save();

    if (!cartAfterDelete) {
      return res.status(400).json({ message: "Delete product failled!" });
    }

    // Get cart from database
    const newCart = await getCart(userId);

    res.status(200).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.deleteProductsFromCart = async (req, res) => {
  const selectedItemIds = req.body;

  try {
    const findCart = await Cart.findOne({ userId: req.user });
    const { cart_detail } = findCart;

    const filteredCartItems = cart_detail.items.filter((item) => {
      const isExist = selectedItemIds.some(
        (selecteditem) => selecteditem.itemId === item.itemId.toString()
      );

      if (!isExist) {
        return item;
      }
    });

    // Calculate total price of cart
    const newTotalPriceCart = filteredCartItems.reduce(
      (acc, cur) => (parseFloat(acc) + parseFloat(cur.totalPrice)).toFixed(2),
      0
    );

    // Update value cart of client
    findCart.cart_detail.items = filteredCartItems;
    findCart.cart_detail.totalPriceCart = newTotalPriceCart;

    const result = await findCart.save();

    if (!result) {
      return res.status(400).json({ message: "Delete items failled!" });
    }

    const cart = await getCart(req.user);
    res.status(200).json({ cart });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

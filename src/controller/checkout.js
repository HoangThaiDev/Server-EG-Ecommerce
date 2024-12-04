// Import Models
const Checkout = require("../model/checkout");
const Product = require("../model/product");
const Order = require("../model/order");
const Cart = require("../model/cart");

// Import Func Helpers
const { getCart } = require("../helper/cart/getCart");

exports.getCheckout = async (req, res) => {
  const userId = req.user;

  try {
    const findCheckout = await Checkout.findOne({
      userId: userId,
      method_payment: "",
    });
    const products = await Product.find();

    if (!findCheckout) {
      return res.status(400).json({ message: "Get your cart failled!!" });
    }

    const mofiedCartItems = findCheckout.cart.items.map((item) => {
      products.forEach((product) => {
        if (item.itemId === product._id.toString()) {
          item.itemId = product;
        }
      });
      return item;
    });

    findCheckout.cart.items = mofiedCartItems;

    res.status(200).json({ cart: findCheckout.cart });
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postCreateCheckout = async (req, res) => {
  const { items, totalPriceCart } = req.body;
  const userId = req.user;

  try {
    const findCheckout = await Checkout.findOne({ userId: userId });
    const findCart = await Cart.findOne({ userId: userId });

    // // Check client was had checkout or not
    if (findCheckout && findCheckout.method_payment === "") {
      findCheckout.cart.items = items;
      findCheckout.cart.totalPriceCart = totalPriceCart;
      const result = await findCheckout.save();

      if (!result) {
        return res
          .status(400)
          .json({ message: "Create new checkout failled!" });
      }
    } else {
      const newCheckout = new Checkout({
        userId: userId,
        cart: { items: items, totalPriceCart: totalPriceCart },
      });

      const result = await newCheckout.save();

      if (!result) {
        return res
          .status(400)
          .json({ message: "Create new checkout failled!" });
      }
    }

    // Update cart of client
    const updateCartItems = findCart.cart_detail.items.map((cartItem) => {
      items.forEach((item) => {
        if (cartItem.itemId.toString() === item.itemId) {
          cartItem.quantity_item = item.quantity_item;
          cartItem.totalPrice = item.totalPrice;
        }
      });
      return cartItem;
    });

    findCart.cart_detail.items = updateCartItems;
    findCart.cart_detail.totalPriceCart = totalPriceCart;

    const isSaveCart = await findCart.save();

    if (!isSaveCart) {
      return res.status(400).json({ message: "Update cart failled!" });
    }
    // Get value cart
    const cartCurrent = await getCart(userId);
    res.status(200).json(cartCurrent);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

exports.postUpdateInfoClientOfCheckout = async (req, res) => {
  const valuesForm = req.body;
  const userId = req.user;

  try {
    const findCheckout = await Checkout.findOne({
      userId: userId,
      method_payment: "",
    });
    const findCart = await Cart.findOne({ userId: userId });

    if (!findCheckout) {
      // return res.status(400).json({message:'Your checkout failled!'})
      return res.status(400).json({ message: "No found your checkout!" });
    }

    // Update value client of checkout
    findCheckout.info_client.firstName = valuesForm.firstname;
    findCheckout.info_client.lastName = valuesForm.lastname;
    findCheckout.info_client.address = valuesForm.address;
    findCheckout.info_client.phoneNumber = valuesForm.phone;
    findCheckout.info_client.email = valuesForm.email;
    findCheckout.info_client.city = valuesForm.province.name;
    findCheckout.info_client.district = valuesForm.district.name;
    findCheckout.info_client.commune = valuesForm.commune.name;
    findCheckout.info_client.note = valuesForm.note;
    findCheckout.method_payment = valuesForm.method;

    const isSaveCheckout = await findCheckout.save();

    if (!isSaveCheckout) {
      return res.status(400).json({ message: "Your checkout failled!" });
    }

    // Update cart if cart have items or not
    const selectedItemIds = findCheckout.cart.items.flatMap(
      (item) => item.itemId
    );

    const filterCartItems = findCart.cart_detail.items.filter(
      (item) => !selectedItemIds.includes(item.itemId.toString())
    );

    const sumTotalPriceCart = filterCartItems.reduce(
      (cur, acc) => (parseFloat(cur) + parseFloat(acc.totalPrice)).toFixed(2),
      0
    );

    findCart.cart_detail.items = filterCartItems;
    findCart.cart_detail.totalPriceCart = sumTotalPriceCart;

    const isSaveCart = await findCart.save();

    if (!isSaveCart) {
      return res.status(400).json({ message: "Update yor cart failled!" });
    }

    // Create new order when place order success
    const newOrder = new Order({
      checkoutId: findCheckout._id,
      userId: userId,
    });

    const isSaveOrder = await newOrder.save();

    if (!isSaveOrder) {
      return res.status(400).json({ message: "Create new order failled!" });
    }

    // Update value quantity of product when checkout success
    for (const item of findCheckout.cart.items) {
      const product = await Product.findOne({ _id: item.itemId });

      if (product) {
        // Decrease product quantity by the amount in the cart
        const newQuantity = product.quantity - item.quantity_item;

        // Update the product quantity in the database
        await Product.updateOne(
          { _id: item.itemId },
          { $set: { quantity: newQuantity } }
        );
      }
    }

    // Get cart when checkout success
    const newCart = await getCart(userId);

    res.status(200).json({ newCart });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Interval Server Error!" });
  }
};

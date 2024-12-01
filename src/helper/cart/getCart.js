// Import Model
const Cart = require("../../model/cart");

exports.getCart = async (userId) => {
  const { cart_detail } = await Cart.findOne({ userId: userId })
    .populate("cart_detail.items.itemId")
    .lean();

  // Calculate price discount when product have sale off
  const updateItems = cart_detail.items.map((item) => {
    const priceNumber = parseFloat(item.itemId.price);
    if (item.itemId.percent_discount > 0) {
      item.itemId.price_discount = (
        priceNumber -
        (priceNumber * item.itemId.percent_discount) / 100
      ).toFixed(2);
      return item;
    }
    return item;
  });

  cart_detail.items = updateItems;
  return cart_detail;
};

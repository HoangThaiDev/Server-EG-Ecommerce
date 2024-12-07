// Import Models
const Order = require("../model/order");

exports.getOrder = async (req, res) => {
  const userId = req.user;

  try {
    const orders = await Order.find().populate("checkoutId", "cart");

    const findOrdersByUser = orders.filter(
      (order) => order.userId.toString() === userId
    );

    res.status(200).json(findOrdersByUser);
  } catch (error) {
    res.status(500).json({ message: "Interval Server Error!" });
  }
};

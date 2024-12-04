// Import Modules
const { Schema, default: mongoose } = require("mongoose");

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    cart_detail: {
      items: [
        {
          itemId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "product",
          },
          quantity_item: {
            type: Number,
            required: true,
          },
          totalPrice: {
            type: String,
            required: true,
          },
        },
      ],
      totalPriceCart: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Create + use method
cartSchema.methods.updateCart = async function (params) {};

cartSchema.methods.addToCart = async function (product) {
  const cloneCart = {
    items: this.cart_detail.items,
    totalPriceCart: this.cart_detail.totalPriceCart,
  };

  // Find index item in cart
  const findIndexItem = cloneCart.items.findIndex(
    (item) => item.itemId.toString() === product._id
  );

  if (findIndexItem === -1) {
    const newItem = {
      itemId: product._id,
      quantity_item: product.quantity,
      totalPrice: (parseFloat(product.totalPrice) * product.quantity).toFixed(
        2
      ),
    };
    cloneCart.items.push(newItem);
  }

  if (findIndexItem !== -1) {
    const cloneItem = cloneCart.items[findIndexItem];
    cloneItem.quantity_item += product.quantity;

    // Check this product has percent_discount or not

    cloneItem.totalPrice = (
      parseFloat(cloneItem.totalPrice) + parseFloat(product.totalPrice)
    ).toFixed(2);
  }

  // Calculate total price of cart
  cloneCart.totalPriceCart = cloneCart.items.reduce(
    (acc, cur) => (parseFloat(acc) + parseFloat(cur.totalPrice)).toFixed(2),
    0
  );

  // Update data in database
  this.cart_detail = cloneCart;

  return await this.save();
};

module.exports = mongoose.model("cart", cartSchema);

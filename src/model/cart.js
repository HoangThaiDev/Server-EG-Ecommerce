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
cartSchema.methods.chechItemExistCart = function (product) {
  const { cart_detail } = this;

  // Check cart have items or not
  if (cart_detail.items.length === 0) {
    return true;
  }

  // Find index item in cart
  const findIndexItem = cart_detail.items.findIndex(
    (item) => item.itemId.toString() === product._id
  );

  if (findIndexItem !== -1) {
    const item = cart_detail.items[findIndexItem];
    const isQuantityAtLimit = item.quantity_item <= 20;
    return isQuantityAtLimit;
  }

  return true;
};

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
      totalPrice: (parseFloat(product.price) * product.quantity).toFixed(2),
    };
    cloneCart.items.push(newItem);
  }

  if (findIndexItem !== -1) {
    const cloneItem = cloneCart.items[findIndexItem];
    cloneItem.quantity_item += product.quantity;

    cloneItem.totalPrice = (
      parseFloat(cloneItem.totalPrice) + parseFloat(product.price)
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

cartSchema.methods.updateCart = async function (cart) {
  // Calculate price discount when product have sale off
  const updateItems = cart.items.map((item) => {
    const priceNumber = parseFloat(item.price);
    if (item.percent_discount > 0) {
      item.price_discount = (
        priceNumber -
        (priceNumber * item.percent_discount) / 100
      ).toFixed(2);
      return item;
    }
    return item;
  });
  cart.items = updateItems;
  return cart;
};

module.exports = mongoose.model("cart", cartSchema);

exports.filterProductsByCategory = (products, typeCategory) => {
  if (typeCategory)
    return products.filter(
      (product) => product.categoryId.title === typeCategory
    );

  return products;
};

exports.filterProductsBySort = (products, typeSort) => {
  if (typeSort) {
    const regex = /^(\w+)-(.+)$/; // Detach query filter to get: type + value
    const match = typeSort.match(regex);
    const optionObj = { type: match[1], value: match[2] };
    // Check type then use value to filter products
    switch (optionObj.type) {
      //----------------------------Sort: Name -------------------------------------------
      case "name":
        if (optionObj.value === "a-z") {
          products = products.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          products = products.sort((a, b) => b.name.localeCompare(a.name));
        }
        break;

      //----------------------------Sort: Price -------------------------------------------
      case "price":
        if (optionObj.value === "asc") {
          products = products.sort((a, b) => a.price - b.price);
        } else {
          products = products.sort((a, b) => b.price - a.price);
        }
        break;

      //----------------------------Sort: Sale -------------------------------------------
      case "sale":
        products = products.filter((product) => product.percent_discount > 0);
        break;

      //----------------------------Sort: Best-Seller -------------------------------------------
      case "bestSeller":
        products = products.filter((product) => product.best_seller === true);
        break;

      //----------------------------Sort: Default -------------------------------------------
      default:
        return products;
    }
  }

  return products;
};

exports.filterProductsByRate = (products, typeRate) => {
  if (typeRate) {
    const value = typeRate;
    return products.filter((product) => product.rating === +value);
  }

  return products;
};

exports.filterProductsByPrice = (products, price_min, price_max) => {
  if (price_min && price_max && price_min !== price_max) {
    return products.filter((product) => {
      const newPrice =
        product.percent_discount > 0
          ? +product.price - (+product.price * product.percent_discount) / 100
          : +product.price;

      if (price_min <= newPrice && newPrice <= price_max) {
        return product;
      }
    });
  }
  return products;
};

exports.filterProductsByTags = (products, tags) => {
  if (tags) {
    const modifyTags = tags.split(",");
    return products.filter((product) =>
      product.tags.some((tag) => modifyTags.includes(tag))
    );
  }

  return products;
};

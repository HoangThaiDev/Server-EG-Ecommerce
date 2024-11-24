exports.pagination = (products, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const sliceProducts = products.slice(startIndex, endIndex);
  return sliceProducts;
};

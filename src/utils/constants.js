/** Những domain được phép truy cập tới tài nguyên của server ở môi trường production*/
exports.WHITELIST_DOMAINS_PRODUCTION = [
  "https://eg-grocery.vercel.app",
  "http://localhost:3000",
];

/** Những domain được phép truy cập tới tài nguyên của server ở môi trường dev*/
exports.WHITELIST_DOMAINS_DEV = ["http://localhost:3000"];

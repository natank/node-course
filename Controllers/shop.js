const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  res.render('./shop/index.ejs', {
    pageTitle: "Home",
    path: '/'
  });
}

exports.getOrders = (req, res) => {
  res.render('./shop/orders', {
    pageTitle: "Your Orders",
    path: "/cart"
  })
}


exports.getProducts = async (req, res, next) => {
  let prods = await Product.fetchAll();
  res.render('./shop/product-list', {
    prods: prods,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: prods.length > 0,
    activeShop: true,
    productCSS: true
  });
}
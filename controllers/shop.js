const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (err) {
    console.log(err);
  }

};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  let product;
  try {
    product = await Product.findByPk(prodId)
    if (product) {
      let title = product.title
      res.render('shop/product-detail', {
        product: product,
        pageTitle: title,
        path: '/products'
      });
    }
  } catch (err) {
    console.log(err);
  }

};

exports.getIndex = async (req, res, next) => {
  let products
  try {
    products = await Product.findAll();
  } catch (err) {
    console.log(err);
  }
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
};

exports.getCart = async (req, res, next) => {
  let cart, cartProducts;
  try {
    cart = await req.user.getCart();
  } catch (err) {
    console.log(err);
  }
  try {
    products = await cart.getProducts();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cartProducts: cartProducts
    });
  } catch (err) {
    console.log(err)
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
const getDb = require('../util/database').getDb;
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
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
  try {
    const product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    let products = await req.user.cart;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = req.user;
  let userId = req.user._id;
  try {
    // is product in cart?
    let item = user.cart.find(item => item.productId.toString() == prodId.toString());

    // product in cart - increase quantity
    if (item) {
      item.quantity += 1;
    } else {
      // product not in cart - add product to cart (quantity 1)
      user.cart.push({
        productId: prodId,
        quantity: 1
      });
    }
    await user.save();
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = req.user;
  user.cart = user.cart.filter(item => {
    let removeThisItem = item.productId.toString() !== prodId;
    return removeThisItem;
  });
  try {
    await user.save();
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await req.user.getOrders();
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  } catch (err) {
    console.log(err);
  }
};
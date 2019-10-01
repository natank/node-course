const getDb = require('../util/database').getDb;
const Product = require('../models/product');
const User = require('../models/user').User;
const CartItem = require('../models/user').CartItem;

const mongoose = require('mongoose');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.find().populate('userId');

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
    let user = await req.user.populate({
      path: 'cart.item.product',
    }).execPopulate();

    let uiCart = user.cart.map(elem => {
      let cartItem = {
        product: elem.item.product,
        quantity: elem.item.quantity
      }
      return cartItem;
    });
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart: uiCart
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    let result = await req.user.addToCart(product);
    // console.log(result);
    res.redirect('/cart');
  } catch (err) {
    console.log(err)
  }

};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = req.user //await User.findOne();
  user.cart = user.cart.filter(item => {
    let removeThisItem = item.product._id.toString() !== prodId;
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
    let uiOrders = orders.map(elem => {
      let order = {}
      order._id = elem._id;
      order.items = elem.order.map(item => {
        let prod = {
          title: item.item.product.title,
          quantity: item.item.quantity
        }
        return prod
      });
      return order;

    })

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: uiOrders
    });
  } catch (err) {
    console.log(err);
  }
};
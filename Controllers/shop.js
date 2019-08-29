const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.fetchAll()
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
  let product = await Product.findById(prodId);
  if(product){
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }  
};

exports.getIndex = async (req, res, next) => {
  let products;
  try {
    products = await Product.fetchAll()
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    })
  } catch (err) {
    console.log(error)
  }

};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.postCart = async (req, res, next) => {
  let product;
  let {
    productId
  } = {
    ...req.body
  }
  try {
    product = await Product.findById(productId)
    await Cart.addProduct(productId, product.price);
  } catch (err) {
    console.log(err)
  }
  res.status(204).send();
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
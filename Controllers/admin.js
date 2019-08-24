const Product = require('../models/product');
const path = require('path');
exports.getAddProduct = (req, res, next) => {
  res.render('./admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
}

exports.postAddProduct = (req, res, next) => {
  let {
    title,
    price,
    image: imgUrl,
    description
  } = {
    ...req.body
  }
  imgUrl = path.join("\images", imgUrl)

  let prod = new Product({
    title,
    price,
    imgUrl,
    description
  });
  prod.save();
  res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
  res.render('./admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/products'
  })
}

exports.getProducts = async (req, res, next) => {
  let prods = await Product.fetchAll();
  res.render('./admin/products', {
    pageTitle: 'Admin Products',
    path: '/admin/products',
    prods: prods
  })
}
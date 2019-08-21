const Product = require('../models/product');

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
  let prod = new Product(req.body.title);
  prod.save();
  res.redirect('/');
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

exports.getEditProduct = (req,res,next)=>{
  res.render('./admin/edit-products',{pageTitle: 'Edit Product', path: '/products'})
}

exports.getAdminProducts = (req, res, next)=>{
  res.render('./admin/products',{pageTitle: 'Admin Products', path: '/admin/products'})
}
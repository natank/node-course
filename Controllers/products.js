
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
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

  exports.getProducts = (req, res, next) => {
    let p1 = Product.fetchAll();
    p1.then((prods)=>{
        res.render('shop', {
            prods: prods,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: prods.length > 0,
            activeShop: true,
            productCSS: true
          });
    })
    
  }
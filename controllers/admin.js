const Product = require('../models/product');

const {
  validationResult
} = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: '',
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId
  });


  if (errors.isEmpty()) {
    doAddProduct()
  } else {
    handleErrors()
  }

  function handleErrors() {
    res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      editing: true,
      product: product,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  async function doAddProduct() {
    try {
      await product.save()
      res.redirect('/admin/products');
    } catch (err) {
      console.log(err);
    };
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: '',
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = {
    title,
    imageUrl,
    price,
    description,
    _id: prodId
  }
  if (errors.isEmpty()) {
    doUpdateProduct()
  } else {
    handleErrors()
  }

  function handleErrors() {
    res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Edit Product',
      editing: true,
      product: product,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  async function doUpdateProduct() {
    try {
      await Product.update({
        "_id": prodId,
        "userId": req.user._id
      }, {
        title,
        price,
        description,
        imageUrl
      })
      res.redirect('/admin/products');
    } catch (err) {
      console.log(err);
    };
  }
};





exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      userId: req.user._id
    });
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    let result = await Product.deleteOne({
      _id: prodId,
      userId: req.user._id
    })
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err)
  };
};
const Product = require('../models/product');
const paginationControl = require('./paginationControl');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: '',
    validationErrors: [],
  });
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
        validationErrors: [],
      });
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      return next(error)
    });
};


exports.getProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find({
      userId: req.user._id
    });

    const paginationProps = paginationControl.paginationProps(
      allProducts,
      req.query.pageToLoad,
      req.query.dir,
      req.query.firstLink,
      req.query.lastLink
    )

    const {
      arrPageItems,
      pageToLoad,
      prevPage,
      nextPage,
      totalNumOfPages,
      firstLink,
      lastLink
    } = paginationProps;

    res.render('admin/products', {
      prods: arrPageItems,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      paginationProps: {
        pageToLoad: pageToLoad,
        prevPage: prevPage,
        nextPage: nextPage,
        totalNumOfPages: totalNumOfPages,
        firstLink,
        lastLink
      }
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};
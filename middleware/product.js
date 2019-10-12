const Product = require('../models/product');

const {
  validationResult
} = require('express-validator')

let middleware = {
  handleErrors: (req, res, next) => {
    req.errors = validationResult(req)
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    req.product = new Product({
      title,
      price,
      description
    });

    if (req.errors && req.errors.length) {
      console.log('\errorrs occured\n')
      res.status(422).render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: true,
        product: req.product,
        errorMessage: req.errors[0].msg,
        validationErrors: req.errors
      });
    } else {
      next()
    }
  },
  doAddProduct: (req, res, next) => {
    req.product.userId = req.user._id;
    if (req.image) {
      req.product.imageUrl = req.image;
      next();
    } else {
      err = new Error("image not defined");
      next(err);
    }
  },
  async doSaveNewProduct(req, res, next) {
    if (req.errors && req.errors.length) {
      res.status(422).render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: true,
        product: req.product,
        errorMessage: req.errors[0].msg,
        validationErrors: req.errors
      });
    } else {
      try {
        await req.product.save()
        res.redirect('/admin/products');
      } catch (err) {
        err.httpStatusCode = 500;
        let error = new Error(err);
        return next(error)
      }
    }
  },
  doUpdateProduct: (req, res, next) => {
    req.product._id = req.body.productId;
    if (req.image) {
      req.product.imageUrl = req.image;
    } else {
      req.product.imageURl = null
    }
    next()
  },

  doSaveUpdatedProduct: async (req, res, next) => {
    try {
      await Product.update({
        "_id": req.product._id,
        "userId": req.user._id
      }, {
        title,
        price,
        description,
        imageUrl
      } = req.product)
    } catch (err) {
      const error = new Error(err)
      error.httpStatusCode = 500;
      next(error)
    }
    res.redirect('/admin/products');
  }
}



module.exports = middleware;
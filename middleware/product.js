const Product = require('../models/product');
const fs = require('fs');

const {
  validationResult
} = require('express-validator')

let middleware = {
  getErrors: (req, res, next) => {
    req.errors = validationResult(req).errors;
    next();
  },
  addNewProduct: (req, res, next) => {
    // contract: req.errors
    req.product = {
      userId: req.user._id,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description
    }

    if (req.errors && req.errors.length) return next()
    if (req.image) {
      req.product.imageUrl = req.image;
    } else {
      err = new Error("image not defined");
      return next(err);
    }
    return next()
  },
  saveNewProduct: async (req, res, next) => {
    // contract: req.product: {title(string), description(string), 
    // price(number), userId(objectId)}.

    if (req.errors && req.errors.length) return next()

    let product = new Product({
      ...req.product
    })
    try {
      await product.save()
      return next()
    } catch (err) {
      err.httpStatusCode = 500;
      let error = new Error(err);
      return next(error)
    }
  },
  finalizeAddProduct: (req, res, next) => {
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
      res.redirect('/admin/products');
    }
  },
  doUpdateProduct: async (req, res, next) => {
    // middleware contract: 
    // req.body.productId: string

    req.product = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description
    }

    req.prodId = req.body.productId;
    if (req.errors && req.errors.length) return next()

    if (req.image) {
      // there is a new image for the product
      req.product.imageUrl = req.image;
      // find the URL of the old image
      try {
        const oldProduct = await Product.findById(req.body.productId)
        if (!oldProduct) throw new Error('product not found');
        req.imageToDelete = oldProduct.imageUrl;
      } catch (err) {
        err.httpStatusCode = 500;
        let error = new Error(err);
        return next(error)
      }
    }
    next()
  },

  doSaveUpdatedProduct: async (req, res, next) => {
    // middleware contract: req.product, req.prodId, req.userId, req.errors
    // product contains the fields: title, price, description, imageUrl(optional)
    if (req.errors && req.errors.length) return next()
    try {
      let result = await Product.update({
        "_id": req.prodId,
        "userId": req.user._id
      }, req.product, (err, response) => {
        if (err) {
          console.log(err)
        }
      })
    } catch (err) {
      const error = new Error(err)
      error.httpStatusCode = 500;
      next(error)
    }
    next()
  },
  finalizeUpdatingProduct: (req, res, next) => {
    // contruct:
    // req.errors
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
      res.redirect('/admin/products');
    }
  },
  deleteProductImage: async (req, res, next) => {
    // middleware contract:
    // req.imageToDelete : the url of the image to delete - string/null
    if (req.errors && req.errors.length) return next();
    if (req.imageToDelete) {
      fs.unlink(req.imageToDelete, (err) => {
        // If old image was already delete - don't care...
      })
    }
    next()
  },

  deleteProduct: async (req, res, next) => {
    const prodId = req.body.productId;
    try {
      let product = await Product.findById(prodId)
      req.imageToDelete = product.imageUrl;

      await Product.deleteOne({
        _id: prodId,
        userId: req.user._id
      })
      next();
    } catch (err) {
      res.status(500).json({
        message: 'Deleting product failed'
      })
      next(error)
    }
  },
  finalizeDeleteProduct: async (req, res, next) => {
    res.status(200).json({
      message: 'Success'
    })
  }
}




module.exports = middleware;
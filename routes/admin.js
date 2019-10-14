const express = require('express');

const productMiddleware = require('../middleware/product');

const {
  check,
  body
} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', isAuth, [validateTitle(), validateImage(), validatePrice(), validateDescription()],
  productMiddleware.getErrors,
  productMiddleware.addNewProduct,
  productMiddleware.saveNewProduct,
  productMiddleware.finalizeAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, [validateTitle(), validateEditImage(), validatePrice(), validateDescription()],
  productMiddleware.getErrors,
  productMiddleware.doUpdateProduct,
  productMiddleware.doSaveUpdatedProduct,
  productMiddleware.deleteProductImage,
  productMiddleware.finalizeUpdatingProduct
);

router.post('/delete-product', isAuth,
  productMiddleware.deleteProduct,
  productMiddleware.deleteProductImage,
  productMiddleware.finalizeDeleteProduct);

module.exports = router;


function validateTitle() {
  return body('title')
    .trim()
    .isLength({
      min: 4
    }).withMessage('The title should have at least 4 characters')
}

function validateImage() {
  return check("image")
    .custom((value, {
      req
    }) => {
      if (req.file) {
        req.image = req.file.path;
        return true
      } else return false;
    }).withMessage('Attached file is not an image')
}

function validateEditImage() {
  return check('image')
    .custom((value, {
      req
    }) => {
      if (req.file) {
        req.image = req.file.path;
      } else {
        req.image = null
      }
      return true
    })
}

function validatePrice() {
  return body("price")
    .trim()
    .isNumeric()
    .withMessage('Price is required');
}

function validateDescription() {
  return body("description")
    .isLength({
      min: 5
    })
    .withMessage('Description must contain at least 5 characters');
}
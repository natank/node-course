const express = require('express');

const {
  check,
  body
} = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', isAuth, [validateTitle(), validateImage(), validatePrice(), validateDescription()], adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, [validateTitle(), validateImage(), validatePrice(), validateDescription()], adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;


function validateTitle() {
  return body('title')
    .trim()
    .isLength({
      min: 4
    }).withMessage('The title should have at least 4 characters')
}

function validateImage() {
  return body("imageUrl")
    .trim()
    .isURL()
    .withMessage('The image should have a valid URL');
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
const path = require('path');

const express = require('express');

const productsController = require('../controllers/products')

const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/products', productsController.getProducts);

router.get('/cart', cartController.getCart);
module.exports = router;

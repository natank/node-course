 const path = require('path');

 const express = require('express');

 const shopController = require('../controllers/shop')

 const cartController = require('../controllers/cart');

 const router = express.Router();

 router.get('/products', shopController.getProducts);

 router.get('/', shopController.getIndex);

 router.get('/cart', cartController.getCart);

 router.get('/orders', shopController.getOrders);

 router.get('/shop/checkout', cartController.getCheckout);
 module.exports = router;
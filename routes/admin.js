const path = require('path');

const express = require('express');

const adminController = require('../Controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/editProduct
router.get('/edit-product', adminController.getEditProduct);

module.exports = router;
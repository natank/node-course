const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')
const paginationControl = require('./paginationControl');

exports.getProducts = async (req, res, next) => {
  try {
    let allProducts = await Product.find().populate('userId');

    const paginationProps = paginationControl.paginationProps(
      allProducts, req.query.pageToLoad
    )

    const {
      arrPageItems,
      pageToLoad,
      prevPage,
      nextPage,
      totalNumOfPages
    } = paginationProps;

    res.render('shop/product-list', {
      prods: arrPageItems,
      pageTitle: 'All Products',
      path: '/products',
      paginationProps: {
        pageToLoad: pageToLoad,
        prevPage: prevPage,
        nextPage: nextPage,
        totalNumOfPages: totalNumOfPages
      }

    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.getCart = async (req, res, next) => {
  try {
    let user = await req.user.populate({
      path: 'cart.product',
    }).execPopulate();

    let uiCart = user.cart.map(item => {
      let cartItem = {
        product: item.product,
        quantity: item.quantity
      }
      return cartItem;
    });
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart: uiCart
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    let result = await req.user.addToCart(product);
    // console.log(result);
    res.redirect('/cart');
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }

};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = await req.user.populate({
    path: 'cart.item.product',
  }).execPopulate();

  user.cart = user.cart.filter(item => {
    let removeThisItem = item.item.product._id.toString() !== prodId;
    return removeThisItem;
  });
  try {
    await user.save();
    res.redirect('/cart');
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await req.user.getOrders();
    let uiOrders = orders.map(order => {
      let uiOrder = {}
      uiOrder._id = order._id;
      uiOrder.prods = order.items.map(item => {
        let prod = {
          title: item.product.title,
          quantity: item.quantity
        }
        return prod
      });
      return uiOrder;
    })

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: uiOrders
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};


exports.findOrderToDownload = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders()
    const result = orders.find(function (order) {
      return order._id.toString() === req.params.orderId
    })
    if (!result) next(new Error('No order found.'))

    else {
      req.order = result
      next()
    }
  } catch (err) {
    next(err)
  }
}


exports.getInvoiceName = (req, res, next) => {
  req.invoiceName = `invoice_${req.params.orderId}.pdf`
  req.invoicePath = path.join('data', 'invoices', req.invoiceName);
  next()
}

exports.getInvoiceFile = async (req, res, next) => {
  try {
    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + req.invoiceName + '"'
    );

    pdfDoc.pipe(fs.createWriteStream(req.invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });

    pdfDoc.text('------------------------');
    let totalPrice = 0;
    req.order.items.forEach(item => {
      pdfDoc.fontSize(14).text(`${item.product.title} - ${item.quantity} x $ ${item.product.price}`);
      totalPrice += item.quantity * item.product.price
    })
    pdfDoc.fontSize(20).text('----')
    pdfDoc.text(`Total Price: $${totalPrice}`);

    pdfDoc.end();
    // let data = await new Promise((resolve, reject) => {
    //   fs.readFile(req.invoicePath, (err, data) => {
    //     if (err) reject(err)
    //     else resolve(data)
    //   })
    // })
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="' + req.invoiceName + '"');
    // res.send(data);

    // const file = fs.createReadStream(req.invoicePath);
    // file.pipe(res);
  } catch (err) {
    next(err)
  }
}
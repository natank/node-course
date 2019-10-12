const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')
const contentDisposition = require('content-disposition');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.find().populate('userId');

    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
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
      path: 'cart.item.product',
    }).execPopulate();

    let uiCart = user.cart.map(elem => {
      let cartItem = {
        product: elem.item.product,
        quantity: elem.item.quantity
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
    let uiOrders = orders.map(elem => {
      let order = {}
      order._id = elem._id;
      order.items = elem.order.map(item => {
        let prod = {
          title: item.item.product.title,
          quantity: item.item.quantity
        }
        return prod
      });
      return order;

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
      return order.id === req.params.orderId
    })
    if (!result) next(new Error('No order found.'))

    else {
      req.order = result.order
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
    req.order.forEach(item => {
      pdfDoc.fontSize(14).text(`${item.item.product.title} - ${item.item.quantity} x $ ${item.item.product.price}`);
      totalPrice += item.item.quantity * item.item.product.price
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
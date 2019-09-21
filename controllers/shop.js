const getDb = require('../util/database').getDb;
const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (err) {
    console.log(err)
  }

};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId)
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  } catch (err) {
    console.log(err)
  };
};

exports.getIndex = async (req, res, next) => {
  try {
    let products = await Product.find()
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (err) {
    console.log(err)
  }
};

exports.getCart = async (req, res, next) => {
  try {
    let products = await req.user.getCart();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch (err) {
    console.log(err)
  }
}

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = req.user;
  let userId = req.user._id;
  try {
    let productInCart = await user.find({
      'cart.productId': {
        $eq: prodId
      }
    })
    console.log(`product=${productInCart}`)

    let result = await User.update({
      "_id": userId
    }, {
      "$push": {
        "cart": {
          "productId": prodId,
          "quantity": 1
        }
      }
    })
    console.log(result)
    res.redirect('/cart')
  } catch (err) {
    console.log(err)
  }
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then(products => { // products in the cart
  //     let product;
  //     if (products.length > 0) { // product is in the cart
  //       product = products[0];
  //     }

  //     if (product) { // product is already in the cart
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findById(prodId); // product is not in the cart 
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity }
  //     });
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    let result = await req.user.removeFromCart(prodId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err)
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await req.user.getOrders();
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  } catch (err) {
    console.log(err)
  }

}
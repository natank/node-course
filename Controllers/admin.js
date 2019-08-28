const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-products',
      editing: editMode,
      product: product
    });
  })
};

exports.postEditProduct = (req, res, next) => {
  let {
    title,
    imageUrl,
    price,
    description,
    productId
  } = {
    ...req.body
  };
  Product.fetchAll(products => {
    let oldProduct = products.find(p => p.id === productId);
    if (!oldProduct) {
      return res.redirect('/');
    }
    oldProduct.title = title;
    oldProduct.imageUrl = imageUrl;
    oldProduct.price = price;
    oldProduct.description = description;
    Product.saveAll(products, err => console.log(err))
    res.redirect(`/products/${productId}`)
  })
}

exports.postDeleteProduct = (req, res, next) => {
  let prodId = req.params.productId;
  Product.delete(prodId, err => {
    if (!err) {
      Cart.deleteProduct(prodId, (err, () => {
        res.redirect('/admin/products')
      }))
    }
  });
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
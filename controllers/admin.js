const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    await Product.create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    });
    res.redirect('/admin/add-product')
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  let product
  try {
    product = await Product.findByPk(prodId)
  } catch (err) {
    console.log(err);
  }
  if (!product) {
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
}

exports.postEditProduct = async (req, res, next) => {
  const {
    productId,
    title,
    price,
    imageUrl,
    description
  } = {
    ...req.body
  };
  let id = productId;
  try {
    await Product.update({
      title,
      imageUrl,
      description,
      price
    }, {
      where: {
        id: productId
      }
    });
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err)
  }


};

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.findAll();
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await Product.destroy({
      where: {
        id: prodId
      }
    })
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err)
  }
};
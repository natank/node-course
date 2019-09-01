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

  let result
  try {
    result = await req.user.createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    });
    console.log('Created product');
    res.redirect('/admin/products')
  } catch (err) {
    console.log(err)
  }

};
exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  let product;
  try {
    let products = await req.user.getProducts({
      where: {
        id: prodId
      }
    })
    if (!products) res.redirect('/');
    let product = products[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  } catch (err) {
    console.log(err)
  }
};

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = {
    id: prodId,
    title: updatedTitle,
    imageUrl: updatedImageUrl,
    description: updatedDesc,
    price: updatedPrice
  };
  try {
    let result = await Product.upsert(updatedProduct)
  } catch (err) {
    console.log(err)
  }
  res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.findAll();
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })
  } catch (err) {
    console.log(err)
  }
}


exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  let num;
  try {
    num = await Product.destroy({
      where: {
        id: prodId
      }
    })
    console.log(`${num} products where deleted`)
  } catch (err) {
    console.log(err)
  }

  res.redirect('/admin/products');
};
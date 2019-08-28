const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  let product;
  try{
    product = await Product.findById(prodId)
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-products',
      editing: editMode,
      product: product
    });
  } catch(err){
    console.log(err);
  }
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

exports.postDeleteProduct = async (req, res, next) => {
  let prodId = req.params.productId;
  try{
    await Cart.deleteProduct(prodId)
    await Product.delete(prodId)
  } catch(err){
    console.log(err)
  }
  res.redirect('/admin/products')
}

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  try{
    await product.save();
    res.redirect('/');
  } catch(err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  let products;
  try{
    products = await Product.fetchAll();
    res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
    });
  } catch(err) {
    console.log(err);
  }
}
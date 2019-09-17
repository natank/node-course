const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const {
    title,
    imageUrl,
    price,
    description
  } = {
    ...req.body
  };

  let prod = new Product(
    title,
    price,
    description,
    imageUrl
  )

  await prod.save();
  console.log('Created Product');
  res.redirect('/products')

};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  try {
    let product = await Product.findById(prodId);
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
  try {

    let product = await Product.findById(prodId);
    console.log("admin post edit product")

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;

    // console.log(product)
    let result = await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log
  }
}




exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.fetchAll();
    console.log('in get products !!!!!')
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    console.log(err)
  }
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log('DESTROYED PRODUCT');
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(err));
// };
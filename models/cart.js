const fs = require('fs');
const path = require('path');
const product = require('./product');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)
module.exports = class Cart {
  static getAllItems(cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0
      };
      cart = JSON.parse(fileContent);
      cb(err, cart)
    })
  }

  static saveCart(cart, cb) {
    fs.writeFile(p, JSON.stringify(cart), err => {
      cb(err)
    })
  }

  static addProduct(id, productPrice) {
    this.getAllItems((err, cart) => {

      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct
        };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;

      } else {
        updatedProduct = {
          id: id,
          qty: 1
        }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      this.saveCart(cart);
    })
  }
  static deleteProduct(id, cb) {
    this.getAllItems((err, cart) => {
      cart.products = cart.products.filter(item => item.id != id);

      cart.totalPrice = cart.products.reduce((acc, cartItem) => {
        product.findById(cartItem.id, (err, product) => {
          if (!err && product) {
            return acc + product.price * elem.qty;
          } else {
            return acc
          }

        })
      }, 0)
      this.saveCart(cart, (err) => {
        cb(err, cart)
      })
    })
  }
}
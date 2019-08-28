const fs = require('fs');
const path = require('path');
const Product = require('./product');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
)
module.exports = class Cart {
  static getAllItems() {
    let itemsPromise = new Promise((resolve, reject)=>{
      let cart;
      try{
        fs.readFile(p, (err, fileContent) => {
          cart = JSON.parse(fileContent);
          resolve(cart);
        })
      }catch(err){
        reject(err);
      }
    })
    return itemsPromise
  }

  static saveCart(cart) {
    let savePromise = new Promise((resolve, reject)=>{
      let cart;
      try{
        fs.writeFile(p, JSON.stringify(cart), err=> {
          if(err) throw err
        })
      } catch(err){
        console.log(err);
      }
    })
    return savePromise;
  }

  static addProduct(id, productPrice) {
    let addPromise = new Promise(async (resolve, reject) =>{
      let cart;
      try{
        cart = await this.getAllItems();
      } catch(err){
        reject(err)
      }
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
          qty: 1,
          price: productPrice
        }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      try{
        await this.saveCart(cart);
        resolve();
      } catch(err){
        reject(err)
      }
    })
    return addPromise    
  }


  static deleteProduct(id) {
      let deletePromise = new Promise(async (resolve, reject)=>{
      let cart;
      
      try{
        cart = await this.getAllItems()
      }catch(err){
        reject(err)
      }
      
      let productToDelete = cart.find(product=> product.id === id);
      if(productToDelete){
        cart.totalPrice -= productToDelete.price*productToDelete.qty;
        cart.products = cart.products.filter(item => item.id != id);
      }
      
      try{
        await this.saveCart(cart)
      }catch(err){
        reject(err)
      }
    })
    return deletePromise;
  }
}
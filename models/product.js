const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    cb(err, JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {

    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static delete(id, cb) {
    getProductsFromFile((products) => {
      const result = products.filter(product => product.id !== id);
      this.saveAll(result, cb);
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((err, products) => {
      let product;
      if (!err) {
        product = products.find(p => p.id === id);
      }
      cb(err, product);
    });
  }

  static saveAll(products, cb) {
    fs.writeFile(p, JSON.stringify(products), err => cb(err))
  }
};
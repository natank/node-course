const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, _id = null) {
    (this.title = title), (this.price = price), (this.description = description), (this.imageUrl = imageUrl), (this._id = _id);
  }

  async save() {
    console.log('in save');
    const db = getDb();
    let result;
    try {
      /* New product */
      if (!this._id) {

        result = await db.collection('products').insertOne(this);
        console.log(`result = ${result}`)

        // console.log(result);

      } else {
        /* Existing product */
        console.log(`this._id = ${this._id}`)
        result = await db.collection.update({
          _id: new mongodb.ObjectId(this._id)
        }, {
          $set: {
            title: this.title,
            price: this.price,
            description: this.description,
            imageUrl: this.imageUrl
          }
        })
      }
      let p = new Promise((resolve, reject) => {
        resolve(result);
      })
      return p;
    } catch (err) {
      console.log(err);
    }
  }
  static async fetchAll() {
    const db = getDb();
    try {
      let products = await db
        .collection('products')
        .find()
        .toArray();
      console.log(products);
      let p = new Promise((resolve, reject) => {
        resolve(products);
      });
      return p;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId) {
    const db = getDb();
    try {
      console.log(`prodId = ${prodId}`);
      // let id11 = new mongodb.ObjectId(prodId);

      let product = await db
        .collection('products')
        .find({
          _id: new mongodb.ObjectId(prodId)
        })
        .next();

      if (product) {
        product = new Product(product.title, product.price, product.description, product.imageUrl, prodId)
      }
      console.log(`product = ${product}`);
      let p = new Promise((resolve, reject) => {
        resolve(product);
      });
      return p;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Product;
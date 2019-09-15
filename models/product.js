const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title,
      this.price = price,
      this.description = description,
      this.imageUrl = imageUrl
  }

  async save() {
    const db = getDb();
    try {
      let result = await db.collection('products').insertOne(this)
      // console.log(result);
    } catch (err) {
      console.log(err)
    }
  }
  static async fetchAll() {
    const db = getDb();
    try {
      let products = await db.collection('products').find().toArray();
      console.log(products);
      let p = new Promise((resolve, reject) => {
        resolve(products)
      })
      return p;
    } catch (err) {
      console.log(err)
    }
  }

  static async findById(prodId) {
    const db = getDb();
    try {
      let id11 = new mongodb.ObjectId(prodId)
      console.log(`prodId = ${prodId}`)
      console.log(`id11 = ${id11}`)
      let product = await db.collection('product').find({
          _id: new mongodb.ObjectId(prodId)
        })
        .next()

      console.log(`product = ${product}`);
      let p = new Promise((resolve, reject) => {
        resolve(product);
      })
      return p;
    } catch (err) {
      console.log(err)
    }
  }
}



module.exports = Product;
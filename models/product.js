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
      console.log(result);
    } catch (err) {
      console.log(err)
    }
  }
  static async fetchAll() {
    const db = getDb();
    try {
      let products = db.collection('products').find();
      console.log(products);
      let p = new Promise((resolve, reject) => {
        resolve(products)
      })
      return p;
    } catch (err) {
      console.log(err)
    }
  }
}



module.exports = Product;
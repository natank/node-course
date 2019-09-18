const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, id = null) {
    this.name = username;
    this.email = email;
  }

  async save() {
    const db = getDb();
    if (this.id) {

    } else {
      try {

        let result = await db.collection('user').insertOne(this);
        console.log(`New user added:`)
      } catch (err) {
        console.log(err)
      }

    }
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({
        _id: new ObjectId(userId)
      })
  }
}
module.exports = User;
const mongodb = require('mongodb')


const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  try {
    let client = await MongoClient.connect('mongodb://nathank:windows10@ds063158.mlab.com:63158/online-store')
    // let client = await MongoClient.connect('mongodb://localhost:27017/local')
    _db = client.db();
    console.log('Connected!')
    let p = new Promise((resolve, reject) => {
      resolve(client);
    })
    return p;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
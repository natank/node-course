const Sequelize = require('sequelize');

const sequelize = new Sequelize('x7vPyduhJ8', 'x7vPyduhJ8', 'rp99Ng7xJq', {
  host: 'remotemysql.com',
  dialect: 'mysql '
});

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'remotemysql.com',
//   user: 'x7vPyduhJ8',
//   database: 'x7vPyduhJ8',
//   password: 'rp99Ng7xJq'
// })

// module.exports = pool.promise();

// Refference only
//     host: 'remotemysql.com',
//     port: 3306,
//     user: '1C0uYToL7X',
//     database: '1C0uYToL7X',
//     password: 'eSJUktxS0j'

const Sequelize = require('sequelize');

const sequelize = new Sequelize('1C0uYToL7X', '1C0uYToL7X', 'eSJUktxS0j', {
    dialect: 'mysql',
    host: 'remotemysql.com'
})

module.exports = sequelize;
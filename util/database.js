const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'remotemysql.com',
    port: 3306,
    user: '1C0uYToL7X',
    database: '1C0uYToL7X',
    password: 'eSJUktxS0j'
});
db = pool.promise();

module.exports = db;
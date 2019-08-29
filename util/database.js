const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database:'node-complete',
    password: 'Engine9'
});
db = pool.promise();

module.exports = db;


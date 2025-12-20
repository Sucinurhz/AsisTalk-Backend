const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // ganti sesuai mysql kamu
    password: '',
    database: 'asistalk'
});

module.exports = db;
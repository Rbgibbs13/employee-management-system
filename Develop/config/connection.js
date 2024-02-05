const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // {
  //   host: 'localhost',
  //   dialect: 'mysql',
  //   port: 3306
  // }
});

module.exports = connection;
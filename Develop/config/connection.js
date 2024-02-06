const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createConnection(
  {
      host: 'localhost',
      user: 'root',
      password: 'sqlPass',
      database: 'employee_db'
  },
);

module.exports = connection;
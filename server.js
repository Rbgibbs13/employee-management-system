const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });
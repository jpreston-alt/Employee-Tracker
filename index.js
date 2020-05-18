const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PW,
    database: "employeeTracker_db"
});

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}...`)
    connection.end();
});

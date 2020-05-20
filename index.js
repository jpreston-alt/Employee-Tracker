const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const questions = require("./lib/Questions")
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
    console.log(`Connected as id ${connection.threadId}...`);
    // init();
});


module.exports = connection;

// function init() {
//     inquirer
//         .prompt(questions.toDoQuestion)
//         .then(data => {
//             switch (data.toDoType) {
//                 case "View all Employees":
//                     viewAll();
//                     break;
//                 default:
//                     connection.end();
//             }


//         })
//         .catch(err => {
//             if (err) throw err;
//         });
// };

// function viewAll() {
//     connection.query("Select * FROM employee", (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         init();
//     })
// };






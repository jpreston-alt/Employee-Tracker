const inquirer = require("inquirer");
const db = require("./server_db");
const Query = require("./lib/Query");
const questions = require("./lib/Questions");
const cTable = require("console.table");

let employeeQuery = Query.employeeQuery;
let departmentQuery = Query.departmentQuery;
let roleQuery = Query.roleQuery;
let QueryClass = Query.Query;

function init() {
    inquirer
        .prompt(questions.toDoQuestion)
        .then(data => {
            switch (data.toDoType) {
                case "View all Employees":
                    employeeQuery.viewTable();
                    break;
                case "View all Departments":
                    departmentQuery.viewTable();
                    break;
                case "View all Roles":
                    roleQuery.viewTable();
                    break;
                case "Add Employee":
                    employeeQuery.addToTable();
                    break;
                case "Add Department":
                    departmentQuery.addToTable();
                    break;
                case "Add Role":
                    roleQuery.addToTable();
                    break;
                default:
                    db.end();
            }
        })
        .catch(err => {
            if (err) throw err;
        });
};

init();

QueryClass.prototype.viewTable = function() {
    db.query(
        `Select * FROM ${this.table}`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
        });
};

QueryClass.prototype.addToTable = function() {
    this.askQuestions().then(data => {
        this.params = Object.values(data);
        let table = this.table;
        db.query(
            `INSERT INTO ${this.table} (${this.columns}) VALUES (?);`,
            [this.params],
            function (err, res) {
                if (err) throw err;
                console.table(`New ${table} added!`);
                init();
        });
    });
};

// updateTable() {

// };

// deleteFromTable() {

// };

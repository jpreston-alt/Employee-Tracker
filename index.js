const inquirer = require("inquirer");
const db = require("./server_db");
const Query = require("./lib/Query");
const questions = require("./lib/Questions");
const cTable = require("console.table");

// set variables for query/table instances
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
                case "Remove Employee":
                    employeeQuery.deleteFromTable();
                    break;
                case "Remove Department":
                    departmentQuery.deleteFromTable();
                    break;
                case "Remove Role":
                    roleQuery.deleteFromTable();
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

// view table method
QueryClass.prototype.viewTable = function() {
    this.findColVals();
    db.query(
        `Select * FROM ${this.table}`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
        });
};

// add to table method
QueryClass.prototype.addToTable = function() {
    this.findColVals();
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

// method for removing instance from table
QueryClass.prototype.deleteFromTable = function () {
    this.findColVals();
    let choices = this.deleteQuestion.choices;
    let type = this.table;

    inquirer.prompt(this.deleteQuestion).then(data => {
        let deleteVal = Object.values(data);

        db.query(
            `DELETE FROM ${this.table} WHERE ${this.columns[0]}=?;`,
            [deleteVal],
            function (err, res) {
                if (err) throw err;
                console.table(`${type} deleted`);

                for (var i = 0; i < choices.length; i++) {
                    if (choices[i] == deleteVal) {
                        choices.splice(i, 1);
                    };
                };

                init();
        });
    });
};


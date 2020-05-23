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

init();

function init() {
    findDeleteVals();
    findColumnVals();
    inquirer.prompt(questions.toDoQuestion).then(data => {
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
            case "Update Employee Role":
                employeeQuery.updateRole();
                break;
            case "Update Employee Manager":
                employeeQuery.updateManager();
                break;
            default:
                db.end();
        }
        })
        .catch(err => {
            if (err) throw err;
        });
};

// view table method
QueryClass.prototype.viewTable = function() {
    let query;

    if (this.table == "employee") {
        query = this.joinQuery;
    } else {
        query = `Select * FROM ${this.table}`;
    };

    db.query(query, function (err, res) {
            if (err) throw err;
            console.log("\n");
            console.table(res);
            console.log("\n");
            init();
        });
};

// delete method
QueryClass.prototype.deleteFromTable = function () {
    let choices = this.deleteQuestion.choices;
    let type = this.table;

    inquirer.prompt(this.deleteQuestion).then(data => {
        let deleteVal;
        
        if (this.table === "employee") {
            let name = Object.values(data)[0];
            deleteVal = name.split(" ")[0];
        } else {
            deleteVal = Object.values(data);
        };

        db.query(`DELETE FROM ${this.table} WHERE ${this.columns[0]}=?;`,[deleteVal], function (err, res) {
            if (err) throw err;
            console.log(`\n${type} deleted!\n`);

            for (var i = 0; i < choices.length; i++) {
                if (choices[i] == deleteVal) {
                    choices.splice(i, 1);
                };
            };
            findDeleteVals();
            init();
        });
    });
};

employeeQuery.updateRole = function() {
    inquirer.prompt(questions.updateEmpQ).then(data => {
        let { updateEmployee, updateRole } = data;
        let fullName = updateEmployee.split(" ");
        db.query(`SELECT * FROM role`, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if (updateRole === res[i].name) {
                    db.query(`UPDATE employee SET role_id=${res[i].id} WHERE first_name="${fullName[0]}" AND last_name="${fullName[1]}";`, function(err, res) {
                        if (err) throw err;
                        console.log(`\nEmployee Role Updated!\n`)
                        init();
                    });
                };
            };
        });
    });
};

employeeQuery.updateManager = function () {
    inquirer.prompt(questions.updateEmpManager).then(data => {
        let { updateEmpName, updateEmpManager } = data;
        let fullName = updateEmpName.split(" ");
        db.query(`UPDATE employee SET manager="${updateEmpManager}" WHERE first_name="${fullName[0]}" AND last_name="${fullName[1]}";`, function (err, res) {
            if (err) throw err;
            console.log(`\nEmployee Manager Updated!\n`)
            init();
        });
    });
};

QueryClass.prototype.addToTable = function () {
    let table = this.table;
    let columns = this.columns;
    let params = [];
    let obj = this;
    let otherTable;

    if (table === "employee") {
        otherTable = "role";
    } else if (table === "role") {
        otherTable = "department";
    };

    this.askQuestions().then(data => {
        params.push(Object.values(data)[0]);
        params.push(Object.values(data)[1]);

        db.query(`SELECT * FROM ${otherTable}`, function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                if (Object.values(data)[2] == res[i].name) {
                    params.push(res[i].id);
                };
            };

            if (table === "employee") {params.push(Object.values(data)[3])};

            db.query(`INSERT INTO ${table} (${columns}) VALUES (?);`, [params], function (err, res) {
                if (err) throw err;
                console.log(`\nNew ${table} added!\n`);
                init();
            });

        });
    });
};

departmentQuery.addToTable = function () {
    this.askQuestions().then(data => {
        let params = Object.values(data);
        let table = this.table;
        db.query(`INSERT INTO ${this.table} (${this.columns}) VALUES (?);`,[params], function (err, res) {
            if (err) throw err;
            console.log(`\nNew ${table} added!\n`);
            init();
        });
    });
};

function findDeleteVals() {
    roleQuery.findColVals("name", roleQuery.deleteQuestion.choices);
    departmentQuery.findColVals("name", departmentQuery.deleteQuestion.choices);
    employeeQuery.findColVals("first_name, last_name", employeeQuery.deleteQuestion.choices);
};

function findColumnVals() {
    roleQuery.findColVals("name", questions.roleArr);
    departmentQuery.findColVals("name", questions.departmentArr);
    employeeQuery.findColVals("first_name, last_name", questions.employeeArr);
};

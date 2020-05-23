const questions = require("./Questions");
const inquirer = require("inquirer");
const db = require("../server_db");

class Query {
    constructor(table, questions) {
        this.table = table;
        this.questions = questions;
        this.columns = [];
        this.joinQuery = 
            `SELECT employee.id, first_name, last_name, role.name as title, department.name as department, role.salary, manager
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id`
        this.deleteQuestion = {
            type: "list",
            name: `delete${this.table}`,
            message: `Which ${this.table} would you like to delete?`,
            choices: []
        };
    };

    // ask questions to add new instance to table
    askQuestions() {
        return inquirer.prompt(this.questions);
    };

    findColumns() {
        let columns = this.columns;
        db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${this.table}';`, function (err, res) {
            if (err) throw err;

            for (var i = 1; i < res.length; i++) {
                columns.push(res[i].COLUMN_NAME);
            };
        });
    };

    findColVals(colNames, arr) {
        let obj = this;
        db.query(`SELECT ${colNames} FROM ${this.table}`, function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                if (obj.table === "employee") {
                    let first = Object.values(res[i])[0];
                    let last = Object.values(res[i])[1];
                    let fullName = first + " " + last;
                    if (!arr.includes(fullName)) {
                        arr.push(fullName);
                    };
                } else {
                    let val = Object.values(res[i])[0];
                    if (!arr.includes(val)) {
                        arr.push(val);
                    };
                };

                for (var j = 0; j < arr.length; j++) {
                    if (Object.values(res[i]).join(" ") != arr[i]) {
                        arr.splice(i, 1);
                    };
                };
            };
        });
    };
};

// new table query instances;
const employeeQuery = new Query("employee", questions.addEmployeeQs);
const departmentQuery = new Query("department", questions.addDepartmentQs);
const roleQuery = new Query("role", questions.addRoleQs);

// find table column names
employeeQuery.findColumns();
departmentQuery.findColumns();
roleQuery.findColumns();

// export instances
module.exports = {Query, employeeQuery, departmentQuery, roleQuery};
const questions = require("./Questions");
const inquirer = require("inquirer");
const db = require("../server_db");

class Query {
    constructor(table, questions) {
        this.table = table;
        this.questions = questions;
        this.columns = [];
        this.joinQuery = 
            `SELECT employee.id, first_name, last_name, role.name, department.name as department, role.salary
            FROM employee
            INNER JOIN role ON employee.role_id = role.id
            INNER JOIN department ON role.department_id = department.id;`
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

    findColVals() {
        // based on column names, find values used to delete instances
        let table = this.table;
        let choices = this.deleteQuestion.choices;

       return db.query(`SELECT ${this.columns[0]} FROM ${table}`, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                let val = Object.values(res[i])[0];
                if (!choices.includes(val)) {
                    choices.push(val);
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
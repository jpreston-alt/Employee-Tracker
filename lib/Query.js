const questions = require("./Questions");
const inquirer = require("inquirer");
const db = require("../server_db");

class Query {
    constructor(table, params, questions) {
        this.table = table;
        this.params = params;
        this.questions = questions;
        this.columns = [];
        this.deleteQuestion = {
            type: "list",
            name: `delete${this.table}`,
            message: `Which ${this.table} would you like to delete?`,
            choices: []
        }
    }

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
const employeeQuery = new Query("employee", null, questions.addEmployeeQs);
const departmentQuery = new Query("department", null, questions.addDepartmentQs);
const roleQuery = new Query("role", null, questions.addRoleQs);

// find table column names
employeeQuery.findColumns();
departmentQuery.findColumns();
roleQuery.findColumns();

// export instances
module.exports = {Query, employeeQuery, departmentQuery, roleQuery};
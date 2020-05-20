const questions = require("./Questions");
const inquirer = require("inquirer");
const db = require("../server_db");

class Query {
    constructor(table, params, questions) {
        this.table = table;
        this.params = params;
        this.questions = questions;
        this.columns = [];
    }

    askQuestions() {
        return inquirer.prompt(this.questions);
    };

    findColumns() {
        let columns = this.columns 
        db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${this.table}';`, function (err, res) {
            if (err) throw err;

            for (var i = 1; i < res.length; i++) {
                columns.push(res[i].COLUMN_NAME);
            };
        });
    };
};

const employeeQuery = new Query("employee", null, questions.addEmployeeQs);
const departmentQuery = new Query("department", null, questions.departmentQs);
const roleQuery = new Query("role", null, questions.roleQs);

employeeQuery.findColumns();
departmentQuery.findColumns();
roleQuery.findColumns();

module.exports = {Query, employeeQuery, departmentQuery, roleQuery};


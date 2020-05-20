const questions = require("./Questions");
const inquirer = require("inquirer");

class Query {
    constructor(table, params, questions) {
        this.table = table;
        this.params = params;
        this.questions = questions;
    }

    askQuestions() {
        return inquirer.prompt(this.questions);
    };
};

const employeeQuery = new Query("employee", null, questions.addEmployeeQs);
const departmentQuery = new Query("department", null, questions.departmentQs);
const roleQuery = new Query("employee", null, questions.roleQs);

employeeQuery.askQuestions().then((data) => {console.log(data)});


module.exports = {Query, employeeQuery, departmentQuery, roleQuery};


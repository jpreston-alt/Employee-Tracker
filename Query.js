const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db_server");

class Query {
    constructor(questions, queryStr, params) {
        this.questions = questions;
        this.queryStr = queryStr;
        this.params = params;
    };

    askQuestion() {
        inquirer
            .prompt(this.questions)
            .then(data => {
                this.performQuery();
            })
            .catch(err => {
                if (err) throw err;
            });
    };

    performQuery() {
        db.query(this.queryStr, this.params, (err, res) => {
            if (err) throw err;
            console.table(res);
            // db.end();
        })
    };
};

const viewAllEmp = new Query(null, "SELECT * FROM employee", null);

module.exports = {viewAllEmp};


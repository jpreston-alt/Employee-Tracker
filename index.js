const inquirer = require("inquirer");
const db = require("./server_db");
const Query = require("./lib/Query");
const questions = require("./lib/Questions");


function init() {
    inquirer
        .prompt(questions.toDoQuestion)
        .then(data => {
            switch (data.toDoType) {
                case "View all Employees":
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

// askQuestions() {
//     return inquirer.prompt(this.questions);
// };

// addToTable() {
//     db.query(
//         `INSERT INTO employee (first_name, last_name, role_id, manager_id)
//             VALUES (?);`, [this.params],
//         function (err, res) {
//             if (err) throw err;
//             console.table(res);
//             // init();
//         });
// };

function viewTable() {
    db.query(
        `Select * FROM ${this.table}`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            index.init();
        });
};

// updateTable() {

// };

// deleteFromTable() {

// };

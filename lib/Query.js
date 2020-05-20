const db = require("../index");

class Query {
    constructor(table, params) {
        this.table = table;
        this.params = params;
    }

    addToTable() {
        db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?);`, [this.params],
            function(err, res) {
            if (err) throw err;
            console.table(res);
            // init();
        });
    };

    viewTable() {
        db.query(
            `Select * FROM ${this.table}`,
            function (err, res) {
                if (err) throw err;
                console.table(res);
                // init();
            });
    };

    updateTable() {

    };

    deleteFromTable() {

    };
};

const employeeQuery = new Query("employee", ["Jane", "Doe", "Designer", "null"]);
// employeeQuery.addToTable();
employeeQuery.viewTable();


// create
// retrieve
// update
// delete
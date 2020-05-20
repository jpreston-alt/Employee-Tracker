const db = require("../server_db");

let roleArr = [];
let departmentArr = [];

findColVals("role", "title", roleArr);
findColVals("department", "name", departmentArr);

const toDoQuestion = {
    type: "list",
    name: "toDoType",
    message: "What would you like to do?",
    choices: ["View all Employees", "View all Employees by Department", "View all Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View all Roles", "Add Role", "Remove Role", "View all Departments", "Add Department", "Remove Department", "Nothing, I'm done"]
};

const addEmployeeQs = [
    {
        type: "input",
        name: "employeeFirstName",
        message: "What is the employee's first name?"
    },
    {
        type: "input",
        name: "employeeLastName",
        message: "What is the employee's last name?"
    },
    {
        type: "input",
        name: "employeeLastName",
        message: "What is the employee's last name?"
    },
    {
        type: "list",
        name: "employeeRole",
        message: "What is the employee's role?",
        choices: roleArr
    },

]

const departmentQs = {
    type: "input",
    name: "departmentName",
    message: "What department would you like to add?"
};

const roleQs = [
    {
        type: "input",
        name: "roleName",
        message: "What role would you like to add? ",
    },
    {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role? "
    },
    {
        type: "list",
        name: "departmentName",
        message: "What department does this role belong to? ",
        choices: departmentArr
    }
];

function findColVals(table, colName, arr) {
    db.query(`SELECT ${colName} FROM ${table}`, function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            let val = Object.values(res[i])[0];
            if(!arr.includes(val)) {
                arr.push(val);
            };
        };
    });
};

module.exports = {toDoQuestion, addEmployeeQs, departmentQs, roleQs};
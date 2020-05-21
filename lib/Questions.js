const db = require("../server_db");

// will hold role names and department names from database columns
let roleArr = [];
let departmentArr = [];
let employeeArr = [];

// find column names to push into above arrays
findColVals("role", "name", roleArr);
findColVals("department", "name", departmentArr);
findColVals("employee", "first_name", employeeArr);

// what would you like to do question
const toDoQuestion = {
    type: "list",
    name: "toDoType",
    message: "What would you like to do?",
    choices: ["View all Employees", "View all Employees by Department", "View all Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View all Roles", "Add Role", "Remove Role", "View all Departments", "Add Department", "Remove Department", "Nothing, I'm done"]
};

// questions to add employee
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
];

const updateEmpQ = [
    {
        type: "list",
        name: "updateEmployee",
        message: "Which employees' role do you want to update? ",
        choices: employeeArr
    },
    {
        type: "list",
        name: "updateRole",
        message: "What do you want to update their role to? ",
        choices: roleArr
    }
];

// questions to add department
const addDepartmentQs = {
    type: "input",
    name: "departmentName",
    message: "What department would you like to add?"
};

// questions to add new role
const addRoleQs = [
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

// find column names to insert into arrays
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

module.exports = {toDoQuestion, addEmployeeQs, addDepartmentQs, addRoleQs, updateEmpQ};
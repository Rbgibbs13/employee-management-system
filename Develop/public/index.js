//const { last } = require("lodash");
//const connection = require("../config/connection.js");
const { response } = require("express");
const inquirer = require("../../node_modules/inquirer");
//conn = await connection;
// (async () => {
//     if(connection) {
//         conn = await connection;
//     }
// })();

// //employees = await conn.query(selectEmployeesQuery);
// (async () => {
//     if(conn) {
//         employees = await conn.query(selectEmployeesQuery);
//     }
// })();

inquirer.prompt([
    {
        name: "answer",
        type: "list",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"],
    }
]).then((response) => {
    const answer = response.answer;

    switch(answer) {
        case "view all departments":
            viewAllDepartments();
            break;
        
        case "view all roles":
            viewAllRoles();
            break;

        case "view all employees":
            viewAllEmployees();
            break;

        case "add a department":
            addDepartmentHandler();
            break;

        case "add a role":
            addRole();
            break;

        case "add an employee":
            addEmployee();
            break;

        case "update an employee role":
            updateEmployeeRole();
            break;
    }
}).catch((error) => {
    console.error(error + " Skipped");
});

const viewAllDepartments = async () => {
    const sql = "SELECT * FROM department;";
    const res = await connection.query(sql);
};

const viewAllRoles = async () => {
    const sql = "SELECT * FROM role;";
    const res = await connection.query(sql);
};

const viewAllEmployees = async () => {
    const sql = "SELECT * FROM employee;";
    const res = await connection.query(sql);
};

const addDepartmentHandler = () => {
    inquirer.prompt([
        {
            name: "answer",
            type: "input",
            message: "Department Name",
            filter: (result) => { 
                if(result.length > 30) return result.substring(0,30).toLowerCase(); 
                else return result.toLowerCase();
            },
        }
    ]).then((response) => {
        const answer = response.answer;
        addDepartment(answer);
    });
}

const addDepartment = async (depName) => {
    const sql = `INSERT INTO department(department_name)
                 VALUES("${depName}");`
    const res = await connection.query(sql);
};

const addRole = async (roleName, salary, departmentID) => {
    const sql = `INSERT INTO role(title, salary, department_id)
                 VALUES("${roleName}", ${salary}, ${departmentID});`
    const res = await connection.query(sql);
};

const addEmployee = async(firstName, lastName, roleID) => {
    const sql = `INSERT INTO emploee(first_name, last_name, role_id, manager_id)
                 VALUES("${firstName}", "${lastName}", ${roleID}, ${null});`
    const res = await connection.query(sql);
};

const updateEmployeeRole = async(employeeID, roleID) => {
    inquirer.prompt([
        {
            name: "employeeID",
            type: "number",
            message: "Employee ID",
        },
        {
            name: "roleID",
            type: "number",
            message: "Role ID",
        }
    ]).then((response) => {
        const { employeeID, roleID } = response;
        sendQuery = async(employeeID, roleID) => {
            const sql = `UPDATE employee
                     SET role_id = ${roleID}
                     WHERE id = ${employeeID};`
            const res = await connection.query(sql);
        }
        sendQuery(employeeID, roleID);
    });    
};
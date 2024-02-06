const { last } = require("lodash");
const connection = require("../config/connection.js");
const { response } = require("express");
const inquirer = require("../../node_modules/inquirer");

const InitialPrompt = () => {
    inquirer.prompt([
        {
            name: "answer",
            type: "list",
            message: "What would you like to do?",
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "remove a department", "remove a role", "remove an employee", "update an employee role"],
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

            case "remove a department":
                removeDepartment();
                break;

            case "remove a role":
                removeRole();
                break;

            case "remove an employee":
                removeEmployee();
                break;
    
            case "update an employee role":
                updateEmployeeRole();
                break;

            default:
                viewAllDepartments();
                return;
        }
    }).catch((error) => {
        console.error(error + " Skipped");
    });
}

const viewAllDepartments = async () => {
    const sql = "SELECT * FROM department;";
    conn = await connection;
    const res = await conn.query(sql);
    console.log(res[0]);
    InitialPrompt();
};

const viewAllRoles = async () => {
    const sql = "SELECT * FROM role;";
    conn = await connection;
    const res = await conn.query(sql);
    console.log(res[0]);
    InitialPrompt();
};

const viewAllEmployees = async () => {
    const sql = "SELECT * FROM employee;";
    conn = await connection;
    const res = await conn.query(sql);
    console.log(res[0]);
    InitialPrompt();
};

const addDepartmentHandler = () => {
    inquirer.prompt([
        {
            name: "answer",
            type: "input",
            message: "Department Name",
            filter: (result) => { 
                if(result.length > 30) return result.substring(0,1).toUpperCase() + result.substring(1,30).toLowerCase(); 
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
    conn = await connection;            
    const res = await conn.query(sql);
    viewAllDepartments();
    InitialPrompt();
};

const removeDepartment = async() => {
    const sql = `SELECT * FROM department;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const departments = [];
    for(let i = 0; i < res[0].length; i++) {
        departments.push(res[0][i].department_name);
    }
    
    inquirer.prompt([
        {
            name: "Department",
            type: "list",
            choices: departments,
            message: "Select Department to Remove"
        }
    ]).then((response) => {
        const department = response.department;
        sendQuery = async(department) => {
            const sql = `DELETE FROM department WHERE department_name="${department}";`            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllDepartments();
            InitialPrompt();
        };
        sendQuery(department);
    });
};

const addRole = async () => {
    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            description: "New Role Name",
        },
        {
            name: "salary",
            type: "number",
            description: "Role Pay",
        },
        {
            name: "departmentID",
            type: "number",
            description: "Role Department",
        },
    ]).then((response) => {
        const { roleName, salary, departmentID } = response;
        sendQuery = async(roleName, salary, departmentID) => {
            const sql = `INSERT INTO role(title, salary, department_id)
                 VALUES("${roleName}", ${salary}, ${departmentID});`
            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllRoles();
            InitialPrompt();
        };
        sendQuery(roleName, salary, departmentID);
    });
};

const removeRole = async() => {
    const sql = `SELECT title FROM role;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const roles = [];
    for(let i = 0; i < res[0].length; i++) {
        roles.push(res[0][i].title);
    }
    
    inquirer.prompt([
        {
            name: "Role",
            type: "list",
            choices: roles,
            message: "Select Role to Remove"
        }
    ]).then((response) => {
        const role = response.role;
        sendQuery = async(role) => {
            const sql = `DELETE FROM role WHERE title="${role}";`            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllRoles();
            InitialPrompt();
        };
        sendQuery(role);
    });
};

const addEmployee = async(firstName, lastName, roleID) => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            description: "Employee First Name",
        },
        {
            name: "lastName",
            type: "input",
            description: "Employee Last Name",
        },
        {
            name: "roleID",
            type: "number",
            description: "Employee Role ID",
        },
    ]).then((response) => {
        const { firstName, lastName, roleID } = response;
        sendQuery = async(firstName, lastName, roleID) => {
            const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                 VALUES("${firstName}", "${lastName}", ${roleID}, ${null});`
            
            conn = await connection; 
            const res = await conn.query(sql);
            viewAllEmployees();
            InitialPrompt();
        };
        sendQuery(firstName, lastName, roleID);
    });
};

const removeEmployee = async() => {
    const sql = `SELECT * FROM employee;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const employees = [];
    for(let i = 0; i < res[0].length; i++) {
        employees.push(res[0][i].first_name + " " + res[0][i].last_name);
    }
    
    inquirer.prompt([
        {
            name: "Employee",
            type: "list",
            choices: employees,
            message: "Select Employee to Remove"
        }
    ]).then((response) => {
        const employee = response.Employee.split(" ");
        sendQuery = async(first_name, last_name) => {
            const sql = `DELETE FROM employee WHERE first_name="${first_name}" AND last_name="${last_name}";`;
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllEmployees();
            InitialPrompt();
        };
        sendQuery(employee[0], employee[1]);
    });
};

const updateEmployeeRole = async() => {
    inquirer.prompt([
        {
            name: "employeeID",
            type: "number",
            message: "Employee ID",
        },
        {
            name: "roleID",
            type: "number",
            message: "New Role ID",
        }
    ]).then((response) => {
        const { employeeID, roleID } = response;
        sendQuery = async(employeeID, roleID) => {
            const sql = `UPDATE employee
                     SET role_id = ${roleID}
                     WHERE id = ${employeeID};`
            conn = await connection; 
            const res = await conn.query(sql);
            viewAllEmployees();
            InitialPrompt();
        };
        sendQuery(employeeID, roleID);
    });    
};

InitialPrompt();
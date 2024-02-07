const { last } = require("lodash");
const connection = require("../config/connection.js");
const { response } = require("express");
const inquirer = require("../../node_modules/inquirer");

const InitialPrompt = async () => {
    inquirer.prompt([
        {
            name: "answer",
            type: "list",
            message: "What would you like to do?",
            choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "remove a department", "remove a role", "remove an employee", "view department costs", "update an employee role"],
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

            case "view department costs":
                departmentCosts();
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
    await InitialPrompt();
};

const viewAllRoles = async () => {
    const sql = "SELECT * FROM role;";
    conn = await connection;
    const res = await conn.query(sql);
    console.log(res[0]);
    await InitialPrompt();
};

const viewAllEmployees = async () => {
    const sql = "SELECT * FROM employee;";
    conn = await connection;
    const res = await conn.query(sql);
    console.log(res[0]);
    await InitialPrompt();
};

const addDepartmentHandler = () => {
    inquirer.prompt([
        {
            name: "answer",
            type: "input",
            message: "Department Name (Leave Empty to Return)",
            filter: (result) => { 
                return result.substring(0,1).toUpperCase() + result.substring(1,30).toLowerCase();
            },
        }
    ]).then((response) => {
        const answer = response.answer;
        if(answer == "") {
            InitialPrompt();
            return;
        }
        addDepartment(answer);
    });
}

const addDepartment = async (depName) => {
    const sql = `INSERT INTO department(department_name)
                 VALUES("${depName}");`
    conn = await connection;            
    const res = await conn.query(sql);
    viewAllDepartments();
    await InitialPrompt();
};

const removeDepartment = async() => {
    const sql = `SELECT * FROM department;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const departments = [];
    departments.push("Exit");
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
        const department = response.Department;
        if(department == "Exit") { 
            InitialPrompt(); 
            return; 
        }
        sendQuery = async(department) => {
            console.log(department);
            const sql = `DELETE FROM department WHERE department_name="${department}";`            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllDepartments();
            await InitialPrompt();
        };
        sendQuery(department);
    });
};

const addRole = async () => {
    inquirer.prompt([
        {
            name: "roleName",
            type: "input",
            message: "New Role Name (Leave Empty to Return)",
        },
        {
            name: "salary",
            type: "number",
            message: "Role Pay(hourly)",
            default: "15.00",
        },
        {
            name: "departmentID",
            type: "number",
            message: "Role Department (Leave Empty to Return)",
        },
    ]).then((response) => {
        const { roleName, salary, departmentID } = response;
        console.log(departmentID);
        if(roleName == "" || isNaN(departmentID)) {
            InitialPrompt();
            return;
        }
        sendQuery = async(roleName, salary, departmentID) => {
            const sql = `INSERT INTO role(title, salary, department_id)
                 VALUES("${roleName}", ${salary}, ${departmentID});`
            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllRoles();
            await InitialPrompt();
        };
        sendQuery(roleName, salary, departmentID);
    });
};

const removeRole = async() => {
    const sql = `SELECT title FROM role;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const roles = [];
    roles.push("Exit");
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
        const role = response.Role;
        if(role == "Exit") {
            InitialPrompt();
            return;
        }
        sendQuery = async(role) => {
            const sql = `DELETE FROM role WHERE title="${role}";`            
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllRoles();
            await InitialPrompt();
        };
        sendQuery(role);
    });
};

const addEmployee = async(firstName, lastName, roleID) => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Employee First Name (Leave Empty to Return)",
        },
        {
            name: "lastName",
            type: "input",
            message: "Employee Last Name (Leave Empty to Return)",
        },
        {
            name: "roleID",
            type: "number",
            message: "Employee Role ID (Leave Empty to Return)",
        },
    ]).then((response) => {
        const { firstName, lastName, roleID } = response;
        if(firstName == "" || lastName == "" || roleID == null) {
            InitialPrompt();
            return;
        }
        sendQuery = async(firstName, lastName, roleID) => {
            const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                 VALUES("${firstName}", "${lastName}", ${roleID}, ${null});`
            
            conn = await connection; 
            const res = await conn.query(sql);
            viewAllEmployees();
            await InitialPrompt();
        };
        sendQuery(firstName, lastName, roleID);
    });
};

const removeEmployee = async() => {
    const sql = `SELECT * FROM employee;`;
    conn = await connection;     
    const res = await conn.query(sql);
    const employees = [];
    employees.push("Exit");
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
        const employee = response.Employee;
        if(employee == "Exit") {
            InitialPrompt();
            return;
        }
        sendQuery = async(first_name, last_name) => {
            const sql = `DELETE FROM employee WHERE first_name="${first_name}" AND last_name="${last_name}";`;
            conn = await connection;  
            const res = await conn.query(sql);
            viewAllEmployees();
            await InitialPrompt();
        };

        employee = employee.split(" ");
        sendQuery(employee[0], employee[1]);
    });
};

const departmentCosts = async() => {
    const sql = `SELECT department_id, SUM(salary) AS department_cost FROM role
    GROUP BY department_id;`;
    conn = await connection; 
    const res = await conn.query(sql);
    const names = [];

    for(let i = 0; i < res[0].length; i++) {
        //const departmentSQL = `SELECT department_name FROM department WHERE id=${i};`;
        const dsql = "SELECT * FROM department;";
        conn = await connection;
        const dres = await conn.query(dsql);
        names.push(dres[0][i].department_name);
        console.log("\n" + names[i] + " Department Cost: " + res[0][i].department_cost + "\n");
    }
    
    await InitialPrompt();
};

const updateEmployeeRole = async() => {
    const employeeSQL = `SELECT * FROM employee;`;
    conn = await connection;     
    const res = await conn.query(employeeSQL);
    const employees = [];
    for(let i = 0; i < res[0].length; i++) {
        employees.push(res[0][i].first_name + " " + res[0][i].last_name);
    }

    const roleSQL = `SELECT * FROM role;`;
    conn = await connection;
    const response = await conn.query(roleSQL);
    const roleNames = [];
    for(let i = 0; i < response[0].length; i++) {
        roleNames.push(response[0][i].title);
    }


    inquirer.prompt([
        {
            name: "employeeName",
            type: "list",
            choices: employees,
            message: "Employee",
        },
        {
            name: "roleTitle",
            type: "list",
            choices: roleNames,
            message: "New Role",
        }
    ]).then((response) => {
        const { employeeName, roleTitle } = response;
        const employeeNames = employeeName.split(" ");
        const roleID = convertTitleToID(roleTitle);

        sendQuery = async(firstName, lastName, roleID) => {
            const sql = `UPDATE employee
                     SET role_id = ${roleID}
                     WHERE first_name = "${firstName}"
                     AND last_name = "${lastName}";`
            conn = await connection; 
            const res = await conn.query(sql);
            viewAllEmployees();
            await InitialPrompt();
        };
        sendQuery(employeeNames[0], employeeNames[1], roleID);
    });    
};

const convertTitleToID = async(title) => {
    const sql = `SELECT id 
    FROM role
    WHERE title="${title}";`;
    conn = await connection;
    const response = await conn.query(sql);
    console.log(response[0]);
    return response[0].id;
};

InitialPrompt();
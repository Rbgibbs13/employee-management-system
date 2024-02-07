//const { last } = require("lodash");
const connection = require("../config/connection.js");
const { response } = require("express");
const inquirer = require("../../node_modules/inquirer");
const { count } = require("console");

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
    const res = await databaseQuery(sql);
    console.log(`\nid   department
--  -------------`);
    for(let i = 0; i < res[0].length; i++) {
        console.log(res[0][i].id + " :  " + res[0][i].department_name);
    };
    console.log("\n");
    await InitialPrompt();
};

const viewAllRoles = async () => {
    const sql = "SELECT * FROM role;";
    const res = await databaseQuery(sql);
    console.log(`
id   title   salary   department
------------------------------------`);
    for(let i = 0; i < res[0].length; i++) {
        let build = res[0][i].id + "  ";
        build += res[0][i].title + "  ";
        build += res[0][i].salary + "  ";
        build += res[0][i].department_id;
        console.log(build);
    };
    await InitialPrompt();
};

const viewAllEmployees = async () => {
    const sql = "SELECT * FROM employee;";
    const res = await databaseQuery(sql);
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
    const res = await databaseQuery(sql);
    viewAllDepartments();
    await InitialPrompt();
};

const removeDepartment = async() => {
    const sql = `SELECT * FROM department;`;
    const res = await databaseQuery(sql);
    const departments = [];
    departments.push("Exit");
    for(let i = 0; i < res[0].length; i++) {
        departments.push(res[0][i].department_name);
    };
    
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
            const res = await databaseQuery(sql);
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
                 VALUES("${roleName}", ${salary}, ${departmentID});`;
            const res = await databaseQuery(sql);
            viewAllRoles();
            await InitialPrompt();
        };
        sendQuery(roleName, salary, departmentID);
    });
};

const removeRole = async() => {
    const sql = `SELECT title FROM role;`;
    const res = await databaseQuery(sql);
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
            const sql = `DELETE FROM role WHERE title="${role}";`;
            const res = await databaseQuery(sql);
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
                 VALUES("${firstName}", "${lastName}", ${roleID}, ${null});`;
            const res = await databaseQuery(sql);
            viewAllEmployees();
            await InitialPrompt();
        };
        sendQuery(firstName, lastName, roleID);
    });
};

const removeEmployee = async() => {
    const sql = `SELECT * FROM employee;`;
    const res = await databaseQuery(sql);
    const employees = [];
    employees.push("Exit");
    for(let i = 0; i < res[0].length; i++) {
        employees.push(res[0][i].first_name + " " + res[0][i].last_name);
    };
    
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
            const res = await databaseQuery(sql);
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
    const res = await databaseQuery(sql);

    //Number of employees per role
    const roleCountsql = `SELECT role_id, COUNT(role_id) AS employee_count FROM employee
    GROUP BY role_id;`;
    const countResponse = await databaseQuery(roleCountsql);
    // role_id => departments
    const roleSql = `SELECT * FROM role;`;
    const roleResponse = await databaseQuery(roleSql);
    // employees => role_id => departments
    const departmentSql = "SELECT * FROM department;";
    const departmentRes = await databaseQuery(departmentSql);
    console.log("\n");
    for(let i = 0; i < departmentRes[0].length; i++) {
        let deptEmployeeSum = 0;
        let cost = 0;
        for(let k = 0; k < roleResponse[0].length; k++) {
            if(departmentRes[0][i].id == roleResponse[0][k].department_id) {
                console.log(departmentRes[0][i].id + " : " + roleResponse[0][k].department_id);
                deptEmployeeSum += countResponse[0][k].employee_count;
            };
        };
        cost = deptEmployeeSum * res[0][i].department_cost;
        console.log(departmentRes[0][i].department_name + " Employee => " + deptEmployeeSum);
        console.log("" + departmentRes[0][i].department_name + " Department Cost: $" + cost + "\n");
    };
    
    await InitialPrompt();
};

const updateEmployeeRole = async() => {
    const employeeSQL = `SELECT * FROM employee;`;  
    const res = await databaseQuery(employeeSQL);
    const employees = [];
    for(let i = 0; i < res[0].length; i++) {
        employees.push(res[0][i].first_name + " " + res[0][i].last_name);
    };

    const roleSQL = `SELECT * FROM role;`;
    const response = await databaseQuery(roleSQL);
    const roleNames = [];
    for(let i = 0; i < response[0].length; i++) {
        roleNames.push(response[0][i].title);
    };

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
            const res = await databaseQuery(sql);
            viewAllEmployees();
            await InitialPrompt();
        };
        sendQuery(employeeNames[0], employeeNames[1], roleID);
    });    
};

const databaseQuery = async(input) => {
    conn = await connection; 
    const res = await conn.query(input);
    return res;
}

const convertTitleToID = async(title) => {
    const sql = `SELECT id 
    FROM role
    WHERE title="${title}";`;
    const response = await databaseQuery(sql);
    return response[0].id;
};

InitialPrompt();
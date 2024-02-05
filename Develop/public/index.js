const inquirer = require("../../node_modules/inquirer");
const connection = require("../config/connection");
conn = await connection;

employees = await conn.query(selectEmployeesQuery);

inquirer.prompt([
    {

    }
]).then((response) => {

});
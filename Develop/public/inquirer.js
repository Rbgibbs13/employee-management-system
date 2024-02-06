const { error } = require("console");
const inquirer = require("../../node_modules/inquirer");

inquirer.prompt([
    {
        name: "title",
        type: "input",
        message: "Hello World",
    }
]).then((answers) => {

}).catch((error) => {

});
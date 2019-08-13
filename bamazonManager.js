var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "@gxYSCx&Y%sf",
    database: "bamazon_db"
});

const afterConnection = () => {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        connection.end();
    });
}

function start() {
    inquirer
        .prompt({
            name: "choices",
            type: "list",
            message: "Hello, Bamazon Manager. What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"]
        })
        .then(function (answer) {

            switch (answer.choices) {
                case ("View Products for Sale"):
                    displayInfo();
                    break;
                case ("View Low Inventory"):
                    // lowInventory();
                    break;
                case ("Add to Inventory"):
                    // addToInventory();
                    break;
                case ("Add New Product"):
                    // addNewProduct();
                    break;
                default:
                    console.log("Select an option")
                    start();
            }
        })
};

const displayInfo = () => {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['id', 'product', 'department', 'price', 'in-stock'],
            colWidths: [5, 75, 15, 12, 12],
        });

        for (let i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_amount, res[i].stock_quantity]);
        }
        console.log(table.toString());
        connection.end();
    })
};

start();

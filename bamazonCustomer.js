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

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        connection.end();
    });
}

const buyProduct = () => {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;
        // console.log(res);
        // console.log(res.affectedRows + ' product inserted!\n');
        // Call updateProduct AFTER the INSERT completes
        // displayInfo();

        inquirer.prompt([
            {
                name: "name",
                type: "rawlist",
                message: "What is the id of the product you want to buy?",
                choices: function () {
                    const choicesArr = [];
                    for (let i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].product_name);
                    }
                    choicesArr.push(new inquirer.Separator());
                    return choicesArr;
                },
            },
            {
                name: "units",
                type: "number",
                message: "How many units would you like to buy",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(answers => {
            const name = answers.name;
            const units = parseInt(answers.units);

            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === answers.name) {
                chosenItem = results[i];
              }
            };
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: function (units) {
                            const newStockQuantity = stock_quantity - units;
                            return newStockQuantity;
                        }
                    },
                    {
                        product_name: chosenItem.id
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log("Bid placed successfully!");
                    start();
                }
            );
            afterConnection();
        })
        // console.log('Placing order for ' + units + 'units for ' + name + '...\n');

    });

};
buyProduct();

const testInq = () => {
    inquirer.prompt([
        {
            name: "choice",
            type: "rawlist",
            choices: [1, 2, 3],
            message: "choose a number"
        },
        {
            name: "number",
            type: "number",
            message: "how many"
        }
    ]).then(answers => {
        console.log(answers);
    })
}
// testInq();

const displayInfo = () => {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        var table = new Table({
            head: ['id', 'product', 'department', 'price', 'in-stock'],
            colWidths: [5, 75, 15, 12, 12],
        });

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity + "\n");
            console.log(res[i].stock_quantity);
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_amount, res[i].stock_quantity]);
        }
        console.log(table.toString());

    })
};
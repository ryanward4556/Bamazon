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


// async function displayInfo(cb) {

//     connection.query("SELECT * FROM products", function (err, res) {
//         if (err) throw err;

//         var table = new Table({
//             head: ['id', 'product', 'department', 'price ($)', 'in-stock', 'sales ($)'],
//             colWidths: [5, 75, 15, 12, 12, 12],
//         });

//         for (let i = 0; i < res.length; i++) {
//             // console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity + "\n");
//             // console.log(res[i].stock_quantity);
//             table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_amount, res[i].stock_quantity, res[i].product_sales]);
//         }
//         // const boughtProduct = await cb();
//         console.log(table.toString());

//     })
// };

function buyProduct() {
    console.log(connection);

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

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
            let chosenItem;
            let chosenItemStock;
            let productSales;
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === name) {
                    chosenItem = res[i];
                    chosenItemStock = chosenItem.stock_quantity
                    // if (chosenItemStock < units) {
                    //     console.log("Only " + chosenItemStock + " in stock. Let's try this again")
                    //     // connection.end();
                    //     buyProduct();
                    // } else {
                    chosenItemStock = chosenItemStock - units;
                    productSales = chosenItemStock * chosenItem.price_amount;
                    // }
                }
            };

            connection.query(
                "UPDATE products SET ?,? WHERE ?",
                [
                    {
                        stock_quantity: chosenItemStock
                    },
                    {
                        product_sales: productSales
                    },
                    {
                        product_name: chosenItem.product_name
                    }
                ], function (err) {
                    if (err) throw err;
                    console.log("Bid placed successfully!");
                    connection.end();
                }
            );
            // console.log(res.affectedRows + ' product inserted!\n');
        })
        // console.log('Placing order for ' + units + 'units for ' + name + '...\n');

    });

};
buyProduct();

// displayInfo(buyProduct);


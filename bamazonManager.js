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
            message: "Hello, Bamazon Manager. What would you like to do?\n\n",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "---Exit Bamazon---"]
        })
        .then(function (answer) {

            switch (answer.choices) {
                case ("View Products for Sale"):
                    displayInfo();
                    break;
                case ("View Low Inventory"):
                    lowInventory();
                    break;
                case ("Add to Inventory"):
                    addToInventory();
                    break;
                case ("Add New Product"):
                    addNewProduct();
                    break;
                case ("---Exit Bamazon---"):
                    connection.end();
                    break;
                default:
                    console.log("Select an option")
                    start();
            }
        })
};

const cliTableTemplate = (res) => {
    const table = new Table({
        head: ['id', 'product', 'department', 'price', 'in-stock'],
        colWidths: [5, 75, 15, 12, 12],
    });

    for (let i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_amount, res[i].stock_quantity]);
    }
    console.log(table.toString());
}

const displayInfo = () => {

    connection.query("SELECT * FROM products", function (err, res) {

        if (err) { throw err }
        else {
            cliTableTemplate(res);
            start();
        }

    })
};

const lowInventory = () => {

    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {

        if (err) { throw err }
        else {
            cliTableTemplate(res)
            start()
        }
    })
};

const addNewProduct = () => {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "\nWhat is the name of the product you'd like to add to the inventory?",
        },
        {
            name: "dept",
            type: "input",
            message: "\nWhat is the department of this product?",
        },
        {
            name: "price",
            type: "number",
            message: "\nWhat is the price of this product?",
        },
        {
            name: "stock",
            type: "input",
            message: "\nHow much stock of this product are you adding to the inventory?",
        }
    ]).then(function (answer) {
        const name = answer.name;
        const dept = answer.dept;
        const price = parseInt(answer.price);
        const stock = parseInt(answer.stock);

        const sql = "INSERT INTO products (product_name, department_name, price_amount, stock_quantity) VALUES ('" + name + "', '" + dept + "','" + price + "','" + stock + "')";

        connection.query(sql, function (err, res) {
            if (err) { throw err }
            else {
                console.log(name + " was added to inventory!")
            }
        })
    });

}

const addToInventory = () => {

    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the id of the product where you'd like to add more inventory?",
        },
        {
            name: "stock",
            type: "number",
            message: "How much stock would you like to add to the inventory?",
        },

    ]).then(function (answer) {
        const id = parseInt(answer.id);
        let addStock = parseInt(answer.stock);
        let newStock = 0;

        connection.query("SELECT * FROM products", function (err, res) {
            if (err) { throw err }
            else {
                for (let i = 0; i < res.length; i++) {

                    if (id === res[i].item_id) {
                        const oldStock = parseInt(res[i].stock_quantity);
                        newStock = addStock + oldStock;
                    }
                }
            }
        })

        const sql = "UPDATE products SET stock_quantity=" + addStock + " WHERE item_id=" + id + ";";

        connection.query(sql, function (err, res) {
            if (err) { throw err }
            else {
                console.log("\n" + addStock + " units of Product ID: " + id + " was added to inventory!\n\nCurrent stock: " + newStock + "\n\n");
                start();
            };
        })

    });
}


start();

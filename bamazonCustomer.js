var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');


var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
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

inquirer
    .prompt([
        {
            message: "What is the id of the product you want to buy?",
            type: "number",
            name: "id",
        },
        {
            message: "How many units would you like to buy",
            type: "number",
            name: "unitsWanted",
        }
    ])
    .then(answers => {

        let id = answers.id;
        let units = parseInt(answers.unitsWanted);
        console.log(id);
        console.log(units);
        displayInfo();
        // postItem(name, price, category);
        // displayInfo();
    });


const postItem = (name, price, category) => {

    console.log('Inserting a new product...\n');
    var query = connection.query(
        'INSERT INTO products SET ?',
        {
            name: name,
            price: price,
            category: category,
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' product inserted!\n');
            // Call updateProduct AFTER the INSERT completes
            displayInfo();
        },
    );
};

const displayInfo = () => {
    connection.query("SELECT * FROM products", function (err, res) {

        if (err) throw err;

        var table = new Table({
            head: ['id', 'product', 'department', 'price', 'in-stock'],
            colWidths: [5, 50, 15, 12, 12],
        });

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity + "\n");
            console.log(res[i].stock_quantity);
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price_amount, res[i].stock_quantity]);
        }
        console.log(table.toString());

    })
    afterConnection();
};
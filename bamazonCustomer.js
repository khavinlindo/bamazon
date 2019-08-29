

var mysql = require("mysql");
var inquirer = require("inquirer");
var password = require("./keys");


var con = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: password.password, 
  database: "bamazon"
});


con.connect(function(err) {
    if (err) {
        console.log("ERROR!!! Check connection"+ err);
    }

    //console.log("Connected\n");
    displayProducts();   
});



function displayProducts() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products"
    con.query(query, function(err, res) {
        if (err) {
            console.log("ERROR from display products: "+err);
        }

        console.log("\n")
        for (var i=0;i<res.length;i++) {
            console.log(res[i].item_id + " | " + res[i].product_name+ " | $" + res[i].price);
        }
        console.log("\n")
        buyProducts();
    })
    
}



function buyProducts() {

    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What is the ID of the product you would like to buy? "
        }, 
        {
            name: "units",
            type: "input",
            message: "How many units of the product would you like to buy?"
        }
    ]).then(function(res) {
       var reqId = parseInt(res.id);
       var reqUnits = parseInt(res.units);
       var newQuantity;
       var totalPrice;

    
       var queryForId = "SELECT stock_quantity, price FROM products WHERE item_id="+reqId;

       con.query(queryForId, function(err, res) {
           if (err) {
               console.log("ERROR from prompt: "+err);
           }
           //console.log(res);
  
             if (res[0].stock_quantity < reqUnits) {
                 console.log("\n")
                console.log("Sorry, Insufficient quantity!");
            }
     
            if(res[0].stock_quantity >= reqUnits) 
            {
                newQuantity = (res[0].stock_quantity - reqUnits);
                //console.log(newQuantity);
                updateQuantity(newQuantity, reqId);
                 
                totalPrice = res[0].price * reqUnits;
                console.log("\nTotal Price of purchase is: $"+totalPrice.toFixed(2));
            }   
            
       });
    })
}

function updateQuantity(units, id) {
    var query = "UPDATE products SET ? WHERE ?";

    con.query(query, 
        [
         {
            stock_quantity: units
         },
         {
           item_id: id
         }
        ],
        function(err, res) {
            if (err) {
                console.log("ERROR on updating quantity: "+err);
            }
            
        });
}


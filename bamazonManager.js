

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

    console.log("\n");
    options();
});



function viewAllProducts() {
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products"
    con.query(query, function(err, res) {
        if (err) {
            console.log("ERROR!!!!: "+err);
        }

        for (var i=0;i<res.length;i++) {
            console.log(res[i].item_id + " | " + res[i].product_name+ " | $" + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n")
    });

}

function viewLowInventory() {
    var query = "SELECT product_name, stock_quantity FROM products"
    con.query(query, function(err, res) {
        if (err) {
            console.log("ERROR from display products: "+err);
        }

        console.log("\n")
          var lowInventory = false;
        
          var items = [];
          for (var i=0;i<res.length;i++) {
            if (res[i].stock_quantity < 5) {
                items.push(res[i].product_name);
                lowInventory = true;
            }    
        }
 
        if (lowInventory) {
            console.log("These are the items with low inventory: ")
            for (i=0;i<items.length;i++) {
                console.log(items[i]);
            }
        }

        if(!lowInventory) {
            console.log("All products are fully stocked!!!");
        }
    });
}

function addMore() {
   inquirer.prompt([
       {
           name: "id",
           type: "input",
           message: "What item would you like to add to inventory? Please provide item ID: "
       },
       {
           name: "amount",
           type: "input",
           message: "How much more would you like to add?"
       }
   ]).then(function(res) {
       var id = parseInt(res.id);
       var amount = parseInt(res.amount);
       var updatedAmount;

       var query = "SELECT stock_quantity, product_name FROM products WHERE item_id="+id;
       var queryUpdate = "UPDATE products SET ? WHERE ?"

       con.query(query, function(err, res) {
           if (err) {
             console.log("ERROR!!!! "+err);
           }

           console.log("\n");
            
          updatedAmount = amount + res[0].stock_quantity;

          //console.log(updatedAmount);
          con.query(queryUpdate, 
           [
               {
                   stock_quantity: updatedAmount
               },
               {
                   item_id: id
               }
           ], 
           function(err, res) {
               
               if (err) {
                   console.log("ERROR!!!! "+err);
                 } 
       });
             console.log(res[0].product_name+ " inventory has been updated!")
    });
            
   });
}

function addNewProduct() {
  inquirer.prompt([
      {
          name: "name",
          type: "input",
        message: "What is the product you would like to add?"
      },
      {
          name: "department",
          type: "input",
          message: "What department will the product be located?"
      },
      {
          name: "price",
          type: "input",
          message: "What will be the price of the product?"
      },
      {
          name: "stock",
          type: "input",
          message: "How many will be available?"
      }
  ]).then(function(res) {
      var query = "INSERT INTO products SET ?"

      var priceOfItem = parseFloat(res.price);
      var stock = parseInt(res.stock);
      con.query(query,
          {
              product_name: res.name,
              department_name: res.department,
              price: priceOfItem,
              stock_quantity: stock
          },
          function(err, res) {
             if (err) {
                 console.log("ERROR!!!! "+err)
             }
      });

      console.log("\n"+res.name+" has been added to inventory!");
  });
}

function options() {
    inquirer.prompt([
    {
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
]).then(function(res) {
    switch (res.options) {
        
        case "View Products for Sale":
        console.log("\n")
        viewAllProducts();
        break;

        case "View Low Inventory":
        viewLowInventory();
        break;

        case "Add to Inventory":
        addMore();
        break;

        case "Add New Product":
        addNewProduct();
        break;
    }
});
}



DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE products (

  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,

  product_name VARCHAR(45),

  department_name VARCHAR(45),

  price DECIMAL(10, 2),

  stock_quantity INTEGER(10) NOT NULL,

  PRIMARY KEY (item_id)

);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Notebook", "Office Supplies", 5.50, 10), ("Mechanical pencils", "Office Supplies", 2.50, 20),
       ("Laptop", "Electronics", 250.00, 15), ("TV", "Electronics", 300.00, 25),
       ("Love Seat", "Home Decor & Accessories", 200.00, 15), ("Lamp", "Home Decor & Accessories", 25.00, 15),
       ("Hose", "Outdoor", 7.25, 17), ("Rake", "Outdoor", 8.74, 18),
       ("iPhone 8", "Cellphone & Accessories", 400.00, 10), ("iPhone 8 screen protector", "Cellphone & Accessories", 10.00, 30);


SELECT * FROM products;



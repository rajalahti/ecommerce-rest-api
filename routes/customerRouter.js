const express = require("express");
const customerRouter = express.Router();

const pool = require("../db");
const { generateInteger } = require("../utils/utils");

// Route for customer registration (POST /customers/register)
customerRouter.post("/register", async (req, res) => {
  try {
    const randomId = generateInteger();
    const {
      first_name,
      last_name,
      street_address,
      postal_code,
      city,
      email,
      password_hash,
    } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customer (customer_id, first_name, last_name, street_address, postal_code, city, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        randomId,
        first_name,
        last_name,
        street_address,
        postal_code,
        city,
        email,
        password_hash,
      ]
    );
    res.json(newCustomer.rows[0]);
  } catch (err) {
    console.log(err.message);
    if (err.code === "23505") {
      res.json("A customer already exists with that email address");
    } else {
      res.json("Error - failed to register a new customer");
    }
  }
});

// Get customers (GET /)
customerRouter.get("/", async (req, res) => {
  try {
    const allCustomers = await pool.query("SELECT * FROM customer");
    res.json(allCustomers.rows);
  } catch (err) {
    console.log(err.message);
    res.json("Error - failed to retrieve customers");
  }
});

// Get customers by id (GET /:id)
customerRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundCustomer = await pool.query(
      "SELECT * FROM items WHERE item_id = $1",
      [id]
    );
    if (foundCustomer.rows.length > 0) {
      res.json(foundCustomer.rows[0]);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Error - could not get customer info");
  }
});

// Modify user (PUT /:id)
customerRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      street_address,
      postal_code,
      city,
      email,
      password_hash,
    } = req.body;
    const updatedCustomer = await pool.query(
      "UPDATE customer SET first_name = $1, last_name = $2, street_address = $3, postal_code = $4, city = $5, email = $6, password_hash = $7 RETURNING *",
      [
        first_name,
        last_name,
        street_address,
        postal_code,
        city,
        email,
        password_hash,
      ]
    );
    res.json(updatedCustomer.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Error - could not update customer info");
  }
});

module.exports = customerRouter;

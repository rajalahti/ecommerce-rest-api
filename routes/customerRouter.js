const express = require("express");
const customerRouter = express.Router();

const pool = require("../db");
const { generateInteger } = require("../utils/utils");

customerRouter.post("/", async (req, res) => {
    try {
        const randomId = generateInteger();
        const { first_name, last_name, street_address, postal_code, city, email, password_hash } = req.body;
        const newCustomer = await pool.query(
            "INSERT INTO customer (customer_id, first_name, last_name, street_address, postal_code, city, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [randomId, first_name, last_name, street_address, postal_code, city, email, password_hash]
          );
          res.json(newCustomer.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.json('Error - failed to register a new customer')
    }
});




module.exports = customerRouter;
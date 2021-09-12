const express = require('express');
const itemRouter = express.Router();

const pool = require('../db');
const { generateInteger } = require('../utils/utils');

// Create an item (POST)
itemRouter.post("/", async (req, res) => {
    try {
        const { name, desc, price, thumb, image } = req.body;
        console.log(req.body)
        const randomId = generateInteger();
        const newItem = await pool.query(
            "INSERT INTO items (item_id, item_name, item_desc, price, thumbnail, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [randomId, name, desc, price, thumb, image]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.log(err.message);
        res.json('Error - Failed to create a new item')
    }
})

// Get all items (GET / )
itemRouter.get("/", async (req, res) => {
    try {
        const allItems = await pool.query("SELECT * FROM items");
        res.json(allItems.rows);
    } catch (err) {
        console.log(err.message);
        res.json('Error - could not get items')
    }
})

// Get one item (GET /:id )

// Update an item (PUT)

// Delete an item (DELETE)

module.exports = itemRouter;

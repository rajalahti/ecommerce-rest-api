const express = require("express");
const itemRouter = express.Router();

const pool = require("../db");
const { generateInteger } = require("../utils/utils");

// Create an item (POST)
itemRouter.post("/", async (req, res) => {
  try {
    const { name, desc, price, thumb, image, category } = req.body;
    const randomId = generateInteger();
    const newItem = await pool.query(
      "INSERT INTO items (item_id, item_name, item_desc, price, thumbnail, image, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [randomId, name, desc, price, thumb, image, category]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.json("Error - Failed to create a new item");
  }
});

// Get all items (GET / ) or get by category (GET /?category=xxxxxx)
itemRouter.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let allItems = [];
    if (!category) {
      allItems = await pool.query("SELECT * FROM items");
    } else if (category) {
        allItems = await pool.query("SELECT * FROM items WHERE category = $1", [category]);
    }
    res.json(allItems.rows);
  } catch (err) {
    console.log(err.message);
    res.json("Error - could not get items");
  }
});

// Get one item (GET /:id )
itemRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await pool.query(
      "SELECT * FROM items WHERE item_id = $1",
      [id]
    );
    if (foundItem.rows.length > 0) {
      res.json(foundItem.rows[0]);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Error - could not get the item");
  }
});

// Update an item (PUT)
itemRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, price, thumb, image, category } = req.body;
    const updatedItem = await pool.query(
      "UPDATE items SET item_name = $1, item_desc = $2, price = $3, thumbnail = $4, image = $5, category = $6 WHERE item_id = $7 RETURNING *",
      [name, desc, price, thumb, image, category, id]
    );
    res.status(200).json(updatedItem.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Error - could not update the item");
  }
});

// Delete an item (DELETE)
itemRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE item_id = $1", [id]);
    res.status(204).json("Item deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Error - could not delete the item");
  }
});

module.exports = itemRouter;

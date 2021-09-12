require('dotenv').config()
const express = require('express');
const app = express();
const cors = require ('cors');

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
// Itemrouter
const itemRouter = require('./routes/itemRouter');
app.use('/items', itemRouter);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
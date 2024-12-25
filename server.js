const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.SERVER_URL || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
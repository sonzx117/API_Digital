const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/database');
const initRoutes = require('./routes');

const app = express();
const port = process.env.SERVER_URL || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
dbConnect();
initRoutes(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
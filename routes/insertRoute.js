const express = require('express');
const ctrls = require('../controllers/insertData');
const router = express.Router();

//Insert Data

router.post('/', ctrls.insertProduct);


module.exports = router;
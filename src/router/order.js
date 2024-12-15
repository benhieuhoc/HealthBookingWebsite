const express = require('express');
const router = express.Router();

const ordercontroller = require('../app/controllers/orderController');

router.get('/show-by-iddoctor', ordercontroller.show);

module.exports = router;
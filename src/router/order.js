const express = require('express');
const router = express.Router();

const ordercontroller = require('../app/controllers/orderController');

router.post('/create', ordercontroller.create);

module.exports = router;
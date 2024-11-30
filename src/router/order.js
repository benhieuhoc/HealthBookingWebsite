const express = require('express');
const router = express.Router();

const ordercontroller = require('../app/controllers/orderController');

router.get('/createorder', ordercontroller.createorder);    
router.get('/selectdoctor', ordercontroller.selectdoctor);
router.get('/detail/:id', ordercontroller.showdetail);
router.post('/addorder', ordercontroller.addorder);
router.patch('/checkin/:id', ordercontroller.checkin);
router.patch('/setdone/:id', ordercontroller.setdone);

module.exports = router;
const express = require('express');
const router = express.Router();
const doctorcontroller = require('../app/controllers/doctorControler');

router.get('/calender', doctorcontroller.calender);

module.exports = router;


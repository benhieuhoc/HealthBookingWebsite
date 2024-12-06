const express = require('express');
const router = express.Router();

const bookingcontroller = require('../app/controllers/bookingController');

router.post("/dat-lich-kham", bookingcontroller.datLichKham);

module.exports = router;

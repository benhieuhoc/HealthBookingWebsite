const express = require('express');
const router = express.Router();

const bookingcontroller = require('../app/controllers/bookingController');

router.post("/dat-lich-kham", bookingcontroller.datLichKham);
router.get("/show-booking", bookingcontroller.show);
router.patch('/checkin/:id', bookingcontroller.checkin);

module.exports = router;

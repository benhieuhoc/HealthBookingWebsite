const express = require('express');
const router = express.Router();
const AuthenDoctor = require("../app/middlewares/AuthenDoctor");

const bookingcontroller = require('../app/controllers/bookingController');

router.post("/dat-lich-kham", bookingcontroller.datLichKham);
router.get("/show-booking", bookingcontroller.show);
router.patch('/checkin/:id', AuthenDoctor, bookingcontroller.checkin);
router.get("/show-all-booking", bookingcontroller.showall);
router.delete("/delete/:id", bookingcontroller.delete);

module.exports = router;

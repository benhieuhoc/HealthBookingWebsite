const express = require('express');
const router = express.Router();

const shiftcontroller = require('../app/controllers/shiftController');

router.get('/show-all-shift', shiftcontroller.showallshift);
// Lấy thời gian khám của bác sĩ theo ngày
router.get('/get-time-slot', shiftcontroller.getTimeSlotsByDoctorAndDate)

module.exports = router;
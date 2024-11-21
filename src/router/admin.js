const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/adminController');

router.get('/createdoctor', admincontroller.createDoctor);
router.post('/adddoctor', admincontroller.addDoctor);
router.get('/managerdoctor', admincontroller.managerDoctor);

module.exports = router;


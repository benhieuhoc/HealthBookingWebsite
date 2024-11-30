const express = require('express');
const router = express.Router();
const admincontroller = require('../../app/controllers/adminController');

router.get('/managerdoctor', admincontroller.managerDoctor);
router.get('/createdoctor', admincontroller.createDoctor);
router.post('/adddoctor', admincontroller.addDoctor);
router.delete('/deletedoctor', admincontroller.deleteDoctor);
router.get('/managerdepartment', admincontroller.managerDepartment);
router.get('/createcalender', admincontroller.createCalender);
router.post('/adddcalender', admincontroller.addCalender);
router.get('/managercalender', admincontroller.managerCalender);
router.get('/managerorder', admincontroller.managerOrder)
router.delete('/force_order', admincontroller.deleteOrder)
router.get('/manageruser', admincontroller.managerUser)


module.exports = router;


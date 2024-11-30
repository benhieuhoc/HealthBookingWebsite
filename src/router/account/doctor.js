const express = require('express');
const router = express.Router();
const doctorcontroller = require('../../app/controllers/doctorControler');

router.post('/create-doctor',doctorcontroller.create);
router.post('/login-doctor', doctorcontroller.login);
router.post('/logout-doctor', doctorcontroller.logout);
router.get('/show-all-doctor', doctorcontroller.showall);
router.get('/show-doctor-byId', doctorcontroller.showbyid);
router.get('/show-doctor-by-department', doctorcontroller.showbydepartment);
router.put('/update-doctor', doctorcontroller.update);
router.delete('/delete-doctor', doctorcontroller.delete)


// Dùng cho page đặt lịch
router.get('/show-doctor-whith-listbooking', doctorcontroller.showwithbooking)


module.exports = router;


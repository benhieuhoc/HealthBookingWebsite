const express = require('express');
const router = express.Router();
const AuthenAdmin = require('../../app/middlewares/AuthenAdmin')
const doctorcontroller = require('../../app/controllers/doctorControler');
const upload = require('../../app/controllers/uploadController');

router.post('/create-doctor', AuthenAdmin, doctorcontroller.create);
router.post('/login-doctor', doctorcontroller.login);
router.post('/logout-doctor', doctorcontroller.logout);
router.get('/show-all-doctor', doctorcontroller.showall);
router.get('/show-doctor-byId', doctorcontroller.showbyid);
router.get('/show-doctor-by-department', doctorcontroller.showbydepartment);
router.put('/update-doctor', doctorcontroller.update);
router.delete('/delete-doctor/:id', AuthenAdmin, doctorcontroller.delete);

// thêm lịch khám
router.post('/add-shift', doctorcontroller.addshift);

// Dùng cho page đặt lịch
router.get('/show-doctor-with-listbooking', doctorcontroller.showwithbooking);

// Hàm dùng chung để upload ảnh
router.post('/upload',upload.uploadFile);


module.exports = router;


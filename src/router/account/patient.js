const express = require('express');
const router = express.Router();
const patientcontroller = require('../../app/controllers//patientController');

router.post('/login-patient', patientcontroller.login);
router.post('/logout-patient', patientcontroller.logout);
router.post('/register-patient', patientcontroller.register);
router.get('/infor/:id', patientcontroller.infor);
router.put('/update', patientcontroller.update);
router.patch('/change-pasword', patientcontroller.password);
router.patch('/change-avata', patientcontroller.avata);

module.exports =  router;

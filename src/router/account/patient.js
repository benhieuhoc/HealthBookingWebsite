const express = require('express');
const router = express.Router();
const patientcontroller = require('../../app/controllers//patientController');

router.post('/login-patient', patientcontroller.login);
router.post('/logout-patient', patientcontroller.logout);
router.post('/register-patient', patientcontroller.register);

module.exports =  router;

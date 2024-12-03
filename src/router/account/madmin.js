const express = require('express');
const router = express.Router();
const Madmincontroller = require('../../app/controllers/madminController');

router.post('/login-madmin', Madmincontroller.login);
router.post('/logout-madmin', Madmincontroller.logout);


module.exports = router;


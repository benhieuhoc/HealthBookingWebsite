const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/siteController');

router.get('/home', sitecontroller.home);
router.get('/booking', sitecontroller.booking);

module.exports = router;

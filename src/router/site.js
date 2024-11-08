const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/siteController');

router.get('/', sitecontroller.home);

module.exports = router;

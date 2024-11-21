const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/siteController');

router.get('/home', sitecontroller.home);
router.post('/home', sitecontroller.sighin);
router.get('/booking', sitecontroller.booking);
router.get('/logout', sitecontroller.logout);
router.post('/register', sitecontroller.register);
router.get('/', sitecontroller.login);




module.exports = router;

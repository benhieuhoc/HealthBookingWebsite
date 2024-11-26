const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/siteController');

router.get('/home', sitecontroller.home);
router.post('/home', sitecontroller.sighin);
router.get('/profile', sitecontroller.profile);
router.get('/editprofile', sitecontroller.editprofile);
router.put('/updateprofile', sitecontroller.updateprofile);
router.get('/logout', sitecontroller.logout);
router.post('/register', sitecontroller.register);
router.get('/', sitecontroller.login);




module.exports = router;

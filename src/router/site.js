const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/siteController');

router.post('/login-patinet', sitecontroller.login);
router.get('/profile', sitecontroller.profile);
router.put('/updateprofile', sitecontroller.updateprofile);
router.get('/password', sitecontroller.password);
router.patch('/updatepassword', sitecontroller.updatepassword);
router.get('/logout', sitecontroller.logout);
router.post('/register', sitecontroller.register);




module.exports = router;

const express = require('express');
const router = express.Router();
const sitecontroller = require('../app/controllers/siteController');


router.get('/profile', sitecontroller.profile);
router.put('/updateprofile', sitecontroller.updateprofile);
router.get('/password', sitecontroller.password);
router.patch('/updatepassword', sitecontroller.updatepassword);





module.exports = router;

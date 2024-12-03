const express = require('express');
const router = express.Router();
const admincontroller = require('../../app/controllers/adminController');

router.post('/login-admin', admincontroller.login);
router.post('/logout-admin', admincontroller.logout);
router.post('/create-admin', admincontroller.create);
router.delete('/delete-admin/:id', admincontroller.delete);
router.get('/show-all-admin', admincontroller.showall);


module.exports = router;


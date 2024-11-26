const express = require('express');
const router = express.Router();
const Madmincontroller = require('../app/controllers/madminController');

router.get('/createdepartment', Madmincontroller.createDepartment);
router.post('/adddepartment', Madmincontroller.addDepartment);
router.delete('/removedepartment', Madmincontroller.removeDepartment);
router.get('/manageradmin', Madmincontroller.managerAdmin);
router.get('/createadmin', Madmincontroller.createAdmin);
router.post('/adddeadmin', Madmincontroller.addAdmin);
router.get('/createadmin', Madmincontroller.createAdmin);
router.get('/force-dlt-order', Madmincontroller.listdDltOrdeer);
router.patch('/restore/:id', Madmincontroller.restore);



module.exports = router;


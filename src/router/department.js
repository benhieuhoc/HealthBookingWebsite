const express = require('express');
const router = express.Router();
const departmentcontroller = require('../app/controllers/departmentCoctroller');

router.post('/create-department', departmentcontroller.create);
router.get('/show-all-department', departmentcontroller.showall);
router.get('/show-one-department', departmentcontroller.showone);
router.put('/update-department', departmentcontroller.update);
router.delete('/delete-department/:id', departmentcontroller.deltete);

module.exports = router;

const express = require('express');
const router = express.Router();
const clinicController = require('../app/controllers/clinicController');

router.get("/show-all-clinic", clinicController.showall);
router.delete("/delete-clinic/:id", clinicController.delete);
router.post('/create-clinic', clinicController.create);
router.post('/update-clinic', clinicController.update);

module.exports = router;

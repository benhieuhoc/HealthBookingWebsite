const express = require('express');
const router = express.Router();

const positioncontroller = require('../app/controllers/positionController');

router.post('/create-position', positioncontroller.create);
router.get('/show-all-position', positioncontroller.showall);
router.put('/update-position', positioncontroller.update);
router.delete('/delete-position/:id', positioncontroller.delete);

module.exports = router;
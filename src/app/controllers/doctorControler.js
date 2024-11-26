const Department = require ('../models/department');
const Order = require ('../models/Order');
const User = require ('../models/User');
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class DoctorController {

    // Get /doctor/calender
    calender(req,res,next){
        Order.find({doctorName: res.locals.user.name})
        .then((order) => {
            // res.json({order});
            res.render('./doctor/calender', {
                order: mutipleMongoosetoObject(order)
            })
        })
        .catch(next);
    }

};

module.exports = new DoctorController;

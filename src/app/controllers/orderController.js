const Department = require ('../models/department');
const Calender = require ('../models/Calender');
const Order = require ('../models/Order');
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class OrderController {
    // Get /order/createorder
    createorder(req,res,next){
        Department.find({})
        .then((department) => {
            Calender.find({})
            .then((calender) => {
                res.render('./order/createorder', {
                    department: mutipleMongoosetoObject(department),
                    calender: mutipleMongoosetoObject(calender),
                })
            })
        })
        .catch(next);
        // res.json(req.body);
    }

    // Get /order/selectdoctor
    selectdoctor(req,res,next){
        Department.find({})
        .then((department) => {
            Calender.find({})
            .then((calender) => {
                // res.json({calender, department})
                res.render('./order/selectdoctor', {
                    department: mutipleMongoosetoObject(department),
                    calender: mutipleMongoosetoObject(calender),
                })
            })
        })
        .catch(next);
        
    }

    // Get /order/detail/:id
    showdetail(req,res,next){
        Order.findOne({_id: req.params.id})
        .then((order) => {
            res.json(order)
        })
    }

    // POST /order/create
    async addorder(req,res,next){
        const FormData = new Order({
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            department: req.body.department,
            doctorName: req.body.doctorName, 
            contact: req.body.contact,
            note: req.body.note,
            checkin: false,
            done: false,
        });
        // res.json(FormData);
        await FormData.save();
        res.redirect('/home');
    }
    
};


module.exports = new OrderController;

const Department = require ('../models/Department');
const Calender = require ('../models/Admin');
const Order = require ('../models/Admin');
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

    // Patch /order/checkin/:id
    checkin(req,res,next){
        Order.findOneAndUpdate({_id: req.params.id}, {checkin: true})
        .then(() => res.redirect('/doctor/calender'))
        .catch(next);
    }

    // Patch /order/setdone/:id
    setdone(req,res,next){
        Order.findOneAndUpdate({_id: req.params.id}, {done: true})
        .then(() => res.redirect('/doctor/calender'))
        .catch(next);
    }
    
};


module.exports = new OrderController;

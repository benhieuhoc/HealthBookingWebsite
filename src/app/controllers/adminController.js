const Calender = require ('../models/Booking');
const Department = require ('../models/Department');
const Order = require ('../models/Position');
const User = require ('../models/Admin')
const Shift = require ('../models/Shift');
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class AdminController {
    // Get /admin/managerdoctor
    managerDoctor(req,res,next){
        let namedepartment = 'Tổng quát';
        if(req.query.hasOwnProperty('department')){
            namedepartment = req.query.department;
        }
        Department.find({})
        .then ((department) =>{
            User.find({role : 'doctor', department : namedepartment})
            .then((user) => {
                res.render('./admin/managerdoctor', {
                    user: mutipleMongoosetoObject(user),
                    department: mutipleMongoosetoObject(department),
                });
            })
            .catch(next);
        });
    }

    // Get /admin/createdoctor
    createDoctor(req,res,next){
        Department.find({})
        .then((department) => {
            res.render('./admin/createdoctor', {
                department: mutipleMongoosetoObject(department),
            });
        })
        .catch(next);
    };

    //Post /admin/adddoctor
    async addDoctor(req,res,next){
        const FormData = new User({
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            password: '123',
            role: 'doctor',
        });
        // res.json(FormData);
        await FormData.save();
        res.redirect('/admin/managerdoctor');
    } 

    // Delete /admin/deletedoctor
    deleteDoctor(req,res,next){
        User.deleteOne({_id: req.param.id})
        .then(() => res.redirect('/admin/managerdoctor'))
        .catch(next);
    }

    // Get /admin/managerdepartment
    managerDepartment(req,res,next){
        Department.find({})
        .then((department) => {
            res.render('./admin/managerdepartment', {
                department: mutipleMongoosetoObject(department),
            });
        })
        .catch(next);
    }

    // Get /admin/createcalender
     createCalender(req,res,next){
        let namedepartment = 'Tổng quát';
        if(req.query.hasOwnProperty('department')){
            namedepartment = req.query.department;
        }
        Department.find({})
        .then((department) => {
            Shift.find({})
            .then((shift) => {
                User.find({role: "doctor", department: namedepartment})
                .then((user) => {
                    res.json({user, shift, department})
                })
            })            
        })
        .catch(next);
    }

    // Post /admin/addcalender
    async addCalender(req,res,next){
        const FormData = new Calender ({
            doctorName : req.body.name,
            department: req.body.department,
            TimeStartShift: Date(red.body.start),
            TimeStopShift: Date(red.body.stop),
        });
        await FormData.save();
        res.back();
    }
    // Get /admin/managercalender
    managerCalender(req,res,next){
        Calender.find({})
        .then((calender) =>{
            res.json(calender)
        })
        .catch(next);
    }

    // Get /admin/managerorder
    managerOrder(req,res,next){
        Order.find({})
        .then((order) => res.json(order))
        .catch(next);
    }

    // Delete /admin/force_order/:id
    deleteOrder(req,res,next){
        Order.deleteOne({_id: req.param.id})
        .then(() => res.redirect('/admin/managerorder'))
    }

    //Get /admin/manageruser
    managerUser(req,res,next){
        User.find({role: 'user'})
        .then((user) => res.json(user))
        .catch(next);
    }

}

module.exports = new AdminController;

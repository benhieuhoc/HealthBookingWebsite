const User = require ('../models/User')
const Department = require ('../models/department');
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class AdminController {
    // Get /admin/createdoctor
    createDoctor(req,res,next){
        Department.find({})
        .then((department) => {
            res.render('./admin/createdoctor', {
                department: mutipleMongoosetoObject(department),
            });
        })
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

    // Get /admin/managerdoctor
    managerDoctor(req,res,next){
        User.find({role: 'doctor'})
        .then((user) => {
            // res.json(user);
            res.render('./admin/managerdoctor', {
                user: mutipleMongoosetoObject(user),
            });
        })
        .catch(next);
    }

}

module.exports = new AdminController;

const Department = require ('../models/department');
const User = require ('../models/User')
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class SiteController {

    // Get /
    login(req,res,next){
        res.render('login');        
    }

    // Get /home
    home(req,res,next){
        res.render('home');
    }

    // Post /home
    sighin(req,res,next){
        User.findOne({email: req.body.email})
        .then((user) => {
            if (user && user.password === req.body.password)
            {
                req.session.user = user;
                res.locals.user= user;
                res.render('home');
            }
            else{
                alert("Email hoặc mật khẩu sai");
            };
        })
        .catch(next);
    }

    // Get /booking
    booking(req,res,next){
        Department.find({})
        .then((department) => {                      
            res.render('booking', {
                department: mutipleMongoosetoObject(department),                
            });
        })
        .catch(next);
    }

    // Get /logout
    logout(req,res,next){
        req.session.destroy(() => {
                res.render('login');
        });
    }
};

module.exports = new SiteController;

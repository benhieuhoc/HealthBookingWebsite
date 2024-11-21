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
                res.locals.user= req.session.user,
                res.json(user);
                // res.redirect('home');
            }
            else{
                res.status("Email hoặc mật khẩu sai");
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
            res.locals.user = null;
            res.render('login');
        });
    }
    
    //POST /register
    async register(req,res,next){
        const FormData = new User({
            name: req.body.surnames,
            email: req.body.emailCreate,
            password: req.body.passwordCreate,
            role: "user",
        });
        await FormData.save();
        res.redirect('/');
    }

};

module.exports = new SiteController;

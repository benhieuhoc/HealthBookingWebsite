// Khai báo thư viện
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Department = require ('../models/Department');
const User = require ('../models/Patient')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; 
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class SiteController {

    // Get /profile
    profile(req,res,next){
        res.json(res.locals.user);
    }

    // Put /updateprofile
    updateprofile(req,res,next){
        User.updateOne({_id: res.locals.user.id}, req.body)
        then(() => res.redirect('/editprofile'))
        .catch(next);
    }

    // Get /password
    password(req,res,next){
        res.json('');
    }

    // Patch /updatepassword
    updatepassword(req,res,next){
        User.findOneAndUpdate({_id: res.body.oldpassword}, {_id: res.body.newpassword})
        .then(() => res.redirect('/profile'))
        .catch(next);
    }

};

module.exports = new SiteController;

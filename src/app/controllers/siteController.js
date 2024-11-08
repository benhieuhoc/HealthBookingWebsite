const Department = require ('../models/department');
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class SiteController {

    // Get /home
    home(req,res,next){
        res.render('home');        
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
};

module.exports = new SiteController;

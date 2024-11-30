const Department = require ('../models/Department');
const Order = require ('../models/Admin');
const User = require ('../models/Admin');

class MAdminController {
    
    // Get /madmin/createdepartment
    createDepartment(req,res,next){
        res.render('');
    };

    // Post /madmin/adddepartment
    async addDepartment(req,res,next){
        const FormData = new Department ({
            name: req.body.name,
        })
        await FormData.save();
        res.redirect('/admin/managerdepartment');
    };

    // Delete /madmin/removedepartment/:id
    removeDepartment(req,res,next){
        Department.deleteOne({_id: req.param.id})
        .then(() => res.redirect('back'))
        .catch(next);
    };

    // Get /madmin/manageradmin
    managerAdmin(req,res,next){
        User.find({role: 'admin'})
        .then((user) => res.json(user))
        .catch(next);
    }

    // Get /madmin/createAdmin
    createAdmin(req,res,next){
        res.render('');
    }

    // Post /madmin/addadmin
    async addAdmin(req,res,next){
        const FormData = new User ({
            name: req.body.name,
            email: req.body.email,
            role: 'admin',
            password: '123',
        });
         await FormData.save();
        res.redirect('/madmin/manageradmin');
    }

    // Delete /madmin/removeadmin/:id
    removeAdmin(req,res,next){
        User.deleteOne({_id: req.param.id})
        .then(() => res.redirect('back'))
        .catch(next);
    }

    // Get /madmin/force-dlt-order
    listdDltOrdeer(req,res,next){
        Order.findDeleted({})
        .then((order) => res.json(order))
        .catch(next);
    }

    // Patch /madmin/restore/:id
    async restore(req,res,next){
        Order.restore({_id: req.params.id})
        .then(() => res.redirect('/madmin/force-dlt-order'))
        .catch(next);
    }

};

module.exports = new MAdminController;

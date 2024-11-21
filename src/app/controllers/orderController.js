const Order = require ('../models/order');

class OrderController {
    // POST /order/create
    async create(req,res,next){
        const FormData = new Order({
            name: req.body.name,
            email: req.body.email,
            date: req.body.date,
            department: req.body.department, 
            contact: req.body.contact,
            note: req.body.note,
        });
        // const order = FormData;
        // res.json(order);
        await FormData.save();
        res.redirect('/home');
    }

    
};


module.exports = new OrderController;

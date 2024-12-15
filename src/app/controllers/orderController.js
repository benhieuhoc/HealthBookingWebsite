const Doctor = require ('../models/Doctor');
const Order = require ('../models/Booking');
const { mutipleMongoosetoObject } = require('../../util/mongoose');
const { query } = require('express');
const { find } = require('../models/Shift');

class OrderController {
    
    // Get /order/show-by-iddoctor
     async show(req,res,next){
        try{
            const id = req.query.id;
            if (!id) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
            const findoctor = await Doctor.findOne({_id: id})
            // console.log("doctor: ", findoctor)
            
            if(!findoctor)
            {
                return res.status(404).json('Bác sĩ không tồn tại!!!')

            }

            const listorder = await Order.find({_idDoctor: id})
            console.log("order: ", listorder)

            if(listorder){
                res.status(200).json({message: 'Đã tìm thấy tất cả order của bác sĩ', data: listorder})
            }
        }catch (error){
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }
    
};


module.exports = new OrderController;

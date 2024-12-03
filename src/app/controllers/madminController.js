const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Madmin = require('../models/Admin')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

class MAdminController {
    
    // Post /madmin/login-madmin
    login(req,res,next){
        const {email, password} = req.body;
        try{
            Madmin.findOne({email: email})
            .then(async (madmin) => {
                if(!madmin){
                    return res.status(401).json({ message: 'Email không tồn tại!'})
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                console.log("Madmin.password: ",madmin.password);
                console.log("password: ",password);
                console.log("hashedPassword: ",hashedPassword);
                console.log('EXPIRESIN:', process.env.EXPIRESIN);

                const isMatch = await bcrypt.compare(password, madmin.password);
                if(!isMatch){
                    return res.status(401).json({ message: 'Mật khẩu không đúng!'});
                }

                const token = jwt.sign(
                    { madmin: madmin._id, email: madmin.email },
                    JWT_SECRET,
                    { expiresIn: process.env.EXPIRESIN }
                );
                
                res.json({ message: 'Đăng nhập thành công', access_token: token, data: madmin });
            })

        }catch (error){
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    // Post /madmin/logout-madmin
    logout(req,res,next){
        try{
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE.ENV === 'production',
            });

            res.status(200).json({ message : 'Đăng xuất thành công'});
        }catch (error){
            res.status(500).json({ message: 'Lỗi máy chủ'});
        }
    }

    

};

module.exports = new MAdminController;

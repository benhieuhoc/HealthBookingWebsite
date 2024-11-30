// Khai báo thư viện
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Department = require ('../models/Department');
const User = require ('../models/Patient')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; 
const { mutipleMongoosetoObject } = require('../../util/mongoose');

class SiteController {

    
    // Post /login-patinet
    login(req, res, next){
        const {email, password} = req.body

        User.findOne({email})
        .then (async(user) => {
            if(!user) {
                return res.status(401).json({ message: 'Email không tồn tại' });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log("patient.password: ",user.password);
            console.log("password: ",password);
            console.log("hashedPassword: ",hashedPassword);
            console.log('EXPIRESIN:', process.env.EXPIRESIN);
            console.log('JWT_SECRET:', JWT_SECRET);

            // So sánh mật khẩu với bcrypt
            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác' });
            }

            // Tạo token JWT
            const token = jwt.sign(
                { benhNhanId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: process.env.EXPIRESIN } // Thời gian hết hạn của token
            );

            // Trả về thông tin user (có thể trả về thông tin khác tùy nhu cầu)
            res.json({ message: 'Đăng nhập thành công', access_token: token, data: user });
            console.log(`Đăng nhập thành công với token: ${token}`);
        })
        .catch(next);
    }

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

    // Get /logout
    logout(req,res,next){
        try {
            // Xóa cookie chứa token
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Bảo đảm chỉ xóa cookie qua HTTPS nếu là production
            });
    
            // Trả về phản hồi thành công
            res.status(200).json({ message: 'Đăng xuất thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ',  });
        }
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

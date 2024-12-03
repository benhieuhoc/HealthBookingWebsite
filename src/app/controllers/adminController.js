const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

class AdminController {
    
    // Post /admin/login-admin
    login(req,res,next){
        const {email, password} = req.body
        try{
            Admin.findOne({email: email})
            .then(async(admin) => {
                if(!admin){
                    return res.status(401).json({ message: 'Email không tồn tại' });
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                console.log("admin.password: ",admin.password);
                console.log("password: ",password);
                console.log("hashedPassword: ",hashedPassword);
                console.log('EXPIRESIN:', process.env.EXPIRESIN);

                const isMatch = await bcrypt.compare(password, admin.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Mật khẩu không chính xác' });
                }
                 // Tạo token JWT
                const token = jwt.sign(
                    { adminId: admin._id, email: admin.email },
                    JWT_SECRET,
                    { expiresIn: process.env.EXPIRESIN } // Thời gian hết hạn của token
                );
                
                res.cookie('token', token, {
                    httpOnly: true, // Bảo mật hơn khi chỉ có server mới có thể truy cập cookie này
                    secure: process.env.NODE_ENV === 'production', // Chỉ cho phép cookie qua HTTPS nếu là production
                    maxAge: parseInt(process.env.MAXAGE), // 1 giờ
                });
                res.json({ message: 'Đăng nhập thành công', access_token: token, data: admin });
            })
                
            }catch (error){
                console.error(error);
                res.status(500).json({ message: 'Lỗi máy chủ' });
            }
    }

    // Post /admin/logout-admin
    logout(req,res,next){
        try{
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Bảo đảm chỉ xóa cookie qua HTTPS nếu là production
            });

            res.status(200).json({ message: 'Đăng xuất thành công' });
        }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    // Post /admin/create-admin
    async create(req,res,next){
        const {email, password, firstName, lastName, address, phone, gender} = req.body
        try{
            Admin.findOne({email: email})
            .then((admin) => {
                if(admin){
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Tài Khoản Đã Tồn Tại! Vui Lòng Chọn Email Khác!' 
                    });
                }
            })

            const hashedPassword = await bcrypt.hash(password, 10);
            const FormData = new Admin ({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone,
                gender: gender,
            })

            await FormData.save({})
            .then((admin) => {
                res.status(200).json({
                    message: "Thêm tài khoản bác sĩ thành công",
                    data: admin,
                })
            })

        }catch (error){
            return res.status(500).json({ success: false , message: error });
        }
    }

    // Delete /admin/delete-admin/:id
    delete(req,res,next){
        try{
            Admin.deleteOne({_id: req.boby._id})
            .then((admin) => {
                return res.status(200).json({
                    data: xoaAD,
                    message: "Bạn đã xoá tài khoản admin thành công!"
                })
            })
        }catch (error){
            return res.status(500).json({
                message: "Bạn đã xoá tài khoản bác sĩ thất bại!"
            })
        }
    }

    // Get /admin/show-all-admin
    async showall(req,res,next){
        const { page, limit, firstName, lastName, address } = req.query; // Lấy trang và kích thước trang từ query
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const query = {};

        if (firstName || lastName || address) {
            const searchKeywords = (firstName || '') + ' ' + (lastName || '') + ' ' + (address || '');
            const keywordsArray = searchKeywords.trim().split(/\s+/);

            const searchConditions = keywordsArray.map(keyword => ({
                $or: [
                    { firstName: { $regex: keyword, $options: 'i' } },
                    { lastName: { $regex: keyword, $options: 'i' } },
                    { address: { $regex: keyword, $options: 'i' } },
                ]
            }));

            query.$or = searchConditions;
        }

        const toltalAdmin = await Admin.countDocuments(query);
        const toltalPages =  Math.ceil(toltalAdmin / limitNumber);
        Admin.find(query)
        .populate("roleId")
        .skip(skip)
        .limit(limitNumber)
        .then((admin) => {
            return res.status(200).json({
                data: admin,
                toltalAdmin,
                toltalPages,
                currentPage: pageNumber,
                message: "Đã tìm thấy danh sách admin",
            })
        })
        .catch(next);
    }

}

module.exports = new AdminController;

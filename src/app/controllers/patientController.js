const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require ('../models/Patient');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

class PatientController {

    // Post /patient/login-patient
    login(req, res, next){
        const {email, password} = req.body
        try{
            Patient.findOne({email: email})
            .then (async(patient) => {
                if(!patient) {
                    return res.status(401).json({ message: 'Email không tồn tại' });
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
    
                console.log("patient.password: ",patient.password);
                console.log("password: ",password);
                console.log("hashedPassword: ",hashedPassword);
                console.log('EXPIRESIN:', process.env.EXPIRESIN);
                console.log('JWT_SECRET:', JWT_SECRET);
    
                // So sánh mật khẩu với bcrypt
                const isMatch = await bcrypt.compare(password, patient.password);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Mật khẩu không chính xác' });
                }
    
                // Tạo token JWT
                const token = jwt.sign(
                    { benhNhanId: patient._id, email: patient.email },
                    JWT_SECRET,
                    { expiresIn: process.env.EXPIRESIN } // Thời gian hết hạn của token
                );
    
                // Trả về thông tin patient (có thể trả về thông tin khác tùy nhu cầu)
                res.json({ message: 'Đăng nhập thành công', access_token: token, data: patient });
                console.log(`Đăng nhập thành công với token: ${token}`);
            })
        }catch (error){
            console.error(error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    // Post /patient/logout-patient
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

    // Post /patient/register-patient
    async register(req,res,next){
        const {email, password, firstName, lastName, address, phone, gender} = req.body;
        try{
            Patient.findOne({email: email})
            .then((patient) => {
                if(patient){
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Tài Khoản Đã Tồn Tại! Vui Lòng Chọn Email Khác!' 
                    });
                }
            })

            const hashedPassword = await bcrypt.hash(password, 10);

            const FormData = new Patient({
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone,
                gender: gender,
            });

            FormData.save({})
            .then((patient) => {
                return res.status(201).json({ 
                    success: true, 
                    message: 'Đăng ký tài khoản thành công', 
                    data: patient
                })
            })
            .catch(next);

        }catch (error){
            return res.status(500).json({ success: false , message: error });
        }
    }

    //Get /patient/infor
    async infor(req,res){
        const id = req.params.id;
        try{
            console.log("id user: ", id)
            const finduser = await Patient.findOne({_id: id})

            if(!finduser){
                return res.status(404).json({message: "Người dùng này không tồn tại!!!"})
            }else{
                return res.status(200).json({
                    data: finduser,
                    message: "Đã tìm thấy thông tin người dùng"
                })
            }
        }catch(error){
            return res.status(500).json({ success: false , message: "Lỗi hệ thống"});
        }
    }

    // Put /patient/update
    update(req, res, next){
        console.log("id: ",req.body);
        Patient.findOneAndUpdate({_id: req.body._id}, req.body)
        .then((patient) => {
            if(patient){
                return res.status(200).json({
                    data: patient,
                    message: "Chỉnh sửa tài khoản thành công"
                })
            }else{
                return res.status(404).json({                
                    message: "Chỉnh sửa tài khoản thất bại"
                })
            }
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra !!!",
                error: error.message,
            });
        })
    }

    // Patch /patient/change-pasword
    password(req,res,next){
        const {_id, password , passwordchange} = req.body
        // console.log("req: ", req)
        Patient.findOne({_id})
        .then (async(patient) => {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("password: ",password);
            console.log("hashedPassword: ",hashedPassword);
            console.log("patient.password: ",patient.password);

            // So sánh mật khẩu với bcrypt
            const isMatch = await bcrypt.compare(password, patient.password);
            console.log("isMatch: ", isMatch)
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác' });
            }
            const hashedPasswordChange = await bcrypt.hash(passwordchange, saltRounds);
            Patient.findOneAndUpdate({_id: _id}, {password: hashedPasswordChange})
            .then((patient) => {
                if(patient){
                    return res.status(200).json({
                        data: patient,
                        message: "Đổi mật khẩu thành công"
                    })
                }else{
                    return res.status(404).json({                
                        message: "Đổi mật khẩu thất bại"
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({
                    message: "Có lỗi xảy ra !!!",
                    error: error.message,
                });
            })
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra !!!",
                error: error.message,
            });
        })
    }

    // Patch /patient/change-avata
    avata(req,res){
        const {_id, image} = req.body
        // console.log("req: ", req)
        Patient.findOne({_id})
        .then ((patient) => {
            Patient.findOneAndUpdate({_id: _id}, {image: image})
            .then((patient) => {
                if(patient){
                    return res.status(200).json({
                        data: patient,
                        message: "Đổi ảnh đại diện thành công"
                    })
                }else{
                    return res.status(404).json({                
                        message: "Đổi ảnh đại diện thất bại"
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({
                    message: "Có lỗi xảy ra !!!",
                    error: error.message,
                });
            })
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra !!!",
                error: error.message,
            });
        })
    }
}

module.exports = new PatientController;

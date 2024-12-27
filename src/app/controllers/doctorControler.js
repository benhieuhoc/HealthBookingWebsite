const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Role = require('../models/Role');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const moment = require('moment-timezone');
const Shift = require('../models/Shift');


class DoctorController {

    // Post /doctor/create-doctor
    async create(req,res,next){
        try {
            let {email, password, firstName, lastName, address, phoneNumber, giaKhamVN, giaKhamNuocNgoai,
                chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota,  } = req.body

                console.log("chucVuId: ",chucVuId);
                console.log("chuyenKhoaId: ",chuyenKhoaId);
                console.log("giaKhamVN: ",giaKhamVN);
                console.log("giaKhamNuocNgoai: ",giaKhamNuocNgoai);
                
            
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).json({
                    message: "Vui lòng cung cấp đầy đủ thông tin (email, password, firstName, lastName)"
                });
            }

            const existingDoctor = await Doctor.findOne({ email: email });
            if (existingDoctor) {
                console.log('lỗi email: ',existingDoctor);
                return res.status(409).json({
                    message: "Email đã tồn tại. Vui lòng sử dụng email khác."
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            let createDoctor = await Doctor.create({
                email, 
                password: hashedPassword, 
                firstName, lastName, address, phoneNumber, 
                chucVuId: chucVuId || [], 
                gender, image, 
                chuyenKhoaId: chuyenKhoaId || [], 
                phongKhamId, roleId, mota, giaKhamVN, giaKhamNuocNgoai,                
            })
            
            if(createDoctor) {
                console.log("thêm thành công tài khoản");
                return res.status(200).json({
                    data: createDoctor,
                    message: "Thêm tài khoản bác sĩ thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Thêm tài khoản bác sĩ thất bại"
                })
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi thêm tài khoản bác sĩ.",
                error: error.message,
            });
        }
    }

    // Post /doctor/login-doctor
    login(req,res,next){
        const {email, password} = req.body
        console.log("req: ", req.body)
        Doctor.findOne({email : email})
        .then (async(doctor) => {
            if(!doctor) {
                return res.status(401).json({ message: 'Email không tồn tại' });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            console.log("patient.password: ",doctor.password);
            console.log("password: ",password);
            console.log("hashedPassword: ",hashedPassword);
            console.log('EXPIRESIN:', process.env.EXPIRESIN);
            console.log('JWT_SECRET:', JWT_SECRET);

            // So sánh mật khẩu với bcrypt
            const isMatch = bcrypt.compare(password, doctor.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu không chính xác' });
            }

            // Tạo token JWT
            const token = jwt.sign(
                { benhNhanId: doctor._id, email: doctor.email },
                JWT_SECRET,
                { expiresIn: process.env.EXPIRESIN } // Thời gian hết hạn của token
            );

            // Trả về thông tin doctor (có thể trả về thông tin khác tùy nhu cầu)
            res.json({ message: 'Đăng nhập thành công', access_token: token, data: doctor });
            console.log(`Đăng nhập thành công với token: ${token}`);
        })
        .catch(next);
    }

    // Post /doctor/logout-doctor
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
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    // Get /doctor/show-all-doctor
    async showall(req,res,next){
        const { page, limit, firstName, lastName, address } = req.query; // Lấy trang và kích thước trang từ query
        // Chuyển đổi thành số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Tính toán số bản ghi bỏ qua
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
        const totalDoctors = await Doctor.countDocuments(query); // Đếm tổng số bác sĩ
        const totalPages = Math.ceil(totalDoctors / limitNumber); // Tính số trang

        Doctor.find(query)
        .populate("chucVuId chuyenKhoaId phongKhamId roleId") // thêm  phongKhamId
        .populate({
            path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
            // model: 'ThoiGianGio' // Tên model của trường cần populate
        })
        .skip(skip)
        .limit(limitNumber)
        .then((doctor) => {
            return res.status(200).json({
                data: doctor,
                totalDoctors,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả bác sĩ",
            });
        })
        .catch(next);
    }

    // Get /doctor/show-doctor-byId
    showbyid(req,res,next){
        const id = req.query.id;
        console.log("id bacsi: ",id)
        try{
            if (!id) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
            Doctor.findById(id)
            .populate("chucVuId chuyenKhoaId phongKhamId roleId")
            .populate({
                path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                model: 'Shift' // Tên model của trường cần populate
            })
            .then((doctor) => {
                if(doctor){
                    return res.status(200).json({
                        message: "Đã tìm thấy bác sĩ",
                        data: doctor
                    })
                }else{
                    return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
                }
            })
        }catch(error){
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Get /doctor/show-doctor-by-department
    showbydepartment(req,res,next){
        try{
            Doctor.find ({chuyenKhoaId: req.query.idChuyenKhoa})
            .populate("chucVuId chuyenKhoaId phongKhamId roleId")
            .populate({
                path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                model: 'Shift' // Tên model của trường cần populate
            })
            .then((doctor) => {
            if(doctor){
                return res.status(200).json({
                    message: "Đã tìm thấy Doctor",
                    data: doctor
                })
            }else{
                return res.status(404).json({ message: 'Doctor không tồn tại!' });
            }
            })
        }catch(error){
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Put /doctor/update-doctor
    update(req,res){
        console.log("id: ",req.body._id);
        Doctor.findOneAndUpdate({_id: req.body._id}, req.body)
        .then((doctor) => {
            if(doctor){
                return res.status(200).json({
                    data: doctor,
                    message: "Chỉnh sửa tài khoản bác sĩ thành công"
                })
            }else{
                return res.status(404).json({                
                    message: "Chỉnh sửa tài khoản bác sĩ thất bại"
                })
            }
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra khi Chỉnh sửa tài khoản bác sĩ.",
                error: error.message,
            });
        })
    }

    // Delete /doctor/delete-doctor/:id
    delete(req, res,error){
        const _id = req.params.id
        Doctor.deleteOne({_id: _id})
        .then((doctor) => {
            return res.status(200).json({
                data: doctor,
                message: "Bạn đã xoá tài khoản bác sĩ thành công!"
            })
        })
        .catch((error) => {
            return res.status(500).json({
                message: "Bạn đã xoá tài khoản bác sĩ thất bại!"
            })
        })
    }

    // Post /doctor/add-shift
    async addshift(req,res,next){
        const { date, time, _id } = req.body;
        console.log("date: ", date);
        console.log("time: ", time);
        console.log("_id: ", _id);
        
        try {
            const doctor = await Doctor.findById(_id);
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
    
            // Convert date from request, ensuring the correct format
            const requestDate = moment(date, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DD');
    
            if (!moment(requestDate, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Ngày không hợp lệ!' });
            }
    
            // Check if there's already a time slot for the given date
            const existingTimeSlot = doctor.thoiGianKham.find(slot => slot.date === requestDate);
    
            if (existingTimeSlot) {
                // Update existing time slot
                const existingTimeIds = existingTimeSlot.thoiGianId.map(id => id.toString());
                const newTimeIds = time.filter(timeId => !existingTimeIds.includes(timeId));
                existingTimeSlot.thoiGianId = [...new Set([...existingTimeSlot.thoiGianId, ...newTimeIds])];
            } else {
                // Create a new time slot if none exists
                doctor.thoiGianKham.push({ date: requestDate, thoiGianId: time });
            }
    
            // Call the removeExpiredTimeSlots method to clean up any expired time slots
            await doctor.removeExpiredTimeSlots();
    
            // Save changes
            await doctor.save();
            return res.status(200).json({ message: 'Cập nhật lịch trình khám bệnh thành công!', data: doctor });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Get /doctor/show-doctor-whith-listbooking
    async showwithbooking(req,res,next){
        try{
            const { id, idGioKhamBenh, ngayKham } = req.query; // Lấy doctorId và date từ query
            if (!id) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }
            const doctor = await Doctor.findById(id).populate("chucVuId chuyenKhoaId phongKhamId roleId")
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }

            const timeGio = await Shift.findById(idGioKhamBenh);
            if (!timeGio) { 
                return res.status(404).json({ message: 'Giờ bạn muốn tìm nằm ngoài giờ hành chính!' });
            }

            return res.status(200).json({ message: 'Đã tìm thấy!', 
                infoDoctor: doctor, 
                tenGio: timeGio,
                ngayKham: ngayKham
            });
        }catch(error){
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

};

module.exports = new DoctorController;

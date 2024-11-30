const Doctor = require('../models/Doctor')

class DoctorController {

    // Post /doctor/create-doctor
    async create(req,res,next){
        let {email, password, firstName, lastName, address, phoneNumber, giaKhamVN, giaKhamNuocNgoai,
            chucVuId, gender, image, chuyenKhoaId, phongKhamId, roleId, mota,  } = req.body;

        console.log("chucVuId: ",chucVuId);
        console.log("chuyenKhoaId: ",chuyenKhoaId);
        console.log("giaKhamVN: ",giaKhamVN);

        // Kiểm tra thông tin gửi đi từ client
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                message: "Vui lòng cung cấp đầy đủ thông tin (email, password, firstName, lastName)"
            });
        };

        // Kiểm tra email đã tồn tại hay chưa
        Doctor.find({email: email})
        .then((doctor) => {
            if(doctor){
                return res.status(409).json({
                    message: "Email đã tồn tại. Vui lòng sử dụng email khác."
                });
            }
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const FormData = new Doctor({
            email, 
            password: hashedPassword, 
            firstName, lastName, address, phoneNumber, 
            chucVuId: chucVuId || [], 
            gender, image, 
            chuyenKhoaId: chuyenKhoaId || [], 
            roleId, mota, giaKhamVN, giaKhamNuocNgoai,
            // phongKhamId, 
        });

        await FormData.save()
        .then((doctor) => {
            res.status(200).json({
                message: "Thêm tài khoản bác sĩ thành công",
                data: doctor,
            })
        })
        .catch(next)
    }

    // Post /doctor/login-doctor
    login(req,res,next){
        const {email, password} = req.body

        Doctor.findOne({email})
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

    // Post /doctor/logout_doctor
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
    showall(req,res,next){
        const { page, limit, firstName, lastName, address } = req.query; // Lấy trang và kích thước trang từ query
        // Chuyển đổi thành số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Tính toán số bản ghi bỏ qua
        const skip = (pageNumber - 1) * limitNumber;
        const query = {};

        Doctor.find({query})
        .then(async(doctor) => {
            doctor
                .populate("chucVuId chuyenKhoaId phongKhamId roleId")
                .populate({
                    path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                    // model: 'ThoiGianGio' // Tên model của trường cần populate
                })
                .skip(skip)
                .limit(limitNumber);
            const totalDoctors = await Doctor.countDocuments(query); // Đếm tổng số bác sĩ
            const totalPages = Math.ceil(totalDoctors / limitNumber); // Tính số trang
            return res.status(200).json({
                data: fetchAll,
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
        try{
            Doctor.findById(req.query.id)
            .then((doctor) => {
                if(doctor){
                    doctor
                    .populate("chucVuId chuyenKhoaId phongKhamId roleId")
                    .populate({
                        path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                        model: 'ThoiGianGio' // Tên model của trường cần populate
                    })

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
            .then((doctor) => {
                doctor
                .populate("chucVuId chuyenKhoaId phongKhamId roleId")
                .populate({
                    path: 'thoiGianKham.thoiGianId', // Đường dẫn đến trường cần populate
                    model: 'ThoiGianGio' // Tên model của trường cần populate
                })
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
    update(req,res,error){
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

    // Delete /doctor/delete-doctor
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

    // Get /doctor/show-doctor-whith-listbooking
    async showwithbooking(req,res,next){
        try{
            const { id, idGioKhamBenh, ngayKham } = req.query; // Lấy doctorId và date từ query
            const doctor = await Doctor.findById(id).populate("chucVuId chuyenKhoaId phongKhamId roleId")
            if (!doctor) {
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }

            const timeGio = await ThoiGianGio.findById(idGioKhamBenh);
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

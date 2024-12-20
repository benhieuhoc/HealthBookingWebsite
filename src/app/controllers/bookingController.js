const Booking = require ("../models/Booking");

class BookingController{

    // Post /booking/dat-lich-kham
    async datLichKham(req,res){
        try{
            const {_idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham, 
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
            } = req.body

            console.log ('1')

            // Tách ngày
            const [day, month, year] = ngayKhamBenh.split('/').map(Number);
            const appointmentDate = new Date(year, month - 1, day);

            // Tách giờ
            const [startTimeStr, endTimeStr] = tenGioKham.split(' - ');
            const [startHour, startMinute] = startTimeStr.split(':').map(Number);
            const [endHour, endMinute] = endTimeStr.split(':').map(Number);

            const newStartTime = new Date(appointmentDate);
            newStartTime.setHours(startHour, startMinute);
            const newEndTime = new Date(appointmentDate);
            newEndTime.setHours(endHour, endMinute);

            // Kiểm tra lịch hẹn đang có
            const existingAppointments = await Booking.find({_idDoctor,ngayKhamBenh});

            // Kiểm tra cuộc hẹn bị trùng lặp
            for (const appointment of existingAppointments) {
                const [existingStartStr, existingEndStr] = appointment.tenGioKham.split(' - ');
                const [existingStartHour, existingStartMinute] = existingStartStr.split(':').map(Number);
                const [existingEndHour, existingEndMinute] = existingEndStr.split(':').map(Number);

                const existingStartTime = new Date(appointmentDate);
                existingStartTime.setHours(existingStartHour, existingStartMinute);

                const existingEndTime = new Date(appointmentDate);
                existingEndTime.setHours(existingEndHour, existingEndMinute);

                // Kiểm tra lịch hẹn đc gửi từ client có bị trùng với lịch hẹn có sẵn
                if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
                    return res.status(400).json({ message: 'Có vẻ lịch khám này đã có bệnh nhân đăng ký rồi. Vui lòng chọn thời gian khác.' });
                }
            }
            const checkin = false;
            let datlich = await Booking.create({
                _idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham, 
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham, checkin,

            })

            if (!datlich) { 
                return res.status(404).json({ message: 'Đặt lịch thất bại!' });
            }

            return res.status(200).json({ message: 'Đặt lịch khám thành công!', 
                data: datlich
            });

        }catch (error){
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Get booking/show-booking
    async show(req, res) {
        try {
            let idKH = req.query.idKhachHang

            const findLichHen = await Booking.find({_idTaiKhoan: idKH})
            .populate("_idDoctor _idTaiKhoan")
            .populate({
                path: '_idDoctor',
                populate: [
                    { path: 'chucVuId' }, 
                    { path: 'chuyenKhoaId' }, 
                    { path: 'phongKhamId' }, 
                ]
            })
            .populate({
                path: '_idTaiKhoan',
                model: 'Patient' 
            })

            if (!findLichHen) { 
                return res.status(404).json({ message: 'Tìm lịch hẹn thất bại!' });
            }

            return res.status(200).json({ message: 'Tìm lịch hẹn thành công!', 
                data: findLichHen
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }

    // Patch booking/checkin/:id
    async checkin(req,res){
        const _id = req.params.id;
        try{
            const findbooking = await Booking.find({_id: _id})
            if(!findbooking)
            {
                return res.status(404).json({ message: 'Lịch hẹn này không tồn tại'})
            }
            Booking.findByIdAndUpdate({_id: _id}, {checkin: true})
            .then((booking) => {
                return res.status(200).json({ message: 'Checkin bệnh nhân hoàn tất', data: booking})
            })
        }catch (error){
            return res.status(500).json({ message: 'Có lỗi xảy ra' })
        }
    }

    // Get /booking/show-all-booking
    async showall(req,res,next){
        const { page, limit } = req.query; // Lấy trang và kích thước trang từ query
        // Chuyển đổi thành số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        // Tính toán số bản ghi bỏ qua
        const skip = (pageNumber - 1) * limitNumber;
        const totalOrder = await Booking.countDocuments(); // Đếm tổng số bác sĩ
        const totalPages = Math.ceil(totalOrder / limitNumber); // Tính số trang

        Booking.find()
        .skip(skip)
        .limit(limitNumber)
        .then((booking) => {
            return res.status(200).json({
                data: booking,
                totalOrder,
                totalPages,
                currentPage: pageNumber,
                message: "Đã tìm ra tất cả lịch hẹn",
            });
        })
        .catch(next);
    }

    // Delete /booking/delete/:id
    delete(req,res){
        try{
            const id = req.params.id;
            console.log("id: ", id)
            Booking.deleteOne({_id: id})
            .then((booking) => {
                return res.status(200).json({
                    data: booking,
                    message: "Xóa lịch hẹn thành công"
                })
            })
            .catch(() => {
                return res.status(500).json({message:"Xóa lịch hẹn thất bại"})
            })
        }catch(error){
            return res.status(500).json({message:error})
        }
    }
};

module.exports = new BookingController

const Booking = require ("../models/Booking");

class BookingController{

    // Post /booking//dat-lich-kham
    async datLichKham(req,res){
        try{
            const {_idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham, 
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
            } = req.body

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

            let datlich = await Booking.create({
                _idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham, 
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
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

};

module.exports = new BookingController

const Doctor = require ("../models/Doctor");
const Shift = require ("../models/Shift");
const moment = require('moment-timezone');

class ShiftController {
    
    // Get /shift/show-all-shift
    showallshift(req,res) {
        Shift.find({})
        .then((shifts) => {
            return res.status(200).json({
                data: shifts,                
                message: "Đã tìm ra tất cả thoi gian",
            }); 
        })
        .catch(() => {
            return res.status(500).json({
                message: "Có lỗi xảy ra",
            });
        })
    }

    // Get shift/get-time-slot
    getTimeSlotsByDoctorAndDate(req,res,next){
        const { doctorId, date } = req.query; // Lấy doctorId và date từ query
        console.log("doctorId, date: ", doctorId, date);

        try{
            const doctorselect = {};
            const listtimeselect = {};
            Doctor.findById(doctorId)
            .then((doctor) => {
                doctorselect = doctor;
            })

            if(!doctorselect){
                return res.status(404).json({ message: 'Bác sĩ không tồn tại!' });
            }

            // Chuyển đổi ngày từ query
            const queryDate = moment.utc(date).startOf('day');

            const timeSlot = doctorselect.thoiGianKham.find(slot => {
                const slotDate = moment.utc(slot.date).startOf('day');
                return slotDate.isSame(queryDate);
            });

            if(timeSlot) {
                const timeGioIds = timeSlot.thoiGianId;
                Shift.find({_id: {$in : timeGioIds}})
                .then((shifts) => listtimeselect = shifts);

                const tenGioArray = listtimeselect.map(item => item.tenGio);
                console.log("tenGioArray: ", tenGioArray);

                return res.status(200).json({ message: 'Lấy thời gian thành công!', 
                    timeSlots: timeSlot.thoiGianId, 
                    tenGioArray, 
                    listtimeselect,
                });
            }else{
                return res.status(200).json({ message: 'Không có thời gian khám cho ngày này!', timeSlots: [] });
            }

        }catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra!', error });
        }
    }
};


module.exports = new ShiftController;
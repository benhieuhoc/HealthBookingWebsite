const mongoose = require('mongoose');
const Shift = require ('./Shift');
const defaultRoleId = new mongoose.Types.ObjectId("66df1d6fdcb551b86e4f703b"); 
const defaultChucVuId = new mongoose.Types.ObjectId("66f7b888ce6c5cdcb1cab057"); 

const DoctorSchema = new mongoose.Schema({   
    email: { type: String },
    password: { type: String },
    firstName: { type: String },        
    lastName: { type: String },        
    address: { type: String },        
    phoneNumber: { type: String },        
    giaKhamVN: { type: String },        
    giaKhamNuocNgoai: { type: String },        
    chucVuId: [{ref: "Position", type: mongoose.SchemaTypes.ObjectId, default: defaultChucVuId}],    
    gender: { type: Boolean },        
    image: { type: String },         
    chuyenKhoaId: [{ref: "Department", type: mongoose.SchemaTypes.ObjectId}],                  
    phongKhamId: {ref: "Clinic", type: mongoose.SchemaTypes.ObjectId},                  
    roleId: {ref: "Role", type: mongoose.SchemaTypes.ObjectId, default: defaultRoleId},  
    mota:   { type: String },           
    thoiGianKham: [
        {
            date: { type: String, required: true }, // Ngày khám
            thoiGianId: [{ ref: "Shift", type: mongoose.SchemaTypes.ObjectId }] // Mảng chứa các thoiGianId
        }
    ],      
},
{ 
    timestamps: true,   // createAt, updateAt
}
);

// Hàm để xóa các giờ khám đã qua
DoctorSchema.methods.removeExpiredTimeSlots = async function() {
    const currentDate = new Date();  // Ngày hiện tại
    const currentTimeInMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

    console.log("currentDate: ", currentDate);
    console.log("currentTimeInMinutes: ", currentTimeInMinutes);

    for (const slot of this.thoiGianKham) {
        const thoiGianGioList = await Shift.find({ _id: { $in: slot.thoiGianId } });

        // Lọc các giờ khám không còn hợp lệ
        slot.thoiGianId = slot.thoiGianId.filter(thoiGianId => {
            const thoiGianGio = thoiGianGioList.find(gio => gio._id.equals(thoiGianId));
            if (thoiGianGio) {
                const [start, end] = thoiGianGio.tenGio.split(' - ').map(t => {
                    const [hour, minute] = t.split(':').map(Number);
                    return hour * 60 + minute; // Chuyển đổi sang phút
                });

                // Lấy ngày của lịch khám
                const thoiGianGioDate = new Date(slot.date);
                thoiGianGioDate.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây, mili giây về 0 để so sánh chỉ ngày

                // So sánh ngày
                const currentDateOnly = new Date();
                currentDateOnly.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây, mili giây về 0 cho ngày hiện tại

                // Nếu ngày hiện tại lớn hơn ngày khám, hoặc ngày hiện tại bằng ngày khám nhưng giờ khám đã qua, xóa lịch khám
                if (thoiGianGioDate < currentDateOnly) {
                    return false;  // Lịch khám đã qua
                } else if (thoiGianGioDate.getTime() === currentDateOnly.getTime() && end <= currentTimeInMinutes) {
                    return false; // Lịch khám trong hôm nay nhưng đã qua giờ
                }

                // Giữ lại những giờ chưa qua
                return true;
            }
            return false;
        });
    }

    // Lọc những ngày không còn giờ khám nào
    this.thoiGianKham = this.thoiGianKham.filter(slot => slot.thoiGianId.length > 0);
}; 

// Thực hiện xóa trước khi lưu
DoctorSchema.pre('save', async function(next) {
    await this.removeExpiredTimeSlots();
    next();
});

module.exports = mongoose.model("Doctor", DoctorSchema);


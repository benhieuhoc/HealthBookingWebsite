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
    // phongKhamId: {ref: "PhongKham", type: mongoose.SchemaTypes.ObjectId},                  
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

module.exports = mongoose.model("Doctor", DoctorSchema);


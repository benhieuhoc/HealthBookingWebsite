const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
        doctorID: {ref: "Doctor", type: mongoose.SchemaTypes.ObjectId},
        patientID: {ref: "BenhNhan", type: mongoose.SchemaTypes.ObjectId},       
        statusID: { type: String },
        date: { type: Date },        
        timeType: { type: String },                 
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("Booking", BookingSchema);
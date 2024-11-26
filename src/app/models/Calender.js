const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const CalenderSchema = new Schema({
    doctorName: {type: String, minLength: 1},
    department: {type: String},
    TimeStartShift: {type: Date},
    TimeStopShift: {type: Date},
},
{
    timestamps: true,
});

module.exports = new mongoose.model('Calender', CalenderSchema);
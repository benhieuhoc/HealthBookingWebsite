const mongoose = require ('mongoose');

const Schema = mongoose.Schema;
const ShiftSchema = new Schema({
    name: {type: String, minLength: 1},
    start: {type: String},
    stop: {type: String},
});

module.exports = new mongoose.model('Shift', ShiftSchema);

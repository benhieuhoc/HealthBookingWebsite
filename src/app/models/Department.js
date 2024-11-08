const mongoose = require ('mongoose');


const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
    name: {type: String, minLength: 1},
});

module.exports = mongoose.model('Department', DepartmentSchema);

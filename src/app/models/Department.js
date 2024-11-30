const mongoose = require ('mongoose');


const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
    name: { type: String },        
        description: { type: String },        
        image: { type: String }        
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);

module.exports = mongoose.model('Department', DepartmentSchema);

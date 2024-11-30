const mongoose = require ('mongoose');


const Schema = mongoose.Schema;
const PositionSchema = new Schema({
    name: { type: String },        
    description: { type: String },        
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);

module.exports = mongoose.model('Position', PositionSchema);

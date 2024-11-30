const mongoose = require ('mongoose');


const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    key: { type: String },        
        allCodeID: {ref: "Allcode", type: mongoose.SchemaTypes.ObjectId},                          
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);

module.exports = mongoose.model('Role', RoleSchema);

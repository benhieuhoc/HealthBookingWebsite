const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({        
        name: { type: String },                
        address: { type: String },        
        description: { type: String },        
        image: { type: String },                
    }
);
module.exports = mongoose.model("Clinic", ClinicSchema);
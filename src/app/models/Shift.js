const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({        
        tenGio: { type: String },
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("Shift", ShiftSchema);
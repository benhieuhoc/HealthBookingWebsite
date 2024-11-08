const mongoose = require ('mongoose');
const mongoose_delete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    _id: {type: Number},
    name: {type: String, minLength: 1},
    email: {type: String, minLenghth: 1},
    date: {type: Date},
    department: {type: String, minLenghth: 1},
    contact: {type: String, minlength: 1, maxLenghth: 10},
    note: {type: String},
    },
    {
        _id: false,
    },
);

// add plugin
OrderSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: 'all' });
OrderSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Oder', OrderSchema);

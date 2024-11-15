const mongoose = require ('mongoose');


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {type: String, minLength: 1},
    email: {type: String, minLenghth: 1},
    password:{type: String, minLenghth: 1},
});

module.exports = mongoose.model('User', UserSchema);

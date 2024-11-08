module.exports = {
mutipleMongoosetoObject: function (MongooseArrays) {
return MongooseArrays.map((array) => array.toObject());
},

MongoosetoObject: function (mongoose) {
return mongoose ? mongoose.toObject() : mongoose;
},
};

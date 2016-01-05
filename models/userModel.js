var mongo = require('./mongoClient');

var mongoose = mongo.mongoose;
//var db = mongo.db;

var userSchema = new mongoose.Schema({
    nickName : { type:String },
    phoneNum  : { type: String, default: '' },
    createDate : { type: Date, default:Date.now },
    lastLogin : { type: Date, default:Date.now },
    ip : { type: String, default: '' }
});//表结构

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;//挂在自定义方法到对象上

//db.disconnect();

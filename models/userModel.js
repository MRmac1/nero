var mongo = require('./mongoClient');

var mongoose = mongo.mongoose;
var db = mongo.db;
//var userSchema = new mongoose.Schema({
//    nickName : { type:String },
//    phoneNum  : { type: String, default: '' },
//    createDate : { type: Date, default:Date.now },
//    lastLogin : { type: Date, default:Date.now },
//    ip : { type: String, default: '' }
//});//表结构
var userSchema = new mongoose.Schema({
    phoneNum: Number,
    device: String, //用户设备
    uuid: String,
    system: String,
    deviceType: String,
    journeys: [{
            //这里面算是用户的一段沿途记录了 设置项
            line:[{longitude:Number, latitude:Number, posPoint:[{
                //商家的信息
                name: String,
                poslng: Number,
                poslat: Number,
                type: Number  //商家类型
            }]}],//经度-纬度 沿途的一些推送信息,
            time: { type: Date, default:Date.now }, //记录 开始时间
            timeLast: Number,  //记录消耗时长
            distance: Number,  //记录行走
            interests:[{interestType: String}], //用户设置的兴趣点
            destination: {type: String, default: ''}, //目的地设置
            pushEnable: {type: Boolean, default: false}, //是否开启推送  默认不开启
            pushInterval: Number //推送间隔时长
        }],
    createDate : { type: Date, default:Date.now },
    lastLogin : { type: Date, default:Date.now },
    ip : { type: String, default: '' }
});

userSchema.methods.showHook = function() {
    var greeting = this.phoneNum
        ? "phoneNum is " + this.phoneNum
        : "I don't have a phoneNum";
    console.log(greeting);
}

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;//挂在自定义方法到对象上

//db.disconnect();

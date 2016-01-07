var mongo = require('./mongoClient');

var mongoose = mongo.mongoose;
var db = mongo.db;

var userSchema = new mongoose.Schema({
    phoneNum: { type: Number, default:'' },
    device: { type: String, default:'' }, //用户设备
    udid: { type: String, default:'' },
    system: { type: String, default:'' },
    deviceType: { type: String, default:'' },
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
        timeLast: { type: Number, default:0 },  //记录消耗时长
        distance: { type: Number, default:0 },  //记录行走
        interests:[{interestType: String}], //用户设置的兴趣点
        destination: {type: String, default: ''}, //目的地设置
        pushEnable: {type: Boolean, default: false}, //是否开启推送  默认不开启
        pushInterval: { type: Number, default:0 } //推送间隔时长
    }],
    createDate : { type: Date, default:Date.now },
    lastLogin : { type: Date, default:Date.now },
    ip : { type: String, default: '' }
});

//
//var userModel = mongoose.model('user', userSchema);
//var newUser = {phoneNum: '13262883990', device: 'iphone6', uuid:'testUdid',system:'ios 9.0.1',
//    ip: '127.0.0.1'};
//userModel.create(newUser, function(err, user) {
//    console.log(user);
//    console.log('back');
//});

userSchema.statics.showHook = function(fields, cb) {
    return this.find({ phoneNum: new RegExp(fields, 'i') }, cb);
};

var userModel = mongoose.model('users', userSchema);
module.exports = userModel;//挂在自定义方法到对象上

//db.disconnect();

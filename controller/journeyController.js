/**
 * Created by mr_mac1 on 14/12/15.
 */

var userModel = require('../models/userModel');
var interests = require('../config/interests');

//创建旅程，设置旅程兴趣点控制器
exports.getJourney = function( req, res, next )
{
    //检测有没有登陆,未登录则调转到登陆页面
    if( req.session.user == undefined ) {
        console.log('no session');
        return res.redirect('/user/register');
    }
    //展示兴趣点添加页面
    var pageInfo = { title :'沿途设置', interests: interests };
    res.render('journey', { pageInfo: pageInfo }); //注册渲染页
};

exports.postJourney = function(req, res, next)
{
    //知道用户是谁,客户端传udid过来
    var id = req.session.user._id;
    var params = req.body; //
    /*
    * line:[{longitude:Number, latitude:Number, posPoint:[{
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
    * */
    var interestSet = checkInterests(params);

    console.log(interestSet);

    var journeyPlan = {time: getNowFormatDate(), interests: interestSet,
        destination: params['destination-text'], pushEnable:params['interval'], pushInterval:params['interval']};





};

//更新兴趣点设置
exports.updateJourney = function()
{

};


//删除一段旅程
exports.deleteJourney = function()
{

};

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function checkInterests(params)
{
    var checks = [];
    for (var index in interests) {
        interests[index].forEach(function(item){
            if( params[item] ) {
                checks.push(item);
            }
        });
    }
    return checks;
}
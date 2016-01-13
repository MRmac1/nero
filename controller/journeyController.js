/**
 * Created by mr_mac1 on 14/12/15.
 */

var userModel = require('../models/userModel');
var interests = require('../config/interests');
var utilTools = require('../util/util');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

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
    /*
    *  生成一段旅程
    *  1. 过滤出要的参数, udid验证身份,
    *
    * */
    //知道用户是谁,客户端传udid过来
    var id = req.session.user._id || req.body.udid;
    var params = req.body; //
    var interestSet = checkInterests(params);
    var journeyPlan = {line:[], time: utilTools.getCurrentDate(), interests: interestSet};
    //向数据库添加一条设置信息
    userModel.update({_id:ObjectId(id)}, {$push:{journeys:journeyPlan}}, function(err, raw) {
        if (err) {
            console.log('err : '+err);
            res.json({status:'error'});
        }
        console.log("raw : "+raw);
        res.json({status:'ok'});
    });
};

//更新兴趣点设置
exports.updateJourney = function() {

};


//删除一段旅程
exports.deleteJourney = function() {

};

//根据传入参数得到用户定制的兴趣点
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
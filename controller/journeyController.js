/**
 * Created by mr_mac1 on 14/12/15.
 */

var userModel = require('../models/userModel');
var interests = require('../config/interests');
var utilTools = require('../util/util');
//var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var eventproxy = require('eventproxy');
var ep = new eventproxy();


//创建旅程，设置旅程兴趣点控制器
exports.getJourney = function( req, res, next )
{
    //检测有没有登陆,未登录则调转到登陆页面
    if( req.cookies['udid'] == undefined ) {
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
    * */
    //客户端传udid和interests数组过来
    var params = req.body; //

    //使用ep确保返回时间只会发生一次
    ep.once('backJson', function(status) {
        res.json(status);
    });
    var udid = params.udid;
    var interestSet = params['interests'];

    var journeyPlan = {line:[], time: utilTools.getCurrentDate(), interests: interestSet, status: false};
    //向数据库添加一条设置信息,先查找,后添加
    var tasks = [findByudid, updateJourney];
    function findByudid(callback) {
        userModel.find({udid: udid}).limit(1).exec(function( err, doc) {
            if (err) callback(err);
            if (doc.length == 0) {
                callback(err);
                ep.emit('backJson', {status:'error', error_message : '该用户不存在'});
            }
            callback(null, 1);
        })
    }

    function updateJourney(callback) {
        userModel.update({udid: udid}, {$push:{journeys:journeyPlan}}).limit(1).exec(function( err, modifyStatus) {
            if (err) {
                callback(err);
            }
            if (modifyStatus.nModified == 0) {
                callback(err);
                ep.emit('backJson', {status:'error', error_message : '添加设置信息失败'});
            }
            callback(null, 2);
        })
    }

    async.series(tasks, function(err, result) {
        if(err)console.error(err);
        ep.emit('backJson', {status:'ok', error_message : '添加设置信息成功'});
    });


};

//更新兴趣点设置
exports.updateJourney = function() {

};


//删除一段旅程
exports.deleteJourney = function() {

};

//完成一段旅程
exports.finishJourney = function() {

};

//获取兴趣点参数
exports.getDefinedInterests = function( req, res, next ) {
    res.json({status:'ok', result:interests});
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
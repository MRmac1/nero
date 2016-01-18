/**
 * Created by mr_mac1 on 8/12/15.
 */
var redis = require('../models/redisCache');
var userModel = require('../models/userModel');
var eventproxy = require('eventproxy');//使用eventproxy控制异步流程
var utilTools = require('../util/util');

exports.getRegister = function( req, res, next ) {
    var pageInfo = { title :'请验证手机号码', warning : '为了方便记录每一次美好的出行，请验证手机', uuid : 'localmac'};
    res.render('register', { pageInfo: pageInfo }); //注册渲染页
};

exports.postRegister = function( req, res, next ) {

    /*
    *   用户登录/注册流程
    *   1.检验客户端传来参数是否合法(phoneNum,ver-code,udid)
    *   2.需要检验用户的手机号和验证码是否正确 --- 这里需要异步
    *   3.已存在用户,则只进行登入操作,不存在用户创建用户.
    * */
    var ep = new eventproxy();
    var params = req.body;
    var phoneNum = params.phoneNum;
    //检查用户的可靠性,检查photoNum和uuid
    var phoneStatus = utilTools.checkPhoneNum(phoneNum);//手机号码状态,把隶属于那个运营商也写到user表里去
    if ( phoneStatus.status == 'error' ) {
        res.json(phoneStatus);
    }

    redis.get(phoneNum, function(err, value) {
        ep.emit('getVerCode',value);
    });

    ep.once('getVerCode', function( verCode ) {
        if( verCode == params['ver-code']){
            userModel.findOne({phoneNum: phoneNum}, function(err, doc){
                if (doc == null){
                    var date = utilTools.getCurrentDate();
                    var newUser = {phoneNum: phoneNum, device: params['device'], mobileOperators: phoneStatus.mobileOperators,
                        udid:params['udid'], system:params['system'], deviceType:params['deviceType'], createDate:date, lastLogin:date,
                        ip:req.ip};
                    userModel.create(newUser, function(err, user) {
                        if (err){
                            return next(err);//数据库错误
                        }
                        req.session.user = user;//写入session;
                        ep.emit('login',doc);
                    });
                }else {
                    //更新用户的登陆时间
                    userModel.update({_id:doc._id}, {$set:{lastLogin:utilTools.getCurrentDate()}});
                    req.session.user = doc;//上面查询应该只是findOne
                    ep.emit('login',doc);
                }
            });
        }else {
            res.json({status:'error'});//验证码错误
        }
    });

    ep.once('login', function(value) {
        res.cookie('user_id', value._id, { expires: new Date(Date.now() + 9000000), httpOnly: true });
        res.json({status:'ok'});
    });

};

exports.getVerifitionCode = function(req, res, next) {

    var phoneNum = req.body.phoneNum;
    var VerifitionCode = utilTools.generateVerCode();
    redis.set(phoneNum, VerifitionCode, function(err, reply) {
        if(err) {
            var status = { status: 'error', error_code: '', error_message: '验证码生成出错'};
            res.json(status);
        }
        var status = { status: 'ok', result: ''};
        res.json(status);
    });
};


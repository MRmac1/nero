/**
 * Created by mr_mac1 on 8/12/15.
 */
var redis = require('../models/redisCache');
var userModel = require('../models/userModel');
var events = require('events');
var errCode = require('../config/errorCode');

exports.getLogin = function( req, res, next ) {
    res.end('hello user'); //登陆渲染页
};

exports.postLogin = function( req, res, next ) {
    res.end('hello user'); //登陆验证逻辑
};

exports.getRegister = function( req, res, next ) {
    var pageInfo = { title :'请验证手机号码', warning : '为了方便记录每一次美好的出行，请验证手机', uuid : 'localmac'};
    res.render('register', { pageInfo: pageInfo }); //注册渲染页
};

exports.postRegister = function( req, res, next ) {
    var emitEvent = new events.EventEmitter();
    var params = req.body;
    var phoneNum = params.phoneNum;
    //检查用户的可靠性,检查photoNum和uuid

    if (!(phoneNum.length === 11)) {
        //非手机号码 error 1002
        var err = new Error(errCode[1002]);
        err.status = 1002;
        return next(err);
    }

    redis.get(phoneNum, function(err, value) {
        if(err != null)
        {
            next(err); //抛出错误
        }
        emitEvent.emit('gotCache', value);
    });

    emitEvent.on('gotCache', function(value) {
        if( value == params['ver-code']) {
            //保存用户到数据库
            userModel.find({phoneNum: phoneNum}, function(err, doc) {
                if(err) {
                    console.log('err'+err);
                    res.redirect('/user/register');
                }
                //先查询对应的手机号是否存在,若存在则直接写入session,若不存在则新注册用户
                if ( doc.length == 0 ) {
                    var newUser = {phoneNum: phoneNum, ip: req.ip, nickName: '用户'+ phoneNum};
                    userModel.create(newUser, function(err, user) {
                        req.session.user = user;
                        emitEvent.emit('login', user);
                    });
                }else {
                    req.session.user = doc;
                    emitEvent.emit('login', doc);
                }
            });
        }else {
            //验证码错误的情况
            res.json({status:'error'});
        }
    });
    //用户登录之后注册cookie等
    emitEvent.on('login', function(value) {
        res.cookie('user_id', value._id, { expires: new Date(Date.now() + 9000000), httpOnly: true });
        res.json({status:'ok'});
    });
};

exports.getVerifitionCode = function(req, res, next) {
    var phoneNum = req.body.phoneNum;
    var VerifitionCode = 111111;
    redis.set(phoneNum, VerifitionCode);
    var status = { status: 'ok' };
    res.json(status);
};
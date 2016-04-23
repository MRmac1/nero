/**
 * Created by mr_mac1 on 24/11/15.
 */

var interests = require('../config/interests');

//app首页，展示兴趣点设置
exports.index = function( req, res, next ) {
    console.log(123);
    res.render('app_index', {});//传递经纬度
};

//app首页，展示兴趣点设置
exports.count = function( req, res, next ) {
    var sess = req.session;
    if (sess.views) {
        sess.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + sess.views + '</p>');
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        sess.views = 1;
        res.end('welcome to the session demo. refresh!')
    }
};

exports.getDefinedInterests = function( req, res, next ) {
    res.json(interests);
};


exports.map = function( req, res, next ){
    //开始一段旅程后的跟踪页
    res.render('map', {});
};
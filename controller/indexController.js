/**
 * Created by mr_mac1 on 24/11/15.
 */
//app首页，展示兴趣点设置
exports.index = function( req, res, next ) {
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
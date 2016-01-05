/**
 * Created by mr_mac1 on 14/12/15.
 */
//创建旅程，设置旅程兴趣点控制器
exports.getJourney = function( req, res, next )
{
    //检测有没有登陆,未登录则调转到登陆页面
    if( req.session.user == undefined ) {
        console.log('no session');
        return res.redirect('/user/register');
    }
    //展示兴趣点添加页面
    var pageInfo = { title :'沿途设置' };
    res.render('journey', { pageInfo: pageInfo }); //注册渲染页
};

exports.postJourney = function(req, res, next)
{
    //保存到数据库


};

//更新兴趣点设置
exports.updateJourney = function()
{

};


//删除一段旅程
exports.deleteJourney = function()
{

};
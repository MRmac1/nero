var superagent = require('superagent');
var userModel = require('../models/userModel');//取用户设置的journey信息,即最新一条
var searchSetting = require('../config/searchSetting');
var eventproxy = require('eventproxy');//使用eventproxy控制异步流程
var ep = new eventproxy();
var querystring = require('querystring');
var amapSet = searchSetting.amap;

exports.userLocation = function(socket, io, set, locationObj) {

    //检查传入格式是否错误
    if ( !(typeof locationObj == 'object' && typeof locationObj.pos == 'object' && typeof locationObj.posNeed == 'boolean') ) {
        socket.emit('formatErr', {status:'error', error_message:'请检查传入参数'});
    } else {
        var pos = locationObj.pos.join(',');//与之相反的是String.split(delimiter,max_array_length)
        var keywords = set.interests.join('|');

        //获取amapData
        var ampiApi = 'http://restapi.amap.com/v3/place/around?&';
        var needParmsObj = {key:amapSet.key, location: pos, output:amapSet.output,
            radius: amapSet.radius, keywords:keywords, extensions:amapSet.extensions, sortrule:amapSet.sortrule};

        var needParms = querystring.stringify(needParmsObj);
        superagent.get(ampiApi + needParms)
            .end( function( err, res ) {
                ep.emit('amapData', res.text);
            });

        //获取baiduData 现在是伪造异步函数
        getBaiduData('baidu.com', function(data) {
            ep.emit('baiduData', data);
        });

        //合并信息
        ep.all('amapData', 'baiduData', function(amapData, baiduData) {
            var data = amapData;//这里应该有合并信息的步骤
            //保存信息到数据库
            ep.emit('saveLocation', data);
            if ( locationObj.posNeed ) {

                socket.emit('aroundyou', data);//这里触发的事件只有当前用户可以获取到,并不是广播形式
            }
        });

        ep.on('saveLocation', function(data) {
            //保存到数据库
        });
    }

};

function getBaiduData(url, callback) {
    var data = {};
    callback(data);
}
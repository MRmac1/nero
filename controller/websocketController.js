var superagent = require('superagent');
var userModel = require('../models/userModel');//取用户设置的journey信息,即最新一条
var searchSetting = require('../config/searchSetting');
var eventproxy = require('eventproxy');//使用eventproxy控制异步流程
var ep = new eventproxy();
var querystring = require('querystring');
var amapSet = searchSetting.amap;

exports.userLocation = function(socket, io, set, item) {
    var pos = item.join(',');//与之相反的是String.split(delimiter,max_array_length)
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
        console.log('amapData :' + amapData);
        //console.log('baiduData :' + baiduData);
        socket.emit('location event', amapData);//这里触发的事件只有当前用户可以获取到,并不是广播形式
    });
    //var url = 'http://restapi.amap.com/v3/place/around?&key=db45f615ca2c929e6c51fb67fc241088&location='+pos+'&output=json&radius=5000&keywords=肯德基&types=商务写字楼&offset=2&page=1&extensions=all';
    //superagent.get(url).
    //    end( function(err, res) {
    //       console.log(res.text);
    //    });
};

function getBaiduData(url, callback) {
    var data = {};
    callback(data);
}
var superagent = require('superagent');

var userModel = require('../models/userModel');//取用户设置的journey信息,即最新一条

exports.userLocation = function(socket, io, item) {
    var pos = item.join(',');//与之相反的是String.split(delimiter,max_array_length)
    var url = 'http://restapi.amap.com/v3/place/around?&key=db45f615ca2c929e6c51fb67fc241088&location='+pos+'&output=json&radius=5000&keywords=肯德基&types=商务写字楼&offset=2&page=1&extensions=all';
    superagent.get(url).
        end( function(err, res)
        {
           console.log(res.text);
        });
    var msg = 'new location';
    //socket.broadcast.emit('join event', msg); //给全员发送，不包括自己
    socket.emit('location event', msg);//这里触发的事件只有当前用户可以获取到,并不是广播形式
};

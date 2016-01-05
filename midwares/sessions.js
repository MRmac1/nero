/*
* 此处的session主要是用来标记用户的身份,每个客户端都会有一个单独的uuid,
* 每次客户端都会post过来,把uuid和用户的信息存储在redis端就完成了每次用户的认证
* */
//var key = 'uuid';
//var secret = 'yantu';
//var EXPIRES = 20 * 60 * 1000;
var redis = require('../models/redisCache');
var errCode = require('../config/errorCode');

//生成session函数,挂载到req.session上.这里还未加上过期策略,只凭uuid就可以获取到session值,不安全
exports.createSession = function()
{
    return function(req, res, next)
    {
        req.body.uuid = 'localmac';
        var uuid = false, session;
        if (typeof req.body.uuid == "undefined")
        {
            //必须要有uuid error 1001
            var err = new Error(errCode[1001]);
            err.status = 1001;
            return next(err); //这里不返回的话,还会继续到route层,return掉就不会了
        } else {
            uuid = req.body.uuid;
        }

        var _end = res.end;
        res.end = function end(chunk, encoding)
        {
            console.log('end in session');
            _end.call(res);
        };

        if(!uuid)
        {
            req.session = generate(uuid);
            return next();
        }else
        {
            redis.get(uuid, function(err, value)
            {
                session = JSON.parse(value);
                typeof session === 'null' ? req.session = session : req.session = generate(uuid);
                next();
            });
        }
    }
};


function generate(uuid)
{
    var session = {};
    session.uuid = uuid;
    //添加到redis中
    redis.set(session.uuid, JSON.stringify(session));//JSON.parse()和
    return session;
}

//最后保存req上的session到redis中,每次更改session都要调用一下,暂时还没想更好的方法,说不定event可以全局触发?
exports.saveBackSession = function(session)
{
    redis.set(session.uuid, JSON.stringify(session));
};

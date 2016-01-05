/**
 * Created by mr_mac1 on 21/12/15.
 */
//给渲染出来的页面添加csrf token和uuid属性值,若是有crsf_token post过来则,挂载在session之后
var session = require('../midwares/sessions');
var errCode = require('../config/errorCode');

exports.createCsrfAndUuid = function()
{
    var uuid = req.body['uuid'] || 'localmac';
    return function (req, res, next)
    {
        req.uuid = uuid;
        //若是已经post过来,则验证后传到下个中间件,若未post过来,则挂载在req.csrf上

        if(req.body['csrf'])
        {
            if ( req.body['csrf'] === req.session.csrf )
            {
                next();
            }else
            {
                //csrf token 不匹配 1003
                var err = new Error(errCode[1003]);
                err.status = 1003;
                return next(err);
            }
        }else
        {
            req.csrf = req.session.csrf = createCsrfToken();
            session.saveBackSession(req.session);
            next();
        }
    }
};

//为csrf 随机创建的字符串
function createCsrfToken(secret)
{

}

//封装常用函数

//检查手机号码格式
exports.checkPhoneNum = function( phoneNum ) {
    //手机号格式
    /**
     * 手机号码
     * 移动：134[0-8],135,136,137,138,139,150,151,157,158,159,182,187,188
     * 联通：130,131,132,152,155,156,185,186
     * 电信：133,1349,153,180,189
     */
    var mobileReg = /^(134[012345678]\d{7}|1(3[5-9]|5(012789)|8(23478)|47|78|)\d{8})$/; //中国移动
    var cmReg = /^1(3[0-2]|5[56]|45|8[56]|76)\d{8}$/; //中国联通
    var cuReg = /^1(3[34]|53|8[09])\d{8}$/; //中国电信

    //有任意一中匹配则返回true
    var result = {};
    var mobileFormat = ['mobileReg', 'cmReg', 'cuReg'];
    outerLoop:for ( var index in mobileFormat ){
        switch ( mobileFormat[index] ) {
            case 'mobileReg':
                if (mobileReg.test(phoneNum)) {
                    result.status = 'ok';
                    result.mobileOperators = '中国移动';
                    break outerLoop;
                } else {
                    break;
                }
            case 'cmReg':
                if (cmReg.test(phoneNum)) {
                    result.status = 'ok';
                    result.mobileOperators = '中国联通';
                    break outerLoop;
                } else {
                    break;
                }
            case 'cuReg':
                if (cuReg.test(phoneNum)) {
                    result.status = 'ok';
                    result.mobileOperators = '中国电信';
                    break outerLoop;
                }else {
                    break;
                }
        }
    }
    //若是都不匹配则result为空, 使用for in判断
    if ( isEmptyObject(result) ) {
        result.status = 'error';
        result.error_message = '手机格式非大陆格式';
    }
    return result;
};


function isEmptyObject( result ) {
    var name;
    for ( name in result ) {
        return false;
    }
    return true;
}

//获取当前时间,日期,时分秒展示 2009-06-12 12:00
exports.getCurrentDate = function() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分

    var clock = year + "-";

    if(month < 10)
        clock += "0";

    clock += month + "-";

    if(day < 10)
        clock += "0";

    clock += day + " ";

    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return clock;
};

//随机生成手机验证码, 四位数字
exports.generateVerCode = function() {

    var code = "";
    for (var i = 1 ; i <= 4; i++) {
        var num = (Math.ceil(Math.random()*10)).toString();
        code += num;
    }
    return code;
};
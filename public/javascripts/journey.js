/**
 * Created by mr_mac1 on 14/12/15.
 */
//异步获取设置页需要展示的选项数据

var interests =
{
    //模仿百度的兴趣点搜索
    '美食' : ['中餐', '川菜', '西餐', '火锅', '肯德基', '麦当劳'],
    '住宿' : ['快捷酒店', '星级酒店', '青年旅社', '招待所', '特价酒店', '旅馆'],
    '娱乐' : ['电影院', 'ktv', '酒吧', '咖啡厅', '网吧', '商场','洗浴', '会所'],
    '交通' : ['公交站', '加油站', '火车票代售', '长途汽车站', '停车场', '火车站'],
    '生活' : ['超市', '药店', 'ATM', '银行', '医院', '厕所']
};

$.get('/getDefinedInterests').done(function(data) {
    for (var index in data ){
        var titleDiv = $('<div style="clear: both">');
        titleDiv.html(index);
        var sectionDiv = $('<div>');
        var ulWarp = $('<ul>');
        data[index].forEach(function(item){
            var liItem = $('<li>');
            liItem.append($('<span>').html(item));
            liItem.append($('<input>').attr('name', item).attr('type', 'checkbox'));
            ulWarp.append(liItem);
        });
        sectionDiv.append(ulWarp);
        $("#sectionArea").append(titleDiv);
        $("#sectionArea").append(sectionDiv);
    }
});

$("#submit").click(function()
{
    var udid = '13262883995'; //暂时写死
    var checked = ['中餐', '洗浴']; //暂时写死
    var options = {
        url: '/journey',
        type: 'post',
        dataType: 'text',
        data: {udid:udid, interests:checked},
        success: function (data) {
            var result = JSON.parse(data);
            if (result.status == 'ok') {
                window.location.href = '/map';
            } else if(result.status == 'error'){
                alert('error');
            }
        }
    };
    $.ajax(options);
    return false;
});

//根据传入参数得到用户定制的兴趣点
function checkInterests(params)
{
    var checks = [];
    for (var index in interests) {
        interests[index].forEach(function(item){
            if( params[item] ) {
                checks.push(item);
            }
        });
    }
    return checks;
}

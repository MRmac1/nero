var map = new AMap.Map('screenBody', {zoom: 14, isHotspot:true}), //初始化地图
    geoLocation = [], //用户的模拟路径
    socket = io();//socket.io客户端

map.plugin(['AMap.ToolBar','AMap.Scale'],function(){
    var toolBar = new AMap.ToolBar();
    var scale = new AMap.Scale();
    map.addControl(toolBar);
    map.addControl(scale);
});//添加放大和导航的组件

map.plugin('AMap.Geolocation', function()
{
    geoLocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'RB'
    });
    map.addControl(geoLocation);
    geoLocation.getCurrentPosition();
    AMap.event.addListener(geoLocation, 'complete', onComplete);//返回定位信息
    AMap.event.addListener(geoLocation, 'error', onError);      //返回定位出错信息
});//用户初始定位


var userLocations = initMoving();//定义一个模拟用户行走的二维数组

function initMoving()
{
    var locations = [[113.932793,22.540515]];
    //模拟100个点,以供取用
    for (var i = 0; i < 10; i++) {
        var tmplocation = [locations[locations.length - 1][0] + getRandom(), locations[locations.length - 1][1] + getRandom()];
        locations.push(tmplocation);
    }
    return locations;
}

//得到类似0.000021的数
function getRandom() {
    var num = Math.ceil(Math.random() * 100);//1~100之间的数字
    return num/10E5;
}

var udid = '13508699406';
//用户身份传入
socket.emit('user', udid);

function onComplete()
{
    //定位成功后再开始模拟用户运动
    var tepLocations = [];
    userLocations.forEach(function(item, index)
    {
        setTimeout( function(){
            //每隔1秒依据localtions绘制覆盖物
            tepLocations.push(item);
            socket.emit('userLocation', item);
            map.setCenter(item);
            //绘制轨迹
            var polyline = new AMap.Polyline({
                map: map,
                path: tepLocations,
                strokeColor: "#00A",  //线颜色
                strokeOpacity: 1,     //线透明度
                strokeWeight: 3,      //线宽
                strokeStyle: "solid"  //线样式
            });
            //map.setFitView();
            polyline.setMap(map);
            //启动websocket传送到后端，用户的地理位置
        }, (index+1)*3000 + 2000);//这里的原理是从2s开始,以后每1s都会有个setTimeout事件.
    });
}

socket.on('location event', function(data) {
    var count = JSON.parse(data).count;
    $('#toast').html('附近有'+count+'个您感兴趣的地点');
});
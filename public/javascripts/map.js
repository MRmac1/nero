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
    //AMap.event.addListener(geoLocation, 'complete');//返回定位信息
    AMap.event.addListener(geoLocation, 'error', onError);      //返回定位出错信息
});//用户初始定位


var userLocations = initMoving();//定义一个模拟用户行走的二维数组

//setTimeout(function(){map.panBy(50, 100);}, 5000)

function initMoving()
{
    //var locations = [[113.932793,22.540515], [113.932798,22.540306], [113.932777,22.539955], [113.93245,22.539989],
    //    [113.932106,22.540391], [113.932031,22.540782],[113.931441,22.540861], [113.931382,22.539216],
    //    [113.93216,22.538374], [113.932106,22.537735],[113.932053,22.535931], [113.932187,22.533414]];//回家的路
    var location = [113.932793,22.540515], locations = [];
    //模拟100个点,以供取用
    for (var i = 0; i < 100; i++) {
        var tmplocation = [location[0] + 0.000011*i, location[1] + 0.000012*i];
        locations.push(tmplocation);
    }
    return locations;
}

function onComplete()
{
    //定位成功后再开始模拟用户运动
    var tepLocations = [];
    userLocations.forEach(function(item, index)
    {
        setTimeout( function(){
            console.log(index);
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
            map.setFitView();
            //启动websocket传送到后端，用户的地理位置
        }, (index+1)*1000 + 2000);//这里的原理是从2s开始,以后每1s都会有个setTimeout事件.
    });
}

socket.on('location event', function(msg)
{
    console.log(msg);
});
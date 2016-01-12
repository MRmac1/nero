/**
 * Created by mr_mac1 on 26/11/15.
 */
var map = new AMap.Map('screenBody', {zoom: 14, isHotspot:true}), //初始化地图
    geoLocation = []; //用户的模拟路径
var  socket = io();
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
    AMap.event.addListener(geoLocation, 'error', onError);      //返回定位出错信息
});//用户初始定位

function onError() {
    console.log('定位失败');
}

$('.newJourney').click(function() {
   location.href = '/journey'; //跳转到添加新旅程页面
});

socket.on('location event', function(msg)
{
    console.log(msg);
});
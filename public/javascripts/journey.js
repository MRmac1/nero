/**
 * Created by mr_mac1 on 14/12/15.
 */
//异步获取设置页需要展示的选项数据
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
    var options = {
        url: '/journey',
        type: 'post',
        dataType: 'text',
        data: $("#destination-form").serialize(),
        success: function (data) {
            var result = JSON.parse(data);
            if (result.status == 'ok') {
                //window.location.href = '/map';
            } else if(result.status == 'error'){
                alert('error');
            }
        }
    };
    $.ajax(options);
    return false;
});
//用户注册页面，主要是发送注册码和提交登陆，用户注册码生成后，在redis里保存手机号和注册码的关系。提交注册的时候到redis验证

$('#code-submit').click(function()
{
    $('#code-submit').val(10);
    //传送到发送验证码的url上
    var phoneNum = $("#phoneNum").val();
    $.post('/user/getVerifitionCode',{phoneNum:phoneNum}, function(data)
    {
        console.log(data);
    });

    var countTime = setInterval( function()
    {
        var time = $('#code-submit').val();
        $('#code-submit').val(--time);
        if( time <= 0 )
        {
            clearInterval(countTime);
            $('#code-submit').val('验证');
        }
    }, 1000);


});

$("#submit").click(function()
{
    var options = {
        url: '/user/register',
        type: 'post',
        dataType: 'text',
        data: $("#register-form").serialize(),
        success: function (data) {
            var result = JSON.parse(data);
            if (result.status == 'ok') {
                window.location.href = '/';
            } else if(result.status == 'error'){
                alert('验证码错误');
            }
        }
    };
    $.ajax(options);
    return false;
});
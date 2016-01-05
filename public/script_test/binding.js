var eventproxy = require('eventproxy');
var fs = require('fs');

//获取数据的方法，感觉比较适合用于service层
var getContent = function( callback )
{
    var ep = new eventproxy();
    ep.all('file1', 'file2', function(file1, file2)
    {
        callback(null,
            {
                file1: file1,
                file2: file2
            })
    });

    ep.fail(callback);

    fs.readFile('../stylesheets/app.css', 'utf-8', ep.done('file1'));
    fs.readFile('../stylesheets/user.css', 'utf-8', ep.done('file2'));

};

var content = getContent(function(err, data)
{
    if(err)
    {
        console.log('I hava a error occur!' + err);
    }else
    {
        console.log('got all the data\n' + data.file1);
    }
});
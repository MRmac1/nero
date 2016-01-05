/**
 * Created by mr_mac1 on 18/12/15.
 */
//使用将原始函数返回为promise式
var fs = require('fs');
//var Q = require('q');
//
//function fs_readFile (file, encoding) {
//    var deferred = Q.defer();
//    fs.readFile(file, encoding, function (err, data) {
//        if (err) deferred.reject(err); // rejects the promise with `er` as the reason
//        else deferred.resolve(data); // fulfills the promise with `data` as the value
//    });
//    return deferred.promise; // the promise is returned
//}
////fs_readFile('binding.js', 'utf8').then(console.log, console.error);
//
//var allPromise = Q.all([fs_readFile('binding.js', 'utf8'), fs_readFile('promise.js', 'utf8')]);

//allPromise.then(console.log, console.error);


//读取tree文件夹下所有的文件

var treePath = 'tree';
//
//读取一个文件夹/文件，然后返回非文件夹的数据
var readPath = function(path, callback)
{
    var tmpPath = path;
    var texts = [];
    fs.readdir( path, function(err, files)
    {
        files.forEach(function(currentFile, index)
        {
            var filePath = tmpPath + '/' + currentFile;
            fs.stat(filePath, function(err, stats)
            {
                if(stats.isFile())
                {
                    console.log(filePath);
                    texts.push(filePath);
                }else if(stats.isDirectory())
                {
                    readPath(filePath);
                }
            });
        });
    });
};

readPath(treePath, function(err, files)
{
    files.forEach(function(file, index)
    {
        fs.readFile(file, 'utf8', function(err, content)
        {
            console.log(content);
        });
    });
});


//[1, 2, 3].forEach(console.log);


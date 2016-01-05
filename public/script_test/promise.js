/**
 * Created by mr_mac1 on 17/12/15.
 */
//测试Promise/Deferred模式

/*
*  Promise负责状态的转换，可以有未完成态->完成态，未完成态->失败态。其状态不可逆反
*  promise要实现then()方法完成链式调用
*
* */

//var events = require('events');
//var util = require('util');
//
//var EventEmitter = new events.EventEmitter();

var fs = require('fs');

var Promise = function()
{
    this.queue = [];//数组模拟队列
    this.isPromise = true;
};

//util.inherits(Promise, EventEmitter);//promise继承EventEmitter

//then接受三个参数
Promise.prototype.then = function( fulfilledHandler, errorHandler, progressHandler )
{
    var handler = {};
    if( typeof fulfilledHandler === 'function' )
    {
        handler.fulfilled = fulfilledHandler;
        //this.once('success', fulfilledHandler);//promise.emit('success', value)时候调用fulfilledHandler
    }
    if( typeof errorHandler === 'function')
    {
        handler.error = errorHandler;
        //this.once('error', errorHandler);
    }
    this.queue.push(handler);
    return this;//返回本身继续调用
};

var Defferrd = function()
{
    this.promise = new Promise();
};

//完成态，所有的都完成了
Defferrd.prototype.resolve = function(obj)
{
    var promise = this.promise;
    var handler;
    while( (handler = promise.queue.shift()) )
    {
        if( handler && handler.fulfilled )
        {
            var ret = handler.fulfilled(obj);
            if( ret && ret.isPromise )
            {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};

Defferrd.prototype.reject = function(err)
{
    var promise = this.promise;
    var handler;
    while( (handler = promise.queue.shift()) )
    {
        if( handler && handler.error )
        {
            var ret = handler.error(err);
            if( ret && ret.isPromise )
            {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};

//生成回调
Defferrd.prototype.callback = function(obj)
{
    var that = this;
    return function(err, file)
    {
        if(err)
        {
            return that.reject(err);
        }
        that.resolve(file);
    };
};

var readFile1 = function(file, encoding)
{
    var deffered = new Defferrd();
    fs.readFile(file, encoding, deffered.callback());
    return deffered.promise;
};

var readFile2 = function(file, encoding)
{
    var deffered = new Defferrd();
    fs.readFile(file, encoding, deffered.callback());
    return deffered.promise;
};

readFile1('binding.js', 'utf8').then(function(file1)
{
    return readFile2(file1.trim(), 'utf8');
}).then(function(file2)
{
    console.log(file2);
});

//fs.readFile('promise.js', 'utf8', function(err, val)
//{
//    if(err)
//    {
//        console.log('err : '+ err);
//    }
//    console.log(val);
//});

//
//var Deferred = function()
//{
//    this.state = 'unfulfilled';
//    this.promise = new Promise();
//};
//
//Deferred.prototype.resolve = function(obj)
//{
//    this.state = 'fulfilled';
//    this.promise.emit('success', obj);
//};
//
//Deferred.prototype.reject = function(err)
//{
//    this.state = 'failed';
//    this.promise.emit('error', err);
//};
//
//Deferred.prototype.progress = function(data)
//{
//    this.progress.emit('progress', data);
//};



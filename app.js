var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//自定义session模块,绑定用户
//var session = require('./midwares/sessions');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var journey = require('./routes/journey');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());  //解析json串
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false })); //解析二进制文件
app.use(cookieParser());
//app.use(session.createSession()); 暂时不用session
var RedisStore = require('connect-redis')(session);
app.use(session(
    {
      store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        disableTTL:true
      }),
      secret: 'yuantu',
      resave: true,
      saveUninitialized:true
    }));
app.use('/', routes);
app.use('/user', users);//用户相关的控制器,用来处理用户登录,注册,用户中心数据等.
app.use('/journey', journey);//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

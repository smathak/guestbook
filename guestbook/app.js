// 60152172/김지은

// 추가한 부분: 
// app.js에서는 33번줄에 app.use(session{...}); 을 추가함
// 57번 줄도 flashMessages를 출력하기 위해서 추가함 
// posts.edit 파일에서 각각의 input태그에 required 속성 추가
// 게시판을 수정하기 위한 비밀번호는 위에서 부터 a, b, c, d.... 입니다. 
// ----------------------------------------------------------
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
var posts = require('./routes/posts');
var mongoose   = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.locals.moment = require('moment');

// mongodb connect
// 아래 DB접속 주소는 꼭 자기 것으로 바꾸세요!
mongoose.connect('mongodb://user:12345@ds031597.mlab.com:31597/practice');
mongoose.connection.on('error', console.log);

app.use(session(
  {
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: true,
    secret: '123'
  }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(flash());

app.use(function(req, res, next) {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', routes);
app.use('/posts', posts);

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

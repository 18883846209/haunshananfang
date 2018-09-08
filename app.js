var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.static(path.join(__dirname, 'dist')));
var ejs = require('ejs');
ejs.delimiter = '$';
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname));
app.set('view engine', 'html');

var cas = require('./lib/cas');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//cas url 和认证service
//app.use(cas('http://192.168.105.235:8080','http://192.168.105.238:8000'));



// app.use('/videoSystem',  function(req, res, next){
//   res.render('index1');
// });

app.use('*',  function(req, res, next){
    let config = require(path.join(__dirname,'./config.json'));
    res.render('index',{
      config:config,
      env:process.env.NODE_ENV
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send('<p>something blew up</p>');
  });
  
  module.exports = app;
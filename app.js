var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

var mongoose = require('mongoose');
var config = require('./config/config.json');
var uri = 'mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.database;
global.db = mongoose.createConnection(uri);

var log4js = require('log4js');
//log4js config
log4js.configure({
    appenders : [ {
        type : 'console'
    }],
    replaceConsole : true
});
var logger = log4js.getLogger('normal');

global.weixin = {};

//var api = require('./routes/api');
var index = require('./routes/index');
var weixin = require('./routes/weixin');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(logger, {
    level : log4js.levels.INFO
}));
app.use(function(req,res,next){
    res.set('X-Powered-By','Server');
    next();
});
app.use(multer({
    dest : 'public/uploads'
}));
app.use('/', index);
app.use('/weixin', weixin);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).end();
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).end();
});

app.set('port', process.env.PORT || 3333);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var log4js = require('log4js');
var l4jLogger = log4js.getLogger('PipelineVentilator');

var routes = require('./routes/index');
var r_cross = require('./routes/cross');
var r_test = require('./routes/test');
var r_script = require('./routes/script');
var r_api = require('./routes/api');
var r_pdf = require('./routes/pdf');

var PipelineVentilator = require('./controllers/PipelineVentilator');
var PipelineSink = require('./controllers/PipelineSink');
var RrClient = require('./controllers/RrClient');
var OMS = require('./controllers/OMS');
var revision = require('child_process').execSync('git rev-parse HEAD').toString().trim();
var pjson = require('./package.json');

var app = express();
var plVent = new PipelineVentilator(app);
var plSink = new PipelineSink(app);
var rrClient = new RrClient(app);
var oms = new OMS(app);
var broadcastService;

var map_blockTr = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('plVent', plVent);
app.set('plSink', plSink);
app.set('rrClient', rrClient);
app.set('map_blockTr', map_blockTr);
app.set('oms', oms);
app.set('revision', revision);
app.set('env', pjson.env);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', r_api);
app.use('/cross', r_cross);
app.use('/test', r_test);
app.use('/script', r_script);
app.use('/pdf', r_pdf);

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

rrClient.Connect();
// program start
plVent.Bind();
//plSink.Bind();

plVent.QueryAllTradeReport();
plVent.QueryAllInstrument();
plVent.QueryAllAccount();
plVent.QueryAllExpiryDate();

//setInterval(function() {
//	plVent.SOD();
////	console.log(new Date());
//  }, 1000);

module.exports = app;

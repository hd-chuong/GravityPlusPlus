var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var datasetRouter = require('./routes/datasetRouter');
var dataRouter = require('./routes/dataRouter');
var visRouter = require('./routes/visRouter');
var intRouter = require('./routes/intRouter');
var appRouter = require('./routes/appControl');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(session({
  secret: 'ABCD',
  cookie: {maxAge: 100000},
  saveUninitialized: false,
  rolling: true,
  resave: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app API
app.use('/app', appRouter);
// dataset API
app.use('/dataset', datasetRouter);
// data API
app.use('/data', dataRouter);
// vis API
app.use('/vis', visRouter);
// int API
app.use('/int', intRouter);

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
  res.render('error');
});

module.exports = app;

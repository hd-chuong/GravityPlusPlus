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
const bodyParser = require('body-parser');
const { nextTick } = require('process');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(session({
  secret: 'max-secret',
  cookie: {maxAge: 1000000, secure: false},
  saveUninitialized: true,
  rolling: true,
  resave: true, 
}));

/*
* Set cookie: {secure: false} solves the problem that each request changes its id session
* https://stackoverflow.com/questions/20814940/express-change-session-every-request
*/

app.use(express.urlencoded({ extended: true, limit: '150mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json({limit: '50mb'}));

// app.use((req, res, next) => {
//   // console.log(req.body);
//   // console.log("body ", req.body.isNewProject);
//   next();
//   // if (req.session.name || req.body.isNewProject)
//   // {
//   //   next();
//   // }
//   // else
//   // {
//   //   next();
//   //   // next(new Error("Unknown project name"));
//   //   // res.sendStatus(401).json({err: "Unknown project name"});
//   // }
// })

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:7472');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let loginRouter = require('./routes/login');
let indexRouter = require('./routes/index');
let listRouter = require('./routes/list');
let detailRouter = require('./routes/detail');
let detailOnlyFileRouter = require('./routes/detailOnlyFile');
let newsListRouter = require('./routes/newsList');
let newsRouter = require('./routes/news');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截器
app.use(function (req, res, next) {
  let url = req.originalUrl;
  if (url !== '/' && url.indexOf('/login') < 0 && req.cookies['cbssUser'] === undefined) {
    return res.redirect("/");
  }
  next();
});

app.use('/', loginRouter);
app.use('/login', loginRouter);
app.use('/index', indexRouter);
app.use('/list', listRouter);
app.use('/detail', detailRouter);
app.use('/detailOnlyFile', detailOnlyFileRouter);
app.use('/newsList', newsListRouter);
app.use('/news', newsRouter);

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

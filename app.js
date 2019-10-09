const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8081);

app.get('/hello',(req, res) =>{
res.send("Hello, world!");
});

app.post('/hello',(req,res) =>{
  res.status(405);
res.send("This method is unsupported");
});

app.post('/check', (req,res) =>{
  if (req.query.msg === undefined){
   res.status(405);
    res.send("This method is unsupported");
    return;
  }
  res.send("POST message received: " + req.query.msg);
});

app.get('/check',(req,res) => {
  res.send("GET message received");

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
  res.render('error');
});



module.exports = app;

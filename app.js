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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(13800);

let keyv = {};
keyv["hi"] = "foo";

app.get('/hello', (req, res) => {
    res.json = {"message": "Added successfully", "replaced": false};
    console.log(res.json);
    res.send("Hello, world!");
});

app.put('/kv-store/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + req.body.value);
    if (req.body.value === undefined) {
        console.log("val undef.");
        res.status(400);
        res.send({"error": "Value is missing", "message": "Error in PUT"});
        return;
    } else if (req.params.key.length > 50) {
        res.status(400);
        res.send({"error": "Key is too long", "message": "Error in PUT"});
        return;
    }

    if (keyv[req.params.key] !== undefined){
        keyv[req.params.key] = req.body.value;
        res.status(200);
        res.send({"message":"Updated successfully","replaced":true});
        return;
    }
    keyv[req.params.key] = req.body.value;
    res.status(201);
    let msg = {"message": "Added successfully", "replaced": false};
    res.send(msg);
});

app.get('/kv-store/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);

    if (keyv[req.params.key]===undefined){
        res.status(404);
        res.send({"doesExist":false,"error":"Key does not exist","message":"Error in GET"});
        return;
    }
        res.status(200);
        let val = keyv[req.params.key];
        res.send({"doesExist":true,"message":"Retrieved successfully","value":val})
});

app.delete('/kv-store/:key',(req,res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);

    if (keyv[req.params.key]===undefined){
        res.status(404);
        res.send({"doesExist":false,"error":"Key does not exist","message":"Error in DELETE"});
        return;
    }
    res.status(200);
    delete keyv[req.params.key];
    res.send({"doesExist":true,"message":"Deleted successfully"})


});

app.post('/hello', (req, res) => {
    res.status(405);
    res.send("This method is unsupported");
});

app.post('/check', (req, res) => {
    if (req.query.msg === undefined) {
        res.status(405);
        res.send("This method is unsupported");
        return;
    }
    res.send("POST message received: " + req.query.msg);
});

app.get('/check', (req, res) => {
    res.send("GET message received");

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;

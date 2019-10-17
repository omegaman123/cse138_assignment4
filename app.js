const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');

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

console.log(process.env.FORWARDING_ADDRESS);
const FORWARDING_IP = process.env.FORWARDING_ADDRESS;


app.put('/kv-store/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + req.body.value);
    let key = req.params.key;
    let val = req.body.value;


    if (FORWARDING_IP !== undefined) {
        console.log("requesting from main");
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

        axios.put('http://' + FORWARDING_IP + '/kv-store/' + key,{
            "value":val
    }).then(
        response => {
        // console.log(response);
        res.send(response.data);
        return;
    }).catch( error => {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            res.status(error.response.status);
            res.send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            res.status(503);
            res.send({"error":"Main instance is down","message":"Error in PUT"});
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            res.send(error.message);
        }
        console.log(error.config);

    });
     return;
    }


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


    if (keyv[req.params.key] !== undefined) {
        keyv[req.params.key] = req.body.value;
        res.status(200);
        res.send({"message": "Updated successfully", "replaced": true});
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
    let key = req.params.key;
    let val = req.body.value;
    console.log("IP: " + FORWARDING_IP);

    if (FORWARDING_IP !== undefined) {
        console.log("requesting from main");
        axios.get('http://' + FORWARDING_IP + '/kv-store/' + key).then(
            response => {
            // console.log(response);
            res.send(response.data);
            return;
                }).catch( error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                res.status(error.response.status);
                res.send(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                res.status(503);
                res.send({"error":"Main instance is down","message":"Error in GET"});
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                res.send(error.message);
            }
            console.log(error.config);

            });
        return;
        }


    if (keyv[req.params.key] === undefined) {
        res.status(404);
        res.send({"doesExist": false, "error": "Key does not exist", "message": "Error in GET"});
        return;
    }
    res.status(200);
    val = keyv[req.params.key];
    res.send({"doesExist": true, "message": "Retrieved successfully", "value": val})
});

app.delete('/kv-store/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);
    let key = req.params.key;
    let val = req.body.value;

    if (FORWARDING_IP !== undefined) {
        console.log("requesting from main");
        axios.delete('http://' + FORWARDING_IP + '/kv-store/' + key).then(
            response => {
            // console.log(response);
            res.send(response.data);
        return;
    }).catch( error => {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status);
            res.send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request);
            res.status(503);
            res.send({"error":"Main instance is down","message":"Error in DELETE"});
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            res.send(error.message);
        }
        //console.log(error.config);
    });
        return;
    }

    if (keyv[req.params.key] === undefined) {
        res.status(404);
        res.send({"doesExist": false, "error": "Key does not exist", "message": "Error in DELETE"});
        return;
    }
    res.status(200);
    delete keyv[req.params.key];
    res.send({"doesExist": true, "message": "Deleted successfully"})


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

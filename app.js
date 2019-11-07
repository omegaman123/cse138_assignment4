const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
let EventEmitter = require('events');
const funcs = require('./functions.js');

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
let viewArr = {};
const ADDR = process.env.ADDRESS;
let INITIAL_VIEW = process.env.VIEW;
let ee = new EventEmitter();
let n = 0;

viewArr = funcs.strSpl(INITIAL_VIEW);
console.log(typeof viewArr);
console.log("ADDR: " + ADDR);
console.log("VIEW: " + viewArr);
console.log("LENGTH: " + viewArr.length);


app.get('/kv-store/', (req, res) => {
    res.send(keyv);
});


app.put('/kv-store/keys/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + req.body.value);

    let key = req.params.key;
    let val = req.body.value;
    let hsh = Math.abs(key.hashCode());
    console.log("HASH: " + hsh);

    let idx = hsh%viewArr.length;
    console.log(idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    if (target !== ADDR) {
        console.log("requesting from other node");
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

        axios.put('http://' + target + '/kv-store/keys/' + key,{
            "value":val
    }).then(
        response => {
        // console.log(response);
            res.status(response.status);
        if (response.data.replaced === true) {
            res.send({"message": "Added successfully", "replaced": true,"address":target})
        } else {
            res.send({"message": "Added successfully", "replaced": false,"address":target})
        }

    }).catch( error => {
            if (error.response) {
            res.status(error.response.status);
            res.send(error.response.data);
        } else if (error.request) {
            //console.log(error.request);
            res.status(503);
            res.send({"error":"Main instance is down","message":"Error in PUT"});
        } else {
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

app.get('/kv-store/keys/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);
    let key = req.params.key;
    let val = req.body.value;
    let hsh = Math.abs(key.hashCode());
    console.log("HASH: " + hsh);

    let idx = hsh%viewArr.length;
    console.log(idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    if (target !== ADDR) {
        console.log("requesting from main");
        axios.get('http://' + target + '/kv-store/' + key).then(
            response => {
            // console.log(response);
            res.status(response.status);
            res.send(response.data);
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
                res.send({"error":"Instance is down","message":"Error in GET"});
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
    let hsh = Math.abs(key.hashCode());
    console.log("HASH: " + hsh);

    let idx = hsh%viewArr.length;
    console.log(idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    if (target !== ADDR) {
        console.log("requesting from main");
        axios.delete('http://' + target + '/kv-store/' + key).then(
            response => {
            // console.log(response);
            res.status(response.status);
            res.send(response.data);
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
            res.send({"error":"Instance is down","message":"Error in DELETE"});
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

app.put('/kv-store/view-change/', (req, res) => {
    let nView = req.body.view;
    let nArr = funcs.strSpl(nView);


    console.log("\nNEW VIEW: " + nView);
    console.log("ARR: " + nArr);
    console.log("LENGTH: " + nArr.length);
    viewArr = nArr;
    console.log("VIEW CHANGE: " + viewArr);

    if (req.body.proliferate === false){
        console.log("PROLIF: FALSE");
        res.send({"ADR":ADDR,"VC":"OK"});
        return;
    }

    let acks = {};

    if (req.body.proliferate === undefined && req.body.proliferate !== false) {
        nArr.forEach(function (adr) {
            console.log("ADR: " + adr);
            if (adr === ADDR) {
                return;
            }
                console.log("Sending to " + adr);
                axios.put('http://' + adr + '/kv-store/view-change/',
                    {"view": nView, "proliferate": false}).then(
                    response => {
                        //increment count for nodes
                        console.log("VC MSG: " + response.data.ADR + " " + response.data.VC);
                        acks[response.data.ADR] = response.data.VC;
                        if (Object.keys(acks).length === nArr.length - 1){
                            ee.emit('message', nArr);
                        }
                    }).catch(error => {
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
                        res.send({"error":"Instance is down","message":"Error in VIEW-CHANGE"});
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        res.send(error.message);
                    }
                });
        });

        ee.once('rehash', function (viewResult) {
            console.log("rehash done...");
            try {
                res.send({"msg":"DONE REHASH", "n":n++});
                console.log("After res.send()");

            } catch (e) {
                console.log("EXCEPTION : " + e.stack);
            }

            console.log("After Try Catch.");
            console.log("EE LISTENERS: " + ee.listeners());
        });
    }
});

ee.on('message',function (arr) {
console.log("\nEVENT MESSAGE: " + arr);
let acks = {};
let nodeKeyNum = {};

arr.forEach(function (adr) {
    console.log("Sending rehash GO AHEAD to " + adr);
    axios.put('http://' + adr + '/kv-store/rehash/', {"view":arr}).then(
        response => {
        console.log("REHASH MSG : " + adr + " - " + response.data.msg);
         if (response.data.msg === "DONE"){
             acks[adr] = response.data.msg;
             nodeKeyNum[adr] = response.data.NUMKEYS;
         }
        if (Object.keys(acks).length === arr.length){
            console.log("ACKS: " + acks);
            console.log("Emitting event rehash...");
            ee.emit('rehash', nodeKeyNum);
        }
        }).catch(
            error => {
                console.log("ee.on message ADR: " + adr);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    // res.send(error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    //console.log(error.request);
                    console.log({"error":"Instance is down","message":"Error in VIEW-CHANGE"});

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);

                }
            });
    });
});




app.put('/kv-store/rehash/', (req, res) => {
    let view = req.body.view;
    console.log("\nREHASH WITH ARR " + view);

    Object.keys(keyv).forEach(function (key) {
       console.log("KEY: " + key + " VAL: " + keyv[key]);

       let hash = key.hashCode();
       let idx = hash%view.length;
       let target = view[idx];

       if (target === ADDR){
           return;
       }
       axios.put('http://' + target + '/kv-store/keys/' + key, {"value":keyv[key]}).then(
           response => {
               console.log(response.data);
               delete keyv[key];
       }).catch(
           error => {
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
                   res.send({"error":"Instance is down","message":"Error in VIEW-CHANGE"});
               } else {
                   // Something happened in setting up the request that triggered an Error
                   console.log('Error', error.message);
                   res.send(error.message);
               }
       });
   });
    res.send({"msg":"DONE","NUMKEYS":Object.keys(keyv).length});
});

app.get('/kv-store/key-count',(req, res) =>{
    res.send({"message":"Key count retrieved successfully","key-count": Object.keys(keyv).length});
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
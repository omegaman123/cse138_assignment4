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

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(13800);

let keyv = {};
let viewArr = {};
let replicas = [];
const ADDR = process.env.ADDRESS;
let INITIAL_VIEW = process.env.VIEW;
let ee = new EventEmitter();
let rFactor = 0;

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

    let idx = hsh % viewArr.length;
    console.log("ARR IDX: " + idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    if (target !== ADDR) {
        console.log("Forwarding PUT to proper node: " + target);
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

        axios.put('http://' + target + '/kv-store/keys/' + key, {
            "value": val
        }).then(
            response => {
                // console.log(response);
                res.status(response.status);
                if (response.data.replaced === true) {
                    res.send({"message": "Added successfully", "replaced": true, "address": target})
                } else {
                    res.send({"message": "Added successfully", "replaced": false, "address": target})
                }

            }).catch(error => {
            if (error.response) {
                res.status(error.response.status);
                res.send(error.response.data);
            } else if (error.request) {
                //console.log(error.request);
                res.status(503);
                res.send({"error": "Main instance is down", "message": "Error in PUT"});
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

//GET Request end point for specific key
app.get('/kv-store/keys/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);
    let key = req.params.key;
    let val = req.body.value;
    let hsh = Math.abs(key.hashCode());
    console.log("HASH: " + hsh);

    let idx = hsh % viewArr.length;
    console.log(idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    //
    if (target !== ADDR) {
        console.log("Forwarding GET to proper node: " + target);
        axios.get('http://' + target + '/kv-store/keys/' + key).then(
            response => {
                // console.log(response);
                if (response.data.doesExist === true) {
                    res.send({
                        "doesExist": true,
                        "message": "Retrieved successfully",
                        "value": response.data.value,
                        "address": target
                    });
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
                res.send({"error": "Instance is down", "message": "Error in GET"});
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

app.delete('/kv-store/keys/:key', (req, res) => {
    console.log('\n' + req.method + ": ");
    console.log("KEY: " + req.params.key);
    console.log("VALUE: " + keyv[req.params.key]);
    let key = req.params.key;
    let val = req.body.value;
    let hsh = Math.abs(key.hashCode());
    console.log("HASH: " + hsh);

    let idx = hsh % viewArr.length;
    console.log(idx);
    console.log("TARGET: " + viewArr[idx]);
    let target = viewArr[idx];

    //IF hash function target does not belong to current node, send to appropriate node in view
    if (target !== ADDR) {
        console.log("Forwarding DELETE to proper node : " + target);
        axios.delete('http://' + target + '/kv-store/keys/' + key).then(
            response => {
                // console.log(response);
                res.status(response.status);
                if (response.data.doesExist === true) {
                    res.send({"doesExist": true, "message": "Deleted successfully", "address": target})
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
                res.send({"error": "Instance is down", "message": "Error in DELETE"});
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

//Endpoint handling view changes, expects JSON object with 'view' field.
app.put('/kv-store/view-change/', (req, res) => {
    let nView = req.body.view;
    let rFactor = req.body["repl-factor"];
    if (nView.length % rFactor !== 0) {
        console.log("ERROR WITH rFactor - view array length does not match replication factor: "
            + nView.length + " - " + rFactor);
        res.status(400);
        res.send({"msg": "ERROR WITH Replication factor and view length"});
        return;
    }

    if (!nView.contains(ADDR)){
        res.status(400);
        res.send({"ERROR":"VIEW DOES NOT CONTAIN ADR", "ADR": ADDR});
        return;
    }

    //Split view into array and replace own view with new one
    console.log("\nNEW VIEW: " + nView);
    viewArr = nView;


    for (let i = 0; i < nView.length; i += rFactor) {

        let subArr = nView.slice(i, rFactor + i);
        let idx = subArr.indexOf(ADDR);
        if (idx !== -1) {
            subArr.splice(idx, 1);
            replicas = subArr;
            break;
        }
    }
    console.log("REPLICAS : " + replicas);

    res.status(200);
    res.send({"msg": "view change good"});
    return;
    //Check if view change message is to be proliferated to other nodes
    //Will be false if receiving view change message from other node
    if (req.body.proliferate === false) {
        console.log("PROLIF: FALSE");
        res.send({"ADR": ADDR, "VC": "OK"});
        return;
    }

    let acks = {};

    //If receiving view change from client, begin process for sending out view change to all nodes in view.
    if (req.body.proliferate === undefined && req.body.proliferate !== false) {
        nArr.forEach(function (adr) {
            console.log("ADR: " + adr);
            //Skip sending view to self
            if (adr === ADDR) {
                return;
            }
            console.log("Sending to " + adr);
            //Send view change to viewchange endpoint for other nodes, attaching proliferate:false to prevent
            // other nodes from sending out view change upon receiving it
            axios.put('http://' + adr + '/kv-store/view-change/',
                {"view": nView, "proliferate": false}).then(
                response => {
                    //increment count for nodes
                    console.log("VC MSG: " + response.data.ADR + " " + response.data.VC);
                    acks[response.data.ADR] = response.data.VC;
                    // Count the number of acknowledgements received, upon receiving all except own, emit event to
                    // trigger rehash across all nodes.
                    if (Object.keys(acks).length === nArr.length - 1) {
                        ee.emit('message', nArr);
                    }
                    //catch any errors from messages and return appropriate response
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
                    res.send({"error": "Instance is down", "message": "Error in VIEW-CHANGE"});
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    res.send(error.message);
                }
            });
        });

        // Once rehash is done, finally return back to the client. ee.once is used to avoid duplicate event listeners
        ee.once('rehash', function (viewResult) {
            console.log("rehash done...");
            try {
                res.send({"message": "View change successful", "shards": viewResult});

            } catch (e) {
                console.log("EXCEPTION : " + e.stack);
            }
        });
    }
});

// Upon receiving all acknowledgements regarding view change, begin to send out go ahead for rehashing of keys.
ee.on('message', function (arr) {
    console.log("\nEVENT MESSAGE: " + arr);
    let acks = {};

// For each address in the view, including the nodes own address, send out put message to rehash endpoint
    arr.forEach(function (adr) {
        console.log("Sending rehash GO AHEAD to " + adr);
        axios.put('http://' + adr + '/kv-store/rehash/', {"view": arr}).then(
            response => {
                console.log("REHASH MSG : " + adr + " - " + response.data.msg);
                //Tally all acknowledgments that are valid, upon reaching the appropriate number, emit rehash event to
                // signify  that the rehash is done
                if (response.data.msg === "DONE") {
                    acks[adr] = "OK";
                }
                if (Object.keys(acks).length === arr.length) {
                    // console.log("ACKS: " + acks);
                    console.log("Emitting event rehash...");
                    ee.emit('key-count', arr);
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
                    console.log({"error": "Instance is down", "message": "Error in VIEW-CHANGE"});

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                ee.emit('error', error);
            });
    });
});

ee.on('key-count', function (arr) {
    console.log("Beginning keycount requests...");
    let nodeNum = [];
    arr.forEach(function (adr) {
        console.log("Asking " + adr + " for key count...");
        axios.get('http://' + adr + '/kv-store/key-count').then(
            response => {
                console.log(response.data);
                if (response.data.message === "Key count retrieved successfully") {
                    nodeNum.push({"address": adr, "key-count": response.data["key-count"]});
                }
                if (Object.keys(nodeNum).length === arr.length) {
                    ee.emit('rehash', nodeNum);
                }
            }).catch(
            error => {
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
                    console.log({"error": "Instance is down", "message": "Error in VIEW-CHANGE"});

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                ee.emit('error', error);
            });

    });
});

// Endpoint to trigger a rehash of all keys stored on a node
app.put('/kv-store/rehash/', (req, res) => {
    let view = req.body.view;
    let nKeys = Object.keys(keyv).length;
    let count = 0;
    console.log("\nREHASH WITH ARR " + view);

    if (Object.keys(keyv).length === 0) {
        res.send({"msg": "DONE", "NUMKEYS": Object.keys(keyv).length});
        return;
    }

    Object.keys(keyv).forEach(function (key) {
        console.log("KEY: " + key + " VAL: " + keyv[key]);
        let hash = Math.abs(key.hashCode());
        let idx = hash % view.length;
        let target = view[idx];

        console.log("HASH: " + hash + " IDX: " + idx + " TARGET :" + target);


        if (target === ADDR) {
            count += 1;
            return;
        }

        // Send out a put request to newly hashed address, delete key from own store upon ack
        axios.put('http://' + target + '/kv-store/keys/' + key, {"value": keyv[key]}).then(
            response => {
                console.log(response.data);
                delete keyv[key];
                count += 1;
                if (count === nKeys) {
                    console.log("NUMKEYS: " + nKeys);
                    res.send({"msg": "DONE", "NUMKEYS": Object.keys(keyv).length});
                    return;
                }
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
                    console.log("DOWN " + target);
                    res.send({"error": "Instance is down", "message": "Error in VIEW-CHANGE"});
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    res.send(error.message);
                }
                return;
            });

    });

    if (count === nKeys) {
        console.log("NUMKEYS: " + nKeys);
        res.send({"msg": "DONE", "NUMKEYS": Object.keys(keyv).length});
        return;
    }

});

//Return number of keys stored in node recieving requests own key value store.
app.get('/kv-store/key-count', (req, res) => {
    res.send({"message": "Key count retrieved successfully", "key-count": Object.keys(keyv).length});
});


// catch all 404 and forward to error handler
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
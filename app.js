#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var pjson = require('./package.json');
var debug = require('debug')(pjson.name);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 7003);

var STAY_ALIVE = 10000;
var currentUsers = {}

// socket.io setup
io.on('connection', function(socket) {
    console.log('a user has connected');

    socket.on('updateLocation', function(data) {
        console.log('new location: ' + JSON.stringify(data));
        if (data.name in currentUsers)
            currentUsers[data.name] = { name: data.name };
        else
            currentUsers[data.name] = {};
        currentUsers[data.name].location = data.location;
        currentUsers[data.name].lastSeen = new Date().getTime();
        io.emit('updateLocation', data);
        setTimeout(function() {
            if (new Date().getTime() >= currentUsers[data.name].lastSeen + STAY_ALIVE) {
                io.emit('userGone', data.name);
                currentUsers[data.name] = {};
            }
        }, STAY_ALIVE);
    });
    console.log('sending initials');
    for (var u in currentUsers) {
        var toSend = { name: u.name, location: u.location };
        console.log(JSON.stringify(toSend));
        socket.emit('updateLocation', toSend);
    }

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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

var server = http.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

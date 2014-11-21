#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var pjson = require('./package.json');
var debug = require('debug')(pjson.name);

var defaultRoute = require('./routes/index');
var usersRoute = require('./routes/users');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', process.env.PORT || 7003);

var STAY_ALIVE = 5*60*1000;
var currentUsers = {};

// socket.io setup
function joinRoom(socket, data) {
    socket.join(data.room);
    if (!(data.room in currentUsers)) {
        currentUsers[data.room]={};
        console.log(JSON.stringify(currentUsers));
    }
    if (data.sendAll) {
        console.log('sending fulls to ' + data.name + ' in room ' + data.room);
        for (var u in currentUsers[data.room]) {
            var toSend = { name: currentUsers[data.room][u].name, location: currentUsers[data.room][u].location };
            socket.emit('updateLocation', toSend);
        }
    }
}

io.on('connection', function(socket) {
    console.log('a user has connected');

    socket.on('joinRoom', function(room) {
        joinRoom(socket, { room: room, sendAll: true });
    });

    socket.on('updateLocation', function(data) {
        if (!('name'     in data) ||
            !('room'     in data) ||
            !('location' in data) ||
            !('sendAll'  in data)) {
            console.log('hackers!');
            console.log(JSON.stringify(data));
            return;
        }
        joinRoom(socket, data);
        currentUsers[data.room][data.name] = { name: data.name, location: data.location, lastSeen: new Date().getTime()};

        io.to(data.room).emit('updateLocation', data);

        setTimeout(function() {
            if (new Date().getTime() >= currentUsers[data.room][data.name].lastSeen + STAY_ALIVE) {
                io.to(data.room).emit('userGone', data.name);
                console.log('removing ' + data.name);
                delete currentUsers[data.room][data.name];
            }
        }, STAY_ALIVE);
    });

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

app.use('/', defaultRoute);
app.use('/users', usersRoute);
app.use('/*', defaultRoute);

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

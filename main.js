var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    staticq = require('node-static'),
    file = new(staticq.Server)();

var port = process.env.PORT || 7070

http.createServer(function(req,res) {
    sys.puts(req.url + ' is being requested');
    if (req.url=='/') req.url='/sample.html';
    req.url = '/sample'+req.url;
    sys.puts(req.url + ' is being requested');
    sys.puts("Woah man someone is actually using this website!");
    file.serve(req,res);
//    res.write("Bonjour, monde");
//    res.end();
}).listen(port);

sys.puts("Server running on " + port);

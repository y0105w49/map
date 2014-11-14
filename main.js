var sys = require("sys"),
    http = require("http");

var port = process.env.PORT || 7070

http.createServer(function(req,res) {
  sys.puts("Woah man someone is actually using this website!");
  res.write("Bonjour, monde");
  res.end();
}).listen(port);

sys.puts("Server running on " + port);

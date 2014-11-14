var sys = require("sys"),
http    = require("http");

http.createServer(function(req,res) {
  sys.puts("Woah man someone is actually using this website!");
  res.write("Bonjour, monde");
  res.end();
}).listen(7002);

sys.puts("Server running on 7002");

#!/usr/bin/env node

var EventEmitter = require("events").EventEmitter;
var server = new EventEmitter();
global.server = server;

var http = require("http"),
    path = require("path"),
    mime = require("mime"),
    url = require("url"),
    fs = require("fs"),
    port = process.env.PORT || 4321,
    ip = "localhost";

global.projectRoot = path.resolve(__dirname);

// compatibility with node 0.6
if (!fs.exists) fs.exists = path.exists;

var allowSave = process.argv.indexOf("--allow-save") != -1;

module.exports = server;
exports = server;
server.setMaxListeners(1);

//Launch plugins
require("./erlang/erlang.js");

try {
    var httpServer;

    (function () {
        var receiveClient = function (req, res) {
            var uri = url.parse(req.url).pathname,
                filename = uri;

            if (exports.emit(uri, req, res, url.parse(req.url, true).query)) {
                return;
            }

            if (uri.length <= 1) {
                uri = "/erlhickey.html";
            }

            if (req.method == "PUT") {
                save(req, res, filename);
            }

            filename = process.cwd() + filename;
            fs.exists(filename, function (exists) {
                if (!exists) return error(res, 404, "404 Not Found\n");

                if (fs.statSync(filename).isDirectory()) {
                    var files = fs.readdirSync(filename);
                    res.writeHead(200, { "Content-Type": "text/html" });

                    files.push(".", "..");
                    var html = files.map(function (name) {
                        try {
                            var href = uri + "/" + name;
                            href = href.replace(/[\/\\]+/g, "/").replace(/\/$/g, "");
                            if (fs.statSync(filename + "/" + name + "/").isDirectory()) href += "/";

                            return "<a href='" + href + "'>" + name + "</a><br>";
                        } catch (e) {
                            return "";
                        }
                    });

                    res._hasBody && res.write(html.join(""));
                    res.end();
                    return;
                }

                fs.readFile(filename, "binary", function (err, file) {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.write(err + "\n");
                        res.end();
                        return;
                    }

                    var contentType = mime.lookup(filename) || "text/plain";
                    res.writeHead(200, { "Content-Type": contentType });
                    res.write(file, "binary");
                    res.end();
                });
            });
        };

        var error = function (res, status, message, error) {
            res.writeHead(status, { "Content-Type": "text/plain" });
            res.write(message);
            res.end();
        };

        var save = function (req, res, filePath) {
            var data = "";
            req.on("data", function (chunk) {
                data += chunk;
            });
            req.on("error", function () {
                error(res, 404, "Could't save file");
            });
            req.on("end", function () {
                try {
                    fs.writeFileSync(filePath, data);
                } catch (e) {
                    res.statusCode = 404;
                    res.end("Could't save file");
                    return;
                }
                res.statusCode = 200;
                res.end("OK");
            });
        };

        var getLocalIps = function () {
            var os = require("os");

            var interfaces = os.networkInterfaces ? os.networkInterfaces() : {};
            var addresses = [];
            for (var k in interfaces) {
                for (var k2 in interfaces[k]) {
                    var address = interfaces[k][k2];
                    if (address.family === "IPv4" && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
            return addresses;
        };

        httpServer = http.createServer(receiveClient);

        httpServer.on("error", function () {});
        httpServer.listen(port, ip);

        ;

        console.log("http://" + (ip == "0.0.0.0" ? getLocalIps()[0] : ip) + ":" + port);
    })();
} catch (e) {
    console.log("server already running");
}
//==================================================================
//=========================== ErlHickey ============================
//==================================================================
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWVybGFuZy9saWIvc2VydmVyL3N0YXRpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBUSxZQUFZLEdBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQTtBQUN0RCxJQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUd2QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3RCLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3RCLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3RCLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQ3BCLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ2xCLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJO0lBQy9CLEVBQUUsR0FBRyxXQUFXLENBQUE7O0FBR3BCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0FBSTdDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUNWLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFNUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRTNELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDakIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBRzFCLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUU5QixJQUFHO1FBQ0csVUFBVTs7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QUUsQ0FBQSxBQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDOztDQUMvRSxDQUFDLE9BQU0sQ0FBQyxFQUFFO0FBQ1QsV0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0NBQ3RDOzs7O0FBQUEiLCJmaWxlIjoiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZXJsYW5nL2xpYi9zZXJ2ZXIvc3RhdGljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxudmFyICAgICBFdmVudEVtaXR0ZXIgPSAgcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXJcbnZhciBzZXJ2ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5nbG9iYWwuc2VydmVyID0gc2VydmVyO1xuXG5cbnZhciBodHRwID0gcmVxdWlyZShcImh0dHBcIilcbiAgLCBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcbiAgLCBtaW1lID0gcmVxdWlyZShcIm1pbWVcIilcbiAgLCB1cmwgPSByZXF1aXJlKFwidXJsXCIpXG4gICwgZnMgPSByZXF1aXJlKFwiZnNcIilcbiAgLCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCA0MzIxXG4gICwgaXAgPSBcImxvY2FsaG9zdFwiXG5cblxuZ2xvYmFsLnByb2plY3RSb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSk7XG5cblxuLy8gY29tcGF0aWJpbGl0eSB3aXRoIG5vZGUgMC42XG5pZiAoIWZzLmV4aXN0cylcbiAgICBmcy5leGlzdHMgPSBwYXRoLmV4aXN0cztcblxudmFyIGFsbG93U2F2ZSA9IHByb2Nlc3MuYXJndi5pbmRleE9mKFwiLS1hbGxvdy1zYXZlXCIpICE9IC0xO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNlcnZlcjtcbmV4cG9ydHMgPSBzZXJ2ZXI7XG5zZXJ2ZXIuc2V0TWF4TGlzdGVuZXJzKDEpO1xuXG4vL0xhdW5jaCBwbHVnaW5zXG5yZXF1aXJlKFwiLi9lcmxhbmcvZXJsYW5nLmpzXCIpO1xuXG50cnl7XG4gIHZhciBodHRwU2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIocmVjZWl2ZUNsaWVudCk7XG4gIGh0dHBTZXJ2ZXIub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoKXt9KVxuICBodHRwU2VydmVyLmxpc3Rlbihwb3J0LCBpcCk7XG5cblxuZnVuY3Rpb24gcmVjZWl2ZUNsaWVudChyZXEsIHJlcykge1xuICAgIHZhciB1cmkgPSB1cmwucGFyc2UocmVxLnVybCkucGF0aG5hbWVcbiAgICAgICwgZmlsZW5hbWUgPSB1cmk7XG5cbiAgICBpZihleHBvcnRzLmVtaXQodXJpLCByZXEsIHJlcywgdXJsLnBhcnNlKHJlcS51cmwsIHRydWUpLnF1ZXJ5KSl7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKHVyaS5sZW5ndGggPD0gMSl7XG4gICAgICAgIHVyaSA9IFwiL2VybGhpY2tleS5odG1sXCJcbiAgICB9XG5cbiAgICBpZiAocmVxLm1ldGhvZCA9PSBcIlBVVFwiKSB7XG4gICAgICAgIHNhdmUocmVxLCByZXMsIGZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICBmaWxlbmFtZSA9IHByb2Nlc3MuY3dkKCkgKyBmaWxlbmFtZVxuICAgIGZzLmV4aXN0cyhmaWxlbmFtZSwgZnVuY3Rpb24oZXhpc3RzKSB7XG4gICAgICAgIGlmICghZXhpc3RzKVxuICAgICAgICAgICAgcmV0dXJuIGVycm9yKHJlcywgNDA0LCBcIjQwNCBOb3QgRm91bmRcXG5cIik7XG5cbiAgICAgICAgaWYgKGZzLnN0YXRTeW5jKGZpbGVuYW1lKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwge1wiQ29udGVudC1UeXBlXCI6IFwidGV4dC9odG1sXCJ9KTtcblxuICAgICAgICAgICAgZmlsZXMucHVzaChcIi5cIiwgXCIuLlwiKTtcbiAgICAgICAgICAgIHZhciBodG1sID0gZmlsZXMubWFwKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IHVyaSArIFwiL1wiICsgbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvW1xcL1xcXFxdKy9nLCBcIi9cIikucmVwbGFjZSgvXFwvJC9nLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZzLnN0YXRTeW5jKGZpbGVuYW1lICsgXCIvXCIgKyBuYW1lICsgXCIvXCIpLmlzRGlyZWN0b3J5KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmICs9IFwiL1wiO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIjxhIGhyZWY9J1wiICsgaHJlZiArIFwiJz5cIiArIG5hbWUgKyBcIjwvYT48YnI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVzLl9oYXNCb2R5ICYmIHJlcy53cml0ZShodG1sLmpvaW4oXCJcIikpO1xuICAgICAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnMucmVhZEZpbGUoZmlsZW5hbWUsIFwiYmluYXJ5XCIsIGZ1bmN0aW9uKGVyciwgZmlsZSkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNTAwLCB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9wbGFpblwiIH0pO1xuICAgICAgICAgICAgICAgIHJlcy53cml0ZShlcnIgKyBcIlxcblwiKTtcbiAgICAgICAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSBtaW1lLmxvb2t1cChmaWxlbmFtZSkgfHwgXCJ0ZXh0L3BsYWluXCI7XG4gICAgICAgICAgICByZXMud3JpdGVIZWFkKDIwMCwgeyBcIkNvbnRlbnQtVHlwZVwiOiBjb250ZW50VHlwZSB9KTtcbiAgICAgICAgICAgIHJlcy53cml0ZShmaWxlLCBcImJpbmFyeVwiKTtcbiAgICAgICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5mdW5jdGlvbiBlcnJvcihyZXMsIHN0YXR1cywgbWVzc2FnZSwgZXJyb3IpIHtcbiAgICByZXMud3JpdGVIZWFkKHN0YXR1cywgeyBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvcGxhaW5cIiB9KTtcbiAgICByZXMud3JpdGUobWVzc2FnZSk7XG4gICAgcmVzLmVuZCgpO1xufVxuXG5mdW5jdGlvbiBzYXZlKHJlcSwgcmVzLCBmaWxlUGF0aCkge1xuICAgIHZhciBkYXRhID0gXCJcIjtcbiAgICByZXEub24oXCJkYXRhXCIsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIGRhdGEgKz0gY2h1bms7XG4gICAgfSk7XG4gICAgcmVxLm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGVycm9yKHJlcywgNDA0LCBcIkNvdWxkJ3Qgc2F2ZSBmaWxlXCIpO1xuICAgIH0pO1xuICAgIHJlcS5vbihcImVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNDtcbiAgICAgICAgICAgIHJlcy5lbmQoXCJDb3VsZCd0IHNhdmUgZmlsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgcmVzLmVuZChcIk9LXCIpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRMb2NhbElwcygpIHtcbiAgICB2YXIgb3MgPSByZXF1aXJlKFwib3NcIik7XG5cbiAgICB2YXIgaW50ZXJmYWNlcyA9IG9zLm5ldHdvcmtJbnRlcmZhY2VzID8gb3MubmV0d29ya0ludGVyZmFjZXMoKSA6IHt9O1xuICAgIHZhciBhZGRyZXNzZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIGludGVyZmFjZXMpIHtcbiAgICAgICAgZm9yICh2YXIgazIgaW4gaW50ZXJmYWNlc1trXSkge1xuICAgICAgICAgICAgdmFyIGFkZHJlc3MgPSBpbnRlcmZhY2VzW2tdW2syXTtcbiAgICAgICAgICAgIGlmIChhZGRyZXNzLmZhbWlseSA9PT0gXCJJUHY0XCIgJiYgIWFkZHJlc3MuaW50ZXJuYWwpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzZXMucHVzaChhZGRyZXNzLmFkZHJlc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhZGRyZXNzZXM7XG59XG5cbmNvbnNvbGUubG9nKFwiaHR0cDovL1wiICsgKGlwID09IFwiMC4wLjAuMFwiID8gZ2V0TG9jYWxJcHMoKVswXSA6IGlwKSArIFwiOlwiICsgcG9ydCk7XG59IGNhdGNoKGUpIHtcbiAgY29uc29sZS5sb2coXCJzZXJ2ZXIgYWxyZWFkeSBydW5uaW5nXCIpXG59XG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT0gRXJsSGlja2V5ID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4iXX0=
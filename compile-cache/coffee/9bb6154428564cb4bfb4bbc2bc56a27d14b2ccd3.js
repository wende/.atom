(function() {
  var autocomplete, fs, inp, out, path, spawn, waitTillEnd;

  autocomplete = "autocomplete.exs";

  spawn = require('child_process').spawn;

  path = require('path');

  fs = require('fs');

  out = null;

  inp = null;

  exports.init = function(projectPaths) {
    var ac, array, p;
    p = path.join(__dirname, autocomplete);
    array = projectPaths;
    array.push(p);
    ac = spawn("elixir", array.reverse());
    out = ac.stdout;
    inp = ac.stdin;
    ac.stderr.on("data", function(e) {
      return console.log("Err: " + e);
    });
    return ac.on("close", function(e) {
      console.log("CLOSED " + e);
      return init();
    });
  };

  exports.getAutocompletion = function(prefix, cb) {
    if (prefix.trim().length < 1) {
      cb();
      return;
    }
    inp.write("a " + prefix + "\n");
    return waitTillEnd(function(chunk) {
      var multi, one, _, _ref;
      _ref = chunk.split("|"), _ = _ref[0], one = _ref[1], multi = _ref[2];
      return cb(one ? [one] : multi.split(","));
    });
  };

  exports.loadFile = function(path, cb) {
    if (cb == null) {
      cb = (function() {});
    }
    if (!/.ex$/.test(path)) {
      cb();
      return;
    }
    inp.write("l " + path + "\n");
    return waitTillEnd(cb || (function() {}));
  };

  waitTillEnd = function(cb) {
    var chunk, fn;
    chunk = "";
    fn = function(data) {
      chunk += data;
      if (~chunk.indexOf("ok.")) {
        out.removeListener("data", fn);
        return cb(chunk.replace("ok.", ""));
      }
    };
    return out.on("data", fn);
  };

}).call(this);

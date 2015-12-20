(function() {
  var IS_ELIXIR, Process, autocomplete, error, fs, inp, out, path, projectPaths, spawn, waitTillEnd;

  IS_ELIXIR = true;

  autocomplete = "autocompleter/autocomplete.exs";

  Process = require("atom").BufferedProcess;

  spawn = require('child_process').spawn;

  path = require('path');

  fs = require('fs');

  out = null;

  inp = null;

  projectPaths = null;

  error = function(e) {
    return atom.notifications.addError("Woops. Something went bananas \n Error: " + e);
  };

  exports.init = function(pP) {
    var ac, array, command, e, exit, name, p, setting, stderr;
    projectPaths = pP;
    p = path.join(__dirname, autocomplete);
    array = projectPaths;
    stderr = function(e) {};
    exit = function(e) {
      console.log("CLOSED " + e);
      return exports.init(projectPaths);
    };
    array.push(p);
    name = IS_ELIXIR ? 'autocomplete-elixir' : 'autocomplete-erlang';
    setting = atom.config.get("" + name + ".elixirPath").replace(/elixir$/, "");
    command = path.join(setting || "", "elixir");
    try {
      ac = new Process({
        command: command,
        args: array.reverse(),
        stderr: stderr,
        exit: exit
      });
    } catch (_error) {
      e = _error;
      error(e);
    }
    out = ac.process.stdout;
    return inp = ac.process.stdin;
  };

  exports.getAutocompletion = function(prefix, cb) {
    var cmd;
    if (!inp) {
      exports.init(projectPaths);
    }
    if (prefix.trim().length < 1) {
      cb();
      return;
    }
    cmd = IS_ELIXIR ? "a" : "ae";
    inp.write("" + cmd + " " + prefix + "\n");
    return waitTillEnd(function(chunk) {
      var multi, one, _, _ref;
      _ref = chunk.split("<>"), _ = _ref[0], one = _ref[1], multi = _ref[2];
      return cb({
        one: one,
        multi: multi.split(";").filter(function(a) {
          return a.trim();
        })
      });
    });
  };

  exports.loadFile = function(path, cb) {
    if (cb == null) {
      cb = (function() {});
    }
    if (!inp) {
      exports.init(projectPaths);
    }
    if (!/.ex$/.test(path)) {
      cb();
      return;
    }
    inp.write("l " + path + "\n");
    return waitTillEnd(function(chunk) {
      console.log("File load " + path + " -> " + chunk);
      if (cb) {
        return cb(chunk);
      }
    });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxnQ0FGZixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxlQUgxQixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FMakMsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFPQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FQTCxDQUFBOztBQUFBLEVBU0EsR0FBQSxHQUFNLElBVE4sQ0FBQTs7QUFBQSxFQVVBLEdBQUEsR0FBTyxJQVZQLENBQUE7O0FBQUEsRUFXQSxZQUFBLEdBQWUsSUFYZixDQUFBOztBQUFBLEVBYUEsS0FBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO1dBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE2QiwwQ0FBQSxHQUEwQyxDQUF2RSxFQUFQO0VBQUEsQ0FiUixDQUFBOztBQUFBLEVBZUEsT0FBTyxDQUFDLElBQVIsR0FBZSxTQUFDLEVBQUQsR0FBQTtBQUNiLFFBQUEscURBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxFQUFmLENBQUE7QUFBQSxJQUNBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FESixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsWUFGUixDQUFBO0FBQUEsSUFHQSxNQUFBLEdBQVMsU0FBQyxDQUFELEdBQUEsQ0FIVCxDQUFBO0FBQUEsSUFJQSxJQUFBLEdBQU8sU0FBQyxDQUFELEdBQUE7QUFBTyxNQUFBLE9BQU8sQ0FBQyxHQUFSLENB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang-2.0/lib/alchemide/wrapper.coffee
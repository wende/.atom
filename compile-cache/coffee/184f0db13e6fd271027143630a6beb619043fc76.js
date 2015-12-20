(function() {
  var IS_ELIXIR, Process, autocomplete, error, fs, inp, out, path, projectPaths, spawn, waitTillEnd;

  IS_ELIXIR = false;

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
    console.log(setting);
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
    error("test");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLEtBQVosQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxnQ0FGZixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxlQUgxQixDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsS0FMakMsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFPQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FQTCxDQUFBOztBQUFBLEVBU0EsR0FBQSxHQUFNLElBVE4sQ0FBQTs7QUFBQSxFQVVBLEdBQUEsR0FBTyxJQVZQLENBQUE7O0FBQUEsRUFXQSxZQUFBLEdBQWUsSUFYZixDQUFBOztBQUFBLEVBYUEsS0FBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO1dBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE2QiwwQ0FBQSxHQUEwQyxDQUF2RSxFQUFQO0VBQUEsQ0FiUixDQUFBOztBQUFBLEVBZUEsT0FBTyxDQUFDLElBQVIsR0FBZSxTQUFDLEVBQUQsR0FBQTtBQUNiLFFBQUEscURBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxFQUFmLENBQUE7QUFBQSxJQUNBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FESixDQUFBO0FBQUEsSUFFQSxLQUFBLEdBQVEsWUFGUixDQUFBO0FBQUEsSUFHQSxNQUFBLEdBQVMsU0FBQyxDQUFELEdBQUEsQ0FIVCxDQUFBO0FBQUEsSUFJQSxJQUFBLEdBQU8sU0FBQyxDQUFELEdBQUE7QUFBTyxNQUFBLE9BQU8sQ0FBQyxHQUFSLENB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang-2.0/lib/alchemide/wrapper.coffee
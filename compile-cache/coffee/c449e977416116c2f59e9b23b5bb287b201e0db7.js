(function() {
  var Process, autocomplete, fs, inp, out, path, projectPaths, spawn, waitTillEnd;

  autocomplete = "autocompleter/autocomplete.exs";

  Process = require("atom").BufferedProcess;

  spawn = require('child_process').spawn;

  path = require('path');

  fs = require('fs');

  out = null;

  inp = null;

  projectPaths = null;

  exports.init = function(pP) {
    var ac, array, command, exit, p, setting, stderr;
    projectPaths = pP;
    p = path.join(__dirname, autocomplete);
    array = projectPaths;
    stderr = function(e) {};
    exit = function(e) {
      console.log("CLOSED " + e);
      return exports.init(projectPaths);
    };
    array.push(p);
    setting = atom.config.get('autocomplete-elixir.elixirPath');
    command = path.join(setting || "", "elixir");
    console.log(setting);
    ac = new Process({
      command: command,
      args: array.reverse(),
      stderr: stderr,
      exit: exit
    });
    out = ac.process.stdout;
    return inp = ac.process.stdin;
  };

  exports.getAutocompletion = function(prefix, cb) {
    if (!inp) {
      exports.init(projectPaths);
    }
    if (prefix.trim().length < 1) {
      cb();
      return;
    }
    inp.write("a " + prefix + "\n");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGdDQUFmLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLGVBRDFCLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUhqQyxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQUtBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUxMLENBQUE7O0FBQUEsRUFPQSxHQUFBLEdBQU0sSUFQTixDQUFBOztBQUFBLEVBUUEsR0FBQSxHQUFPLElBUlAsQ0FBQTs7QUFBQSxFQVNBLFlBQUEsR0FBZSxJQVRmLENBQUE7O0FBQUEsRUFXQSxPQUFPLENBQUMsSUFBUixHQUFlLFNBQUMsRUFBRCxHQUFBO0FBQ2IsUUFBQSw0Q0FBQTtBQUFBLElBQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixZQUFyQixDQURKLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBUSxZQUZSLENBQUE7QUFBQSxJQUdBLE1BQUEsR0FBUyxTQUFDLENBQUQsR0FBQSxDQUhULENBQUE7QUFBQSxJQUlBLElBQUEsR0FBTyxTQUFDLENBQUQsR0FBQTtBQUFPLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxTQUFBLEdBQVMsQ0FBdEIsQ0FBQSxDQUFBO2FBQTRCLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBYixFQUFuQztJQUFBLENBSlAsQ0FBQTtBQUFBLElBTUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLENBTkEsQ0FBQTtBQUFBLElBT0EsT0FBQSxH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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/wrapper.coffee
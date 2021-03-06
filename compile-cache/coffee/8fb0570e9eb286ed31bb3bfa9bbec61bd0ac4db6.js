(function() {
  var IS_ELIXIR, Process, autocomplete, error, fs, inp, lastError, out, path, projectPaths, spawn, waitTillEnd;

  IS_ELIXIR = true;

  autocomplete = "autocompleter/autocomplete.exs";

  Process = require("atom").BufferedProcess;

  spawn = require('child_process').spawn;

  path = require('path');

  fs = require('fs');

  out = null;

  inp = null;

  projectPaths = null;

  lastError = null;

  error = function(e) {
    return atom.notifications.addError("Woops. Something went bananas \n Error: " + e);
  };

  exports.init = function(pP) {
    var ac, array, command, erlPath, exit, name, options, p, setting, stderr;
    projectPaths = pP;
    p = path.join(__dirname, autocomplete);
    array = projectPaths;
    stderr = function(e) {
      return lastError = console.log("Err: " + e);
    };
    exit = function(e) {
      console.error("CLOSED " + e + ", Last Error: " + lastError);
      return exports.init(projectPaths);
    };
    array.push(p);
    name = IS_ELIXIR ? 'autocomplete-elixir' : 'autocomplete-erlang';
    setting = atom.config.get("" + name + ".elixirPath").replace(/elixir$/, "");
    command = path.join(setting || "", "elixir");
    console.log("COMMAND " + command);
    erlPath = atom.config.get("" + name + ".erlangHome");
    if (!erlPath) {
      atom.notifications.addError('Erlang home configuration setting missing');
      return false;
    }
    options = {
      env: process.env
    };
    options.ERL_HOME = erlPath;
    options.ERL_PATH = path.join(erlPath, 'erl');
    console.log(setting);
    ac = new Process({
      command: command,
      options: options,
      args: array.reverse(),
      stderr: stderr,
      exit: exit,
      stdout: function() {}
    });
    if (!ac.process) {
      exports.init(pP);
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
    cmd = IS_ELIXIR ? "a" : "ea";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvd3JhcHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksSUFBWixDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLGdDQUZmLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLGVBSDFCLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUxqQyxDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVBMLENBQUE7O0FBQUEsRUFVQSxHQUFBLEdBQU0sSUFWTixDQUFBOztBQUFBLEVBV0EsR0FBQSxHQUFPLElBWFAsQ0FBQTs7QUFBQSxFQVlBLFlBQUEsR0FBZSxJQVpmLENBQUE7O0FBQUEsRUFhQSxTQUFBLEdBQVksSUFiWixDQUFBOztBQUFBLEVBZUEsS0FBQSxHQUFRLFNBQUMsQ0FBRCxHQUFBO1dBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE2QiwwQ0FBQSxHQUEwQyxDQUF2RSxFQUFQO0VBQUEsQ0FmUixDQUFBOztBQUFBLEVBaUJBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxFQUFELEdBQUE7QUFDYixRQUFBLG9FQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsRUFBZixDQUFBO0FBQUEsSUFDQSxDQUFBLEdBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFlBQXJCLENBREosQ0FBQTtBQUFBLElBRUEsS0FBQSxHQUFRLFlBRlIsQ0FB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

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/wrapper.coffee

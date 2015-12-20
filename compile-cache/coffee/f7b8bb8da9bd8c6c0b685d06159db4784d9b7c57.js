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
      return lastError = e;
    };
    exit = function(e) {
      console.error("CLOSED " + e + ", Last Error: " + lastError);
      return exports.init(projectPaths);
    };
    array.push(p);
    name = IS_ELIXIR ? 'autocomplete-elixir' : 'autocomplete-erlang';
    setting = atom.config.get("" + name + ".elixirPath").replace(/elixir$/, "");
    command = path.join(setting || "", "elixir");
    erlPath = atom.config.get("" + name + ".erlangHome");
    if (!erlPath) {
      atom.notifications.addError('Erlang home configuration setting missing');
      return false;
    }
    options = process.env;
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

(function() {
  var autocomplete, fs, inp, out, path, spawn, waitTillEnd;

  autocomplete = "autocompleter/autocomplete.exs";

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
    ac.on("close", function(e) {
      console.log("CLOSED " + e);
      return exports.init(projectPaths);
    });
    return ac.stdout.setMaxListeners(1);
  };

  exports.getAutocompletion = function(prefix, cb) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGdDQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsT0FBQSxHQUFPLENBQXBCLEVBQVA7SUFBQSxDQUFyQixDQU5BLENBQUE7QUFBQSxJQU9BLEVBQUUsQ0FBQyxFQUFILENBQU0sT0FB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/wrapper.coffee
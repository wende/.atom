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
    ac.stdout.on("data", function(e) {
      return console.log("Data: " + e);
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
    console.log("Loading file " + path);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsT0FBQSxHQUFPLENBQXBCLEVBQVA7SUFBQSxDQUFyQixDQU5BLENBQUE7QUFBQSxJQU9BLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
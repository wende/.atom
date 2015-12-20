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
    ac.stderr.on("error", function(e) {
      return console.err(e);
    });
    return ac.on("close", e(function() {
      return console.log("CLOSED " + e);
    }));
  };

  exports.getAutocompletion = function(prefix, cb) {
    inp.write("a " + prefix + "\n");
    return waitTillEnd(function(chunk) {
      var multi, one, _, _ref;
      _ref = chunk.split("|"), _ = _ref[0], one = _ref[1], multi = _ref[2];
      return cb(one ? [one] : multi.split(","));
    });
  };

  exports.loadFile = function(path, cb) {
    console.log("Loading file " + path);
    inp.write("l " + path + "\n");
    return waitTillEnd(cb);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsT0FBYixFQUFzQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBWixFQUFQO0lBQUEsQ0FBdEIsQ0FOQSxDQUFBO1dBT0EsRUFBRSxDQUFDLEVBQUgsQ0FBTSxPQUFOLEVBQWUsQ0FBQSxDQUFFLFNBQUEsR0FBQTthQUFHLE9BQU8sQ0FBQyxHQUFSLENBQWEsU0FBQSxHQUFTLENBQXRCLEVBQUg7SUFBQSxDQUFGLENBQWYsRUFSYTtFQUFBLENBVGYsQ0FBQTs7QUFBQSxFQW1CQSxPQUFPLENBQUMsaUJBQVIsR0FBNEIsU0FBQyxNQUFELEVBQVMsRUFBVCxHQUFBO0FBQzFCLElBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVyxJQUFBLEdBQUksTUFBSixHQUFXLElBQXRCLENBQUEsQ0FBQTtXQUNBLFdBQUEsQ0FBWSxTQUFDLEtBQUQsR0FBQTtBQUNWLFVBQUEsbUJBQUE7QUFBQSxNQUFBLE9BQWtCLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWixDQUFsQixFQUFDLFdBQUQsRUFBSSxhQUFKLEVBQVMsZUFBVCxDQUFBO2FBQ0EsRUFBQSxDQUFNLEdBQUgsR0FBWSxDQUFDLEdBQUQsQ0FBWixHQUF1QixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBMUIsRUFGVTtJQUFBLENBQVosRUFGMEI7RUFBQSxDQW5CNUIsQ0FBQTs7QUFBQSxFQXlCQSxPQUFPLENBQUMsUUFBUixHQUE0QixTQUFDLElBQUQsRUFBUyxFQUFULEdBQUE7QUFDMUIsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLGVBQUEsR0FBZSxJQUE1QixDQUFBLENBQUE7QUFBQSxJQUNBLEdBQUcsQ0FBQyxLQUFKLENBQVcsSUFBQSxHQUFJLElBQUosR0FBUyxJQUFwQixDQURBLENBQUE7V0FFQSxXQUFBLENBQVksRUFBWixFQUgwQjtFQUFBLENBekI1QixDQUFBOztBQUFBLEVBOEJBLFdBQUEsR0FBYyxTQUFDLEVBQUQsR0FBQTtBQUNaLFFBQUEsU0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLElBRUEsRUFBQSxHQUFLLFNBQUMsSUFBRCxHQUFBO0FBQ0gsTUFBQSxLQUFBLElBQVMsSUFBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsS0FBTSxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBQUo7QUFDRSxRQUFBLEdBQUcsQ0FBQyxjQUFKLENBQW1CLE1BQW5CLEVBQTJCLEVBQTNCLENBQUEsQ0FBQTtlQUNBLEVBQUEsQ0FBRyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIsRUFBckIsQ0FBSCxFQUZGO09BRkc7SUFBQSxDQUZMLENBQUE7V0FPQSxHQUFHLENBQUMsRUFBSixDQUFPLE1BQVAsRUFBZSxFQUFmLEVBUlk7RUFBQSxDQTlCZCxDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
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
    ac.stderr.on("datao", function(e) {
      return console.log("Err: " + e);
    });
    ac.stdout.on("data", function(e) {
      return console.log("Data: " + e);
    });
    return ac.on("close", function(e) {
      return console.log("CLOSED " + e);
    });
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
    if (!/.ex$/.test(path)) {
      cb();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsT0FBYixFQUFzQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsT0FBQSxHQUFPLENBQXBCLEVBQVA7SUFBQSxDQUF0QixDQU5BLENBQUE7QUFBQSxJQU9BLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBVixDQUFhLE1BQWIsRUFBcUIsU0FBQyxDQUFELEdBQUE7YUFBTyxPQUFPLENBQUMsR0FBUixDQUFhLFFBQUEsR0FBUSxDQUFyQixFQUFQO0lBQUEsQ0FBckIsQ0FQQSxDQUFBO1dBUUEsRUFBRSxDQUFDLEVBQUgsQ0FBTSxPQUFOLEVBQWUsU0FBQyxDQUFELEdBQUE7YUFBTyxPQUFPLENBQUMsR0FBUixDQUFhLFNBQUEsR0FBUyxDQUF0QixFQUFQO0lBQUEsQ0FBZixFQVRhO0VBQUEsQ0FUZixDQUFBOztBQUFBLEVBb0JBLE9BQU8sQ0FBQyxpQkFBUixHQUE0QixTQUFDLE1BQUQsRUFBUyxFQUFULEdBQUE7QUFDMUIsSUFBQSxHQUFHLENBQUMsS0FBSixDQUFXLElBQUEsR0FBSSxNQUFKLEdBQVcsSUFBdEIsQ0FBQSxDQUFBO1dBQ0EsV0FBQSxDQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsVUFBQSxtQkFBQTtBQUFBLE1BQUEsT0FBa0IsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLENBQWxCLEVBQUMsV0FBRCxFQUFJLGFBQUosRUFBUyxlQUFULENBQUE7YUFDQSxFQUFBLENBQU0sR0FBSCxHQUFZLENBQUMsR0FBRCxDQUFaLEdBQXVCLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWixDQUExQixFQUZVO0lBQUEsQ0FBWixFQUYwQjtFQUFBLENBcEI1QixDQUFBOztBQUFBLEVBMEJBLE9BQU8sQ0FBQyxRQUFSLEdBQTRCLFNBQUMsSUFBRCxFQUFTLEVBQVQsR0FBQTtBQUMxQixJQUFBLElBQUEsQ0FBQSxNQUFhLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBUDtBQUE4QixNQUFBLEVBQUEsQ0FBQSxDQUFBLENBQTlCO0tBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxHQUFSLENBQWEsZUFBQSxHQUFlLElBQTVCLENBREEsQ0FBQTtBQUFBLElBRUEsR0FBRyxDQUFDLEtBQUosQ0FBVyxJQUFBLEdBQUksSUFBSixHQUFTLElBQXBCLENBRkEsQ0FBQTtXQUdBLFdBQUEsQ0FBYSxFQUFBLElBQU0sQ0FBQyxTQUFBLEdBQUEsQ0FBRCxDQUFuQixFQUowQjtFQUFBLENBMUI1QixDQUFBOztBQUFBLEVBZ0NBLFdBQUEsR0FBYyxTQUFDLEVBQUQsR0FBQTtBQUNaLFFBQUEsU0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLElBRUEsRUFBQSxHQUFLLFNBQUMsSUFBRCxHQUFBO0FBQ0gsTUFBQSxLQUFBLElBQVMsSUFBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsS0FBTSxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBQUo7QUFDRSxRQUFBLEdBQUcsQ0FBQyxjQUFKLENBQW1CLE1BQW5CLEVBQTJCLEVBQTNCLENBQUEsQ0FBQTtlQUNBLEVBQUEsQ0FBRyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIsRUFBckIsQ0FBSCxFQUZGO09BRkc7SUFBQSxDQUZMLENBQUE7V0FPQSxHQUFHLENBQUMsRUFBSixDQUFPLE1BQVAsRUFBZSxFQUFmLEVBUlk7RUFBQSxDQWhDZCxDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
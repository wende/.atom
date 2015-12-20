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
      return console.log("Err: " + e);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsT0FBYixFQUFzQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsT0FBQSxHQUFPLENBQXBCLEVBQVA7SUFBQSxDQUF0QixDQU5BLENBQUE7V0FPQSxFQUFFLENBQUMsRUFBSCxDQUFNLE9BQU4sRUFBZSxTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsU0FBQSxHQUFTLENBQXRCLEVBQVA7SUFBQSxDQUFmLEVBUmE7RUFBQSxDQVRmLENBQUE7O0FBQUEsRUFtQkEsT0FBTyxDQUFDLGlCQUFSLEdBQTRCLFNBQUMsTUFBRCxFQUFTLEVBQVQsR0FBQTtBQUMxQixJQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVcsSUFBQSxHQUFJLE1BQUosR0FBVyxJQUF0QixDQUFBLENBQUE7V0FDQSxXQUFBLENBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLG1CQUFBO0FBQUEsTUFBQSxPQUFrQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBbEIsRUFBQyxXQUFELEVBQUksYUFBSixFQUFTLGVBQVQsQ0FBQTthQUNBLEVBQUEsQ0FBTSxHQUFILEdBQVksQ0FBQyxHQUFELENBQVosR0FBdUIsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLENBQTFCLEVBRlU7SUFBQSxDQUFaLEVBRjBCO0VBQUEsQ0FuQjVCLENBQUE7O0FBQUEsRUF5QkEsT0FBTyxDQUFDLFFBQVIsR0FBNEIsU0FBQyxJQUFELEVBQVMsRUFBVCxHQUFBO0FBQzFCLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxlQUFBLEdBQWUsSUFBNUIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxHQUFHLENBQUMsS0FBSixDQUFXLElBQUEsR0FBSSxJQUFKLEdBQVMsSUFBcEIsQ0FEQSxDQUFBO1dBRUEsV0FBQSxDQUFZLEVBQVosRUFIMEI7RUFBQSxDQXpCNUIsQ0FBQTs7QUFBQSxFQThCQSxXQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7QUFDWixRQUFBLFNBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxJQUVBLEVBQUEsR0FBSyxTQUFDLElBQUQsR0FBQTtBQUNILE1BQUEsS0FBQSxJQUFTLElBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLEtBQU0sQ0FBQyxPQUFOLENBQWMsS0FBZCxDQUFKO0FBQ0UsUUFBQSxHQUFHLENBQUMsY0FBSixDQUFtQixNQUFuQixFQUEyQixFQUEzQixDQUFBLENBQUE7ZUFDQSxFQUFBLENBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLEVBQXFCLEVBQXJCLENBQUgsRUFGRjtPQUZHO0lBQUEsQ0FGTCxDQUFBO1dBT0EsR0FBRyxDQUFDLEVBQUosQ0FBTyxNQUFQLEVBQWUsRUFBZixFQVJZO0VBQUEsQ0E5QmQsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
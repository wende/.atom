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
    return ac.stderr.on("error", function(e) {
      throw e;
    });
  };

  exports.getAutocompletion = function(prefix, cb) {
    inp.write("a " + prefix + "\n");
    return waitTillEnd(function(chunk) {
      var multi, one, _, _ref;
      _ref = chunk.split("|"), _ = _ref[0], one = _ref[1], multi = _ref[2];
      return cb(one ? one : multi.split(","));
    });
  };

  exports.loadFile = function(path, cb) {
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
        return cb(chunk);
      }
    };
    return out.on("data", fn);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtXQU1BLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBVixDQUFhLE9BQWIsRUFBc0IsU0FBQyxDQUFELEdBQUE7QUFBTyxZQUFNLENBQU4sQ0FBUDtJQUFBLENBQXRCLEVBUGE7RUFBQSxDQVRmLENBQUE7O0FBQUEsRUFrQkEsT0FBTyxDQUFDLGlCQUFSLEdBQTRCLFNBQUMsTUFBRCxFQUFTLEVBQVQsR0FBQTtBQUMxQixJQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVcsSUFBQSxHQUFJLE1BQUosR0FBVyxJQUF0QixDQUFBLENBQUE7V0FDQSxXQUFBLENBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLG1CQUFBO0FBQUEsTUFBQSxPQUFrQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBbEIsRUFBQyxXQUFELEVBQUksYUFBSixFQUFTLGVBQVQsQ0FBQTthQUNBLEVBQUEsQ0FBTSxHQUFILEdBQVksR0FBWixHQUFxQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBeEIsRUFGVTtJQUFBLENBQVosRUFGMEI7RUFBQSxDQWxCNUIsQ0FBQTs7QUFBQSxFQXdCQSxPQUFPLENBQUMsUUFBUixHQUE0QixTQUFDLElBQUQsRUFBUyxFQUFULEdBQUE7QUFDMUIsSUFBQSxHQUFHLENBQUMsS0FBSixDQUFXLElBQUEsR0FBSSxJQUFKLEdBQVMsSUFBcEIsQ0FBQSxDQUFBO1dBQ0EsV0FBQSxDQUFZLEVBQVosRUFGMEI7RUFBQSxDQXhCNUIsQ0FBQTs7QUFBQSxFQTRCQSxXQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7QUFDWixRQUFBLFNBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxJQUVBLEVBQUEsR0FBSyxTQUFDLElBQUQsR0FBQTtBQUNILE1BQUEsS0FBQSxJQUFTLElBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLEtBQU0sQ0FBQyxPQUFOLENBQWMsS0FBZCxDQUFKO0FBQ0UsUUFBQSxHQUFHLENBQUMsY0FBSixDQUFtQixNQUFuQixFQUEyQixFQUEzQixDQUFBLENBQUE7ZUFDQSxFQUFBLENBQUcsS0FBSCxFQUZGO09BRkc7SUFBQSxDQUZMLENBQUE7V0FPQSxHQUFHLENBQUMsRUFBSixDQUFPLE1BQVAsRUFBZSxFQUFmLEVBUlk7RUFBQSxDQTVCZCxDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
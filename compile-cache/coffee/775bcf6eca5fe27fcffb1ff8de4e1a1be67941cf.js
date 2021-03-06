(function() {
  var autocomplete, fs, inp, out, path, spawn, waitTillEnd;

  autocomplete = "autocomplete.exs";

  spawn = require('child_process').spawn;

  path = require('path');

  fs = require('fs');

  out = null;

  inp = null;

  exports.init = function(projectPath) {
    var ac, p;
    p = path.join(__dirname, autocomplete);
    ac = spawn("elixir", [p, projectPath]);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxXQUFELEdBQUE7QUFDYixRQUFBLEtBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZSxDQUFDLENBQUQsRUFBSSxXQUFKLENBQWYsQ0FETixDQUFBO0FBQUEsSUFFQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE1BRlQsQ0FBQTtBQUFBLElBR0EsR0FBQSxHQUFPLEVBQUUsQ0FBQyxLQUhWLENBQUE7V0FJQSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFNBQUMsQ0FBRCxHQUFBO0FBQU8sWUFBTSxDQUFOLENBQVA7SUFBQSxDQUF0QixFQUxhO0VBQUEsQ0FUZixDQUFBOztBQUFBLEVBZ0JBLE9BQU8sQ0FBQyxpQkFBUixHQUE0QixTQUFDLE1BQUQsRUFBUyxFQUFULEdBQUE7QUFDMUIsSUFBQSxHQUFHLENBQUMsS0FBSixDQUFXLElBQUEsR0FBSSxNQUFKLEdBQVcsSUFBdEIsQ0FBQSxDQUFBO1dBQ0EsV0FBQSxDQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsVUFBQSxtQkFBQTtBQUFBLE1BQUEsT0FBa0IsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLENBQWxCLEVBQUMsV0FBRCxFQUFJLGFBQUosRUFBUyxlQUFULENBQUE7YUFDQSxFQUFBLENBQU0sR0FBSCxHQUFZLEdBQVosR0FBcUIsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLENBQXhCLEVBRlU7SUFBQSxDQUFaLEVBRjBCO0VBQUEsQ0FoQjVCLENBQUE7O0FBQUEsRUFzQkEsT0FBTyxDQUFDLFFBQVIsR0FBNEIsU0FBQyxJQUFELEVBQVMsRUFBVCxHQUFBO0FBQzFCLElBQUEsR0FBRyxDQUFDLEtBQUosQ0FBVyxJQUFBLEdBQUksSUFBSixHQUFTLElBQXBCLENBQUEsQ0FBQTtXQUNBLFdBQUEsQ0FBWSxFQUFaLEVBRjBCO0VBQUEsQ0F0QjVCLENBQUE7O0FBQUEsRUEwQkEsV0FBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO0FBQ1osUUFBQSxTQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsSUFFQSxFQUFBLEdBQUssU0FBQyxJQUFELEdBQUE7QUFDSCxNQUFBLEtBQUEsSUFBUyxJQUFULENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxLQUFNLENBQUMsT0FBTixDQUFjLEtBQWQsQ0FBSjtBQUNFLFFBQUEsR0FBRyxDQUFDLGNBQUosQ0FBbUIsTUFBbkIsRUFBMkIsRUFBM0IsQ0FBQSxDQUFBO2VBQ0EsRUFBQSxDQUFHLEtBQUgsRUFGRjtPQUZHO0lBQUEsQ0FGTCxDQUFBO1dBT0EsR0FBRyxDQUFDLEVBQUosQ0FBTyxNQUFQLEVBQWUsRUFBZixFQVJZO0VBQUEsQ0ExQmQsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
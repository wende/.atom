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
      return cb({
        one: one,
        multi: multi
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLGtCQUFmLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsQ0FBQyxLQUZqQyxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFNQSxHQUFBLEdBQU0sSUFOTixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFPLElBUFAsQ0FBQTs7QUFBQSxFQVNBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxZQUFELEdBQUE7QUFDYixRQUFBLFlBQUE7QUFBQSxJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBSixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsWUFEUixDQUFBO0FBQUEsSUFFQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFHQSxFQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFoQixDQUhOLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxFQUFFLENBQUMsTUFKVCxDQUFBO0FBQUEsSUFLQSxHQUFBLEdBQU8sRUFBRSxDQUFDLEtBTFYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFWLENBQWEsTUFBYixFQUFxQixTQUFDLENBQUQsR0FBQTthQUFPLE9BQU8sQ0FBQyxHQUFSLENBQWEsT0FBQSxHQUFPLENBQXBCLEVBQVA7SUFBQSxDQUFyQixDQU5BLENBQUE7V0FPQSxFQUFFLENBQUMsRUFBSCxDQUFNLE9BQU4sRUFBZSxTQUFDLENBQUQsR0FBQTtBQUFPLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxTQUFBLEdBQVMsQ0FBdEIsQ0FBQSxDQUFBO2FBQTRCLElBQUEsQ0FBQSxFQUFuQztJQUFBLENBQWYsRUFSYTtFQUFBLENBVGYsQ0FBQTs7QUFBQSxFQW1CQSxPQUFPLENBQUMsaUJBQVIsR0FBNEIsU0FBQyxNQUFELEVBQVMsRUFBVCxHQUFBO0FBQzFCLElBQUEsSUFBRyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQWEsQ0FBQyxNQUFkLEdBQXVCLENBQTFCO0FBQ0UsTUFBQSxFQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxDQUZGO0tBQUE7QUFBQSxJQUdBLEdBQUcsQ0FBQyxLQUFKLENBQVcsSUFBQSxHQUFJLE1BQUosR0FBVyxJQUF0QixDQUhBLENBQUE7V0FJQSxXQUFBLENBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLG1CQUFBO0FBQUEsTUFBQSxPQUFrQixLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBbEIsRUFBQyxXQUFELEVBQUksYUFBSixFQUFTLGVBQVQsQ0FBQTthQUNBLEVBQUEsQ0FBRztBQUFBLFFBQUMsS0FBQSxHQUFEO0FBQUEsUUFBTSxPQUFBLEtBQU47T0FBSCxFQUZVO0lBQUEsQ0FBWixFQUwwQjtFQUFBLENBbkI1QixDQUFBOztBQUFBLEVBNEJBLE9BQU8sQ0FBQyxRQUFSLEdBQTRCLFNBQUMsSUFBRCxFQUFTLEVBQVQsR0FBQTs7TUFBUyxLQUFLLENBQUMsU0FBQSxHQUFBLENBQUQ7S0FDeEM7QUFBQSxJQUFBLElBQUEsQ0FBQSxNQUFhLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBUDtBQUNFLE1BQUEsRUFBQSxDQUFBLENBQUEsQ0FBQTtBQUNBLFlBQUEsQ0FGRjtLQUFBO0FBQUEsSUFHQSxHQUFHLENBQUMsS0FBSixDQUFXLElBQUEsR0FBSSxJQUFKLEdBQVMsSUFBcEIsQ0FIQSxDQUFBO1dBSUEsV0FBQSxDQUFhLEVBQUEsSUFBTSxDQUFDLFNBQUEsR0FBQSxDQUFELENBQW5CLEVBTDBCO0VBQUEsQ0E1QjVCLENBQUE7O0FBQUEsRUFtQ0EsV0FBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO0FBQ1osUUFBQSxTQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsSUFFQSxFQUFBLEdBQUssU0FBQyxJQUFELEdBQUE7QUFDSCxNQUFBLEtBQUEsSUFBUyxJQUFULENBQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxLQUFNLENBQUMsT0FBTixDQUFjLEtBQWQsQ0FBSjtBQUNFLFFBQUEsR0FBRyxDQUFDLGNBQUosQ0FBbUIsTUFBbkIsRUFBMkIsRUFBM0IsQ0FBQSxDQUFBO2VBQ0EsRUFBQSxDQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBZCxFQUFxQixFQUFyQixDQUFILEVBRkY7T0FGRztJQUFBLENBRkwsQ0FBQTtXQU9BLEdBQUcsQ0FBQyxFQUFKLENBQU8sTUFBUCxFQUFlLEVBQWYsRUFSWTtFQUFBLENBbkNkLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/new/wrapper.coffee
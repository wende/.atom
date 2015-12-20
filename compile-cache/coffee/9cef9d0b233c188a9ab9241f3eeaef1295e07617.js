(function() {
  var wordRegex,
    __slice = [].slice;

  wordRegex = /[a-zA-Z0-9.:]*/;

  module.exports.jump = function(editor) {
    var found, fun, mod, word, _ref;
    word = editor.getWordUnderCursor({
      wordRegex: wordRegex
    });
    console.log(word);
    _ref = word.split(".").reverse(), fun = _ref[0], mod = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    mod.reverse();
    console.log([fun, mod]);
    if (!mod.length) {
      console.log("local jump " + fun);
      found = false;
      editor.scan(new RegExp("def(macro)? " + fun), function(m) {
        editor.setCursorBufferPosition(m.range.start);
        return found = true;
      });
      if (!found) {
        return atom.notification.addInfo("No " + fun + " definition found");
      }
    } else {
      return 1;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvanVtcHRvZGVmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksZ0JBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZixHQUFzQixTQUFDLE1BQUQsR0FBQTtBQUNwQixRQUFBLDJCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQTBCO0FBQUEsTUFBQyxXQUFBLFNBQUQ7S0FBMUIsQ0FBUCxDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosQ0FEQSxDQUFBO0FBQUEsSUFFQSxPQUFnQixJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBZSxDQUFDLE9BQWhCLENBQUEsQ0FBaEIsRUFBQyxhQUFELEVBQU0sbURBRk4sQ0FBQTtBQUFBLElBR0EsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUhBLENBQUE7QUFBQSxJQUlBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixDQUFaLENBSkEsQ0FBQTtBQUtBLElBQUEsSUFBRyxDQUFBLEdBQUksQ0FBQyxNQUFSO0FBQ0UsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLGFBQUEsR0FBYSxHQUExQixDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxLQURSLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxJQUFQLENBQWdCLElBQUEsTUFBQSxDQUFRLGNBQUEsR0FBYyxHQUF0QixDQUFoQixFQUE4QyxTQUFDLENBQUQsR0FBQTtBQUM1QyxRQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQXZDLENBQUEsQ0FBQTtlQUNBLEtBQUEsR0FBUSxLQUZvQztNQUFBLENBQTlDLENBRkEsQ0FBQTtBQUtBLE1BQUEsSUFBQSxDQUFBLEtBQUE7ZUFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQWxCLENBQTJCLEtBQUEsR0FBSyxHQUFMLEdBQVMsbUJBQXBDLEVBQUE7T0FORjtLQUFBLE1BQUE7YUFTRSxFQVRGO0tBTm9CO0VBQUEsQ0FGdEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/jumptodef.coffee

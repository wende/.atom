(function() {
  var wordRegex,
    __slice = [].slice;

  wordRegex = /[a-zA-Z0-9.:]*/;

  module.exports.jump = function(editor) {
    var fun, mod, word, _ref;
    word = editor.getWordUnderCursor({
      wordRegex: wordRegex
    });
    console.log(word);
    _ref = word.split(".").reverse(), fun = _ref[0], mod = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    mod.reverse();
    console.log([fun, mod]);
    if (!mod.length) {
      console.log("local jump " + fun);
      return editor.scan(new RegExp("def(macro)? " + fun), function(m) {
        return editor.setCursorBufferPosition(m.range.start);
      });
    } else {
      return 1;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvanVtcHRvZGVmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksZ0JBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZixHQUFzQixTQUFDLE1BQUQsR0FBQTtBQUNwQixRQUFBLG9CQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQTBCO0FBQUEsTUFBQyxXQUFBLFNBQUQ7S0FBMUIsQ0FBUCxDQUFBO0FBQUEsSUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosQ0FEQSxDQUFBO0FBQUEsSUFFQSxPQUFnQixJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBZSxDQUFDLE9BQWhCLENBQUEsQ0FBaEIsRUFBQyxhQUFELEVBQU0sbURBRk4sQ0FBQTtBQUFBLElBR0EsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUhBLENBQUE7QUFBQSxJQUlBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxHQUFELEVBQU0sR0FBTixDQUFaLENBSkEsQ0FBQTtBQUtBLElBQUEsSUFBRyxDQUFBLEdBQUksQ0FBQyxNQUFSO0FBQ0UsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLGFBQUEsR0FBYSxHQUExQixDQUFBLENBQUE7YUFDQSxNQUFNLENBQUMsSUFBUCxDQUFnQixJQUFBLE1BQUEsQ0FBUSxjQUFBLEdBQWMsR0FBdEIsQ0FBaEIsRUFBOEMsU0FBQyxDQUFELEdBQUE7ZUFDNUMsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBdkMsRUFENEM7TUFBQSxDQUE5QyxFQUZGO0tBQUEsTUFBQTthQUtFLEVBTEY7S0FOb0I7RUFBQSxDQUZ0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/jumptodef.coffee

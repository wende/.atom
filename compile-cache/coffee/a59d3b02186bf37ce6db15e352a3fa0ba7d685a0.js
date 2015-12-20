(function() {
  var wordRegex;

  wordRegex = /[a-zA-Z0-9.:]*/;

  module.exports.jump = function(editor) {
    var word;
    word = editor.getWordUnderCursor({
      wordRegex: wordRegex
    });
    return console.log(word);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvanVtcHRvZGVmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLGdCQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQWYsR0FBc0IsU0FBQyxNQUFELEdBQUE7QUFDcEIsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQTBCO0FBQUEsTUFBQyxXQUFBLFNBQUQ7S0FBMUIsQ0FBUCxDQUFBO1dBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLEVBRm9CO0VBQUEsQ0FGdEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/jumptodef.coffee

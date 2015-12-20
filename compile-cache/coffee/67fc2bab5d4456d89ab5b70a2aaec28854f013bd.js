(function() {
  var wordRegex;

  wordRegex = /[a-zA-Z0-9.:]/;

  module.exports.jump = function(editor) {
    var word;
    word = editor.getWordUnderCursor({
      wordRegex: wordRegex
    });
    return console.log(word);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvanVtcHRvZGVmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxTQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLGVBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBZixHQUFzQixTQUFDLE1BQUQsR0FBQTtBQUNwQixRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsa0JBQVAsQ0FBMEI7QUFBQSxNQUFDLFdBQUEsU0FBRDtLQUExQixDQUFQLENBQUE7V0FDQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosRUFGb0I7RUFBQSxDQUZ0QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/jumptodef.coffee

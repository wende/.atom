(function() {
  var DO, END;

  DO = "do";

  END = "end";

  module.exports.handleMatch = function(editor, e) {
    var word;
    console.log(editor);
    word = editor.getWordUnderCursor();
    return console.log(word);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvZG9lbmRtYXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLElBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQWYsR0FBNkIsU0FBQyxNQUFELEVBQVMsQ0FBVCxHQUFBO0FBQzNCLFFBQUEsSUFBQTtBQUFBLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBRFAsQ0FBQTtXQUVBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWixFQUgyQjtFQUFBLENBSDdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/doendmatcher.coffee

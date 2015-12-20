(function() {
  var DO, DOEND, END;

  DO = "do";

  END = "end";

  DOEND = /(do|end)/;

  module.exports.handleMatch = function(editor, e) {
    var bufferPos, fromBeginning, lastLineNo, toEnd, word;
    lastLineNo = editor.buffer.lines.length - 1;
    bufferPos = e.cursor.getBufferPosition().toArray();
    console.log(bufferPos);
    fromBeginning = new Range([0, 0], bufferPos);
    toEnd = new Range(bufferPos, [lastLineNo, 0]);
    console.log(editor);
    word = editor.getWordUnderCursor();
    console.log(word);
    if (word === DO) {
      console.log(toEnd);
      editor.scanInBufferRange(DOEND, toEnd, function(m) {
        return console.log(m.matchText);
      });
    }
    if (word === END) {
      console.log(fromBeginning);
      return editor.backwardsScanInBufferRange(DOEND, fromBeginning, function(m) {
        return console.log(m.matchText);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvZG9lbmRtYXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLElBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsVUFGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFmLEdBQTZCLFNBQUMsTUFBRCxFQUFTLENBQVQsR0FBQTtBQUMzQixRQUFBLGlEQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBcEIsR0FBNkIsQ0FBMUMsQ0FBQTtBQUFBLElBQ0EsU0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQVQsQ0FBQSxDQUE0QixDQUFDLE9BQTdCLENBQUEsQ0FEWixDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQVosQ0FGQSxDQUFBO0FBQUEsSUFHQSxhQUFBLEdBQW9CLElBQUEsS0FBQSxDQUFNLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBTixFQUFhLFNBQWIsQ0FIcEIsQ0FBQTtBQUFBLElBSUEsS0FBQSxHQUFvQixJQUFBLEtBQUEsQ0FBTSxTQUFOLEVBQWlCLENBQUMsVUFBRCxFQUFhLENBQWIsQ0FBakIsQ0FKcEIsQ0FBQTtBQUFBLElBTUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaLENBTkEsQ0FBQTtBQUFBLElBT0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBUFAsQ0FBQTtBQUFBLElBUUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBUkEsQ0FBQTtBQVNBLElBQUEsSUFBRyxJQUFBLEtBQVEsRUFBWDtBQUNFLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLGlCQUFQLENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLEVBQXVDLFNBQUMsQ0FBRCxHQUFBO2VBQ3JDLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxDQUFDLFNBQWQsRUFEcUM7TUFBQSxDQUF2QyxDQURBLENBREY7S0FUQTtBQWFBLElBQUEsSUFBRyxJQUFBLEtBQVEsR0FBWDtBQUNFLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxhQUFaLENBQUEsQ0FBQTthQUNBLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxLQUFsQyxFQUF5QyxhQUF6QyxFQUF3RCxTQUFDLENBQUQsR0FBQTtlQUN0RCxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsQ0FBQyxTQUFkLEVBRHNEO01BQUEsQ0FBeEQsRUFGRjtLQWQyQjtFQUFBLENBSjdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/doendmatcher.coffee
(function() {
  var DO, DOEND, END, FN, Point, Range, _ref;

  DO = "do";

  END = "end";

  FN = "fn";

  DOEND = /(do|end|fn)/;

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  module.exports.handleMatch = function(editor, e) {
    var bufferPos, counter, fromBeginning, lastLineNo, toEnd, word;
    lastLineNo = editor.buffer.lines.length - 1;
    bufferPos = e.cursor.getBufferPosition().toArray();
    console.log(bufferPos);
    fromBeginning = new Range([0, 0], bufferPos);
    toEnd = new Range(bufferPos, [lastLineNo, 0]);
    word = editor.getWordUnderCursor();
    counter = 0;
    if (word === DO) {
      editor.scanInBufferRange(DOEND, toEnd, function(_arg) {
        var decoration, m, marker, r;
        r = _arg.range, m = _arg.matchText;
        if (m === DO || m === FN) {
          counter++;
        }
        if (m === END && counter) {
          return counter--;
        } else {
          marker = editor.markBufferRange(r);
          return decoration = editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'elixir-highlight'
          });
        }
      });
    }
    if (word === END) {
      return editor.backwardsScanInBufferRange(DOEND, fromBeginning, function(m) {
        if (m === END) {
          counter++;
        }
        if ((m === DO || m === FN) && counter) {
          return counter--;
        } else {
          return console.log("found");
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvZG9lbmRtYXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sS0FETixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLElBRkwsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxhQUhSLENBQUE7O0FBQUEsRUFJQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FKUixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFmLEdBQTZCLFNBQUMsTUFBRCxFQUFTLENBQVQsR0FBQTtBQUMzQixRQUFBLDBEQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBcEIsR0FBNkIsQ0FBMUMsQ0FBQTtBQUFBLElBQ0EsU0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQVQsQ0FBQSxDQUE0QixDQUFDLE9BQTdCLENBQUEsQ0FEWixDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLFNBQVosQ0FGQSxDQUFBO0FBQUEsSUFHQSxhQUFBLEdBQW9CLElBQUEsS0FBQSxDQUFNLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBTixFQUFhLFNBQWIsQ0FIcEIsQ0FBQTtBQUFBLElBSUEsS0FBQSxHQUFvQixJQUFBLEtBQUEsQ0FBTSxTQUFOLEVBQWlCLENBQUMsVUFBRCxFQUFhLENBQWIsQ0FBakIsQ0FKcEIsQ0FBQTtBQUFBLElBTUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBTlAsQ0FBQTtBQUFBLElBT0EsT0FBQSxHQUFVLENBUFYsQ0FBQTtBQVFBLElBQUEsSUFBRyxJQUFBLEtBQVEsRUFBWDtBQUNFLE1BQUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLEVBQXVDLFNBQUMsSUFBRCxHQUFBO0FBQ3JDLFlBQUEsd0JBQUE7QUFBQSxRQUQ4QyxTQUFQLE9BQXFCLFNBQVgsU0FDakQsQ0FBQTtBQUFBLFFBQUEsSUFBRyxDQUFBLEtBQUssRUFBTCxJQUFXLENBQUEsS0FBSyxFQUFuQjtBQUEyQixVQUFBLE9BQUEsRUFBQSxDQUEzQjtTQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUEsS0FBSyxHQUFMLElBQVksT0FBZjtpQkFBNEIsT0FBQSxHQUE1QjtTQUFBLE1BQUE7QUFFRSxVQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsZUFBUCxDQUF1QixDQUF2QixDQUFULENBQUE7aUJBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCO0FBQUEsWUFBQyxJQUFBLEVBQU0sV0FBUDtBQUFBLFlBQW9CLE9BQUEsRUFBTyxrQkFBM0I7V0FBOUIsRUFIZjtTQUZxQztNQUFBLENBQXZDLENBQUEsQ0FERjtLQVJBO0FBZUEsSUFBQSxJQUFHLElBQUEsS0FBUSxHQUFYO2FBQ0UsTUFBTSxDQUFDLDBCQUFQLENBQWtDLEtBQWxDLEVBQXlDLGFBQXpDLEVBQXdELFNBQUMsQ0FBRCxHQUFBO0FBQ3RELFFBQUEsSUFBRyxDQUFBLEtBQUssR0FBUjtBQUFpQixVQUFBLE9BQUEsRUFBQSxDQUFqQjtTQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUMsQ0FBQSxLQUFLLEVBQUwsSUFBVyxDQUFBLEtBQUssRUFBakIsQ0FBQSxJQUF3QixPQUEzQjtpQkFBd0MsT0FBQSxHQUF4QztTQUFBLE1BQUE7aUJBRUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBRkY7U0FGc0Q7TUFBQSxDQUF4RCxFQURGO0tBaEIyQjtFQUFBLENBUDdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/doendmatcher.coffee

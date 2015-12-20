(function() {
  var DO, DOEND, END, FN, Point, Range, decoration, _ref;

  DO = "do";

  END = "end";

  FN = "fn";

  DOEND = /(do|end|fn)/;

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  decoration = null;

  module.exports.handleMatch = function(editor, e) {
    var bufferPos, counter, fromBeginning, lastLineNo, toEnd, word;
    if (decoration != null) {
      decoration.destroy();
    }
    lastLineNo = editor.buffer.lines.length - 1;
    bufferPos = e.cursor.getBufferPosition().toArray();
    console.log(bufferPos);
    fromBeginning = new Range([0, 0], bufferPos);
    toEnd = new Range(bufferPos, [lastLineNo, 0]);
    word = editor.getWordUnderCursor();
    counter = 0;
    if (word === DO) {
      editor.scanInBufferRange(DOEND, toEnd, function(_arg) {
        var m, marker, r;
        r = _arg.range, m = _arg.matchText;
        if (m === DO || m === FN) {
          counter++;
        }
        if (m === END && counter) {
          return counter--;
        } else {
          marker = editor.markBufferRange(r);
          console.log(marker);
          return decoration = editor.decorateMarker(marker, {
            type: 'highlight',
            "class": 'selection'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvZG9lbmRtYXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sS0FETixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLElBRkwsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxhQUhSLENBQUE7O0FBQUEsRUFJQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FKUixDQUFBOztBQUFBLEVBS0EsVUFBQSxHQUFhLElBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBZixHQUE2QixTQUFDLE1BQUQsRUFBUyxDQUFULEdBQUE7QUFDM0IsUUFBQSwwREFBQTs7TUFBQSxVQUFVLENBQUUsT0FBWixDQUFBO0tBQUE7QUFBQSxJQUNBLFVBQUEsR0FBYSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFwQixHQUE2QixDQUQxQyxDQUFBO0FBQUEsSUFFQSxTQUFBLEdBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBVCxDQUFBLENBQTRCLENBQUMsT0FBN0IsQ0FBQSxDQUZaLENBQUE7QUFBQSxJQUdBLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWixDQUhBLENBQUE7QUFBQSxJQUlBLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQU0sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFOLEVBQWEsU0FBYixDQUpwQixDQUFBO0FBQUEsSUFLQSxLQUFBLEdBQW9CLElBQUEsS0FBQSxDQUFNLFNBQU4sRUFBaUIsQ0FBQyxVQUFELEVBQWEsQ0FBYixDQUFqQixDQUxwQixDQUFBO0FBQUEsSUFPQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGtCQUFQLENBQUEsQ0FQUCxDQUFBO0FBQUEsSUFRQSxPQUFBLEdBQVUsQ0FSVixDQUFBO0FBU0EsSUFBQSxJQUFHLElBQUEsS0FBUSxFQUFYO0FBQ0UsTUFBQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsS0FBekIsRUFBZ0MsS0FBaEMsRUFBdUMsU0FBQyxJQUFELEdBQUE7QUFDckMsWUFBQSxZQUFBO0FBQUEsUUFEOEMsU0FBUCxPQUFxQixTQUFYLFNBQ2pELENBQUE7QUFBQSxRQUFBLElBQUcsQ0FBQSxLQUFLLEVBQUwsSUFBVyxDQUFBLEtBQUssRUFBbkI7QUFBMkIsVUFBQSxPQUFBLEVBQUEsQ0FBM0I7U0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFBLEtBQUssR0FBTCxJQUFZLE9BQWY7aUJBQTRCLE9BQUEsR0FBNUI7U0FBQSxNQUFBO0FBRUUsVUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsQ0FBdkIsQ0FBVCxDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FEQSxDQUFBO2lCQUVBLFVBQUEsR0FBYSxNQUFNLENBQUMsY0FBUCxDQUFzQixNQUF0QixFQUE4QjtBQUFBLFlBQUMsSUFBQSxFQUFNLFdBQVA7QUFBQSxZQUFvQixPQUFBLEVBQU8sV0FBM0I7V0FBOUIsRUFKZjtTQUZxQztNQUFBLENBQXZDLENBQUEsQ0FERjtLQVRBO0FBaUJBLElBQUEsSUFBRyxJQUFBLEtBQVEsR0FBWDthQUNFLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxLQUFsQyxFQUF5QyxhQUF6QyxFQUF3RCxTQUFDLENBQUQsR0FBQTtBQUN0RCxRQUFBLElBQUcsQ0FBQSxLQUFLLEdBQVI7QUFBaUIsVUFBQSxPQUFBLEVBQUEsQ0FBakI7U0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFDLENBQUEsS0FBSyxFQUFMLElBQVcsQ0FBQSxLQUFLLEVBQWpCLENBQUEsSUFBd0IsT0FBM0I7aUJBQXdDLE9BQUEsR0FBeEM7U0FBQSxNQUFBO2lCQUVFLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixFQUZGO1NBRnNEO01BQUEsQ0FBeEQsRUFERjtLQWxCMkI7RUFBQSxDQVA3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/doendmatcher.coffee

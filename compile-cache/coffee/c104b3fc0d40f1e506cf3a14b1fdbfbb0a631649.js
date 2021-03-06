(function() {
  var DO, DOEND, END, FN, Point, Range, decoration1, decoration2, highlightRange, _ref;

  DO = "do";

  END = "end";

  FN = "fn";

  DOEND = /(do|end|fn)/g;

  _ref = require("atom"), Range = _ref.Range, Point = _ref.Point;

  decoration1 = null;

  decoration2 = null;

  highlightRange = function(r) {
    var marker;
    marker = editor.markBufferRange(r);
    return decoration1 = editor.decorateMarker(marker, {
      type: 'highlight',
      "class": 'selection'
    });
  };

  module.exports.handleMatch = function(editor, e) {
    var bufferPos, counter, fromBeginning, lastLineNo, toEnd, word;
    if (decoration1 != null) {
      decoration1.destroy();
    }
    if (decoration2 != null) {
      decoration2.destroy();
    }
    lastLineNo = editor.buffer.lines.length - 1;
    bufferPos = e.cursor.getBufferPosition().toArray();
    fromBeginning = new Range([0, 0], bufferPos);
    toEnd = new Range(bufferPos, [lastLineNo, 0]);
    highlightRange(e.cursor.getCurrentWordBufferRange());
    word = editor.getWordUnderCursor();
    counter = 0;
    if (word === DO) {
      editor.scanInBufferRange(DOEND, toEnd, function(_arg) {
        var m, r, stop;
        r = _arg.range, m = _arg.matchText, stop = _arg.stop;
        console.log(m);
        if (m === DO || m === FN) {
          counter++;
        }
        if (m === END && counter) {
          counter--;
        } else if (!counter) {
          highlightRange(r);
          stop();
        }
        return console.log(counter);
      });
    }
    if (word === END) {
      return editor.backwardsScanInBufferRange(DOEND, fromBeginning, function(_arg) {
        var m, r, stop;
        r = _arg.range, m = _arg.matchText, stop = _arg.stop;
        if (m === END) {
          counter++;
        }
        if ((m === DO || m === FN) && counter) {
          return counter--;
        } else if (!counter) {
          highlightRange(r);
          return stop();
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hbGNoZW1pZGUvZG9lbmRtYXRjaGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnRkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sS0FETixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLElBRkwsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxjQUhSLENBQUE7O0FBQUEsRUFJQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FKUixDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLElBTGQsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxJQU5kLENBQUE7O0FBQUEsRUFRQSxjQUFBLEdBQWlCLFNBQUMsQ0FBRCxHQUFBO0FBQ2YsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsQ0FBdkIsQ0FBVCxDQUFBO1dBQ0EsV0FBQSxHQUFjLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCO0FBQUEsTUFBQyxJQUFBLEVBQU0sV0FBUDtBQUFBLE1BQW9CLE9BQUEsRUFBTyxXQUEzQjtLQUE5QixFQUZDO0VBQUEsQ0FSakIsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBZixHQUE2QixTQUFDLE1BQUQsRUFBUyxDQUFULEdBQUE7QUFDM0IsUUFBQSwwREFBQTs7TUFBQSxXQUFXLENBQUUsT0FBYixDQUFBO0tBQUE7O01BQ0EsV0FBVyxDQUFFLE9BQWIsQ0FBQTtLQURBO0FBQUEsSUFHQSxVQUFBLEdBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBcEIsR0FBNkIsQ0FIMUMsQ0FBQTtBQUFBLElBSUEsU0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQVQsQ0FBQSxDQUE0QixDQUFDLE9BQTdCLENBQUEsQ0FKWixDQUFBO0FBQUEsSUFLQSxhQUFBLEdBQW9CLElBQUEsS0FBQSxDQUFNLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBTixFQUFhLFNBQWIsQ0FMcEIsQ0FBQTtBQUFBLElBTUEsS0FBQSxHQUFvQixJQUFBLEtBQUEsQ0FBTSxTQUFOLEVBQWlCLENBQUMsVUFBRCxFQUFhLENBQWIsQ0FBakIsQ0FOcEIsQ0FBQTtBQUFBLElBT0EsY0FBQSxDQUFlLENBQUMsQ0FBQyxNQUFNLENBQUMseUJBQVQsQ0FBQSxDQUFmLENBUEEsQ0FBQTtBQUFBLElBU0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLENBVFAsQ0FBQTtBQUFBLElBVUEsT0FBQSxHQUFVLENBVlYsQ0FBQTtBQVdBLElBQUEsSUFBRyxJQUFBLEtBQVEsRUFBWDtBQUNFLE1BQUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLEVBQXVDLFNBQUMsSUFBRCxHQUFBO0FBQ3JDLFlBQUEsVUFBQTtBQUFBLFFBRDhDLFNBQVAsT0FBcUIsU0FBWCxXQUFjLFlBQUEsSUFDL0QsQ0FBQTtBQUFBLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaLENBQUEsQ0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFBLEtBQUssRUFBTCxJQUFXLENBQUEsS0FBSyxFQUFuQjtBQUEyQixVQUFBLE9BQUEsRUFBQSxDQUEzQjtTQURBO0FBRUEsUUFBQSxJQUFHLENBQUEsS0FBSyxHQUFMLElBQWEsT0FBaEI7QUFBNkIsVUFBQSxPQUFBLEVBQUEsQ0FBN0I7U0FBQSxNQUNLLElBQUcsQ0FBQSxPQUFIO0FBQ0gsVUFBQSxjQUFBLENBQWUsQ0FBZixDQUFBLENBQUE7QUFBQSxVQUNBLElBQUEsQ0FBQSxDQURBLENBREc7U0FITDtlQU1BLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixFQVBxQztNQUFBLENBQXZDLENBQUEsQ0FERjtLQVhBO0FBb0JBLElBQUEsSUFBRyxJQUFBLEtBQVEsR0FBWDthQUNFLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxLQUFsQyxFQUF5QyxhQUF6QyxFQUF3RCxTQUFDLElBQUQsR0FBQTtBQUN0RCxZQUFBLFVBQUE7QUFBQSxRQUQrRCxTQUFQLE9BQXFCLFNBQVgsV0FBYyxZQUFBLElBQ2hGLENBQUE7QUFBQSxRQUFBLElBQUcsQ0FBQSxLQUFLLEdBQVI7QUFBaUIsVUFBQSxPQUFBLEVBQUEsQ0FBakI7U0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFDLENBQUEsS0FBSyxFQUFMLElBQVcsQ0FBQSxLQUFLLEVBQWpCLENBQUEsSUFBd0IsT0FBM0I7aUJBQXdDLE9BQUEsR0FBeEM7U0FBQSxNQUNLLElBQUcsQ0FBQSxPQUFIO0FBQ0gsVUFBQSxjQUFBLENBQWUsQ0FBZixDQUFBLENBQUE7aUJBQ0EsSUFBQSxDQUFBLEVBRkc7U0FIaUQ7TUFBQSxDQUF4RCxFQURGO0tBckIyQjtFQUFBLENBWjdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/alchemide/doendmatcher.coffee

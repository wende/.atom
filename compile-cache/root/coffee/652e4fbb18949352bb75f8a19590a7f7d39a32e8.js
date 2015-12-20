(function() {
  var PathsProvider, Range, fs, fuzzaldrin, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Range = require('atom').Range;

  fuzzaldrin = require('fuzzaldrin');

  path = require('path');

  fs = require('fs');

  module.exports = PathsProvider = (function() {
    function PathsProvider() {
      this.dispose = __bind(this.dispose, this);
      this.prefixForCursor = __bind(this.prefixForCursor, this);
      this.requestHandler = __bind(this.requestHandler, this);
    }

    PathsProvider.prototype.id = 'autocomplete-paths-pathsprovider';

    PathsProvider.prototype.selector = '*';

    PathsProvider.prototype.wordRegex = /[a-zA-Z0-9\.\/_-]*\/[a-zA-Z0-9\.\/_-]*/g;

    PathsProvider.prototype.cache = [];

    PathsProvider.prototype.requestHandler = function(options) {
      var basePath, editorPath, prefix, suggestions, _ref;
      if (options == null) {
        options = {};
      }
      if (!((options.editor != null) && (options.buffer != null) && (options.cursor != null))) {
        return [];
      }
      editorPath = (_ref = options.editor) != null ? _ref.getPath() : void 0;
      if (!(editorPath != null ? editorPath.length : void 0)) {
        return [];
      }
      basePath = path.dirname(editorPath);
      if (basePath == null) {
        return [];
      }
      prefix = this.prefixForCursor(options.editor, options.buffer, options.cursor, options.position);
      if (!prefix.length) {
        return [];
      }
      suggestions = this.findSuggestionsForPrefix(options.editor, basePath, prefix);
      if (!suggestions.length) {
        return [];
      }
      return suggestions;
    };

    PathsProvider.prototype.prefixForCursor = function(editor, buffer, cursor, position) {
      var end, start;
      if (!((buffer != null) && (cursor != null))) {
        return '';
      }
      start = this.getBeginningOfCurrentWordBufferPosition(editor, position, {
        wordRegex: this.wordRegex
      });
      end = cursor.getBufferPosition();
      if (!((start != null) && (end != null))) {
        return '';
      }
      return buffer.getTextInRange(new Range(start, end));
    };

    PathsProvider.prototype.getBeginningOfCurrentWordBufferPosition = function(editor, position, options) {
      var allowPrevious, beginningOfWordPosition, currentBufferPosition, scanRange, _ref;
      if (options == null) {
        options = {};
      }
      if (position == null) {
        return;
      }
      allowPrevious = (_ref = options.allowPrevious) != null ? _ref : true;
      currentBufferPosition = position;
      scanRange = [[currentBufferPosition.row, 0], currentBufferPosition];
      beginningOfWordPosition = null;
      editor.backwardsScanInBufferRange(options.wordRegex, scanRange, function(_arg) {
        var range, stop;
        range = _arg.range, stop = _arg.stop;
        if (range.end.isGreaterThanOrEqual(currentBufferPosition) || allowPrevious) {
          beginningOfWordPosition = range.start;
        }
        if (!(beginningOfWordPosition != null ? beginningOfWordPosition.isEqual(currentBufferPosition) : void 0)) {
          return stop();
        }
      });
      if (beginningOfWordPosition != null) {
        return beginningOfWordPosition;
      } else if (allowPrevious) {
        return [currentBufferPosition.row, 0];
      } else {
        return currentBufferPosition;
      }
    };

    PathsProvider.prototype.findSuggestionsForPrefix = function(editor, basePath, prefix) {
      var directory, e, files, label, prefixPath, result, resultPath, results, stat, suggestion, suggestions;
      if (basePath == null) {
        return [];
      }
      prefixPath = path.resolve(basePath, prefix);
      if (prefix.endsWith('/')) {
        directory = prefixPath;
        prefix = '';
      } else {
        if (basePath === prefixPath) {
          directory = prefixPath;
        } else {
          directory = path.dirname(prefixPath);
        }
        prefix = path.basename(prefix);
      }
      try {
        stat = fs.statSync(directory);
        if (!stat.isDirectory()) {
          return [];
        }
      } catch (_error) {
        e = _error;
        return [];
      }
      try {
        files = fs.readdirSync(directory);
      } catch (_error) {
        e = _error;
        return [];
      }
      results = fuzzaldrin.filter(files, prefix);
      suggestions = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = results.length; _i < _len; _i++) {
          result = results[_i];
          resultPath = path.resolve(directory, result);
          try {
            stat = fs.statSync(resultPath);
          } catch (_error) {
            e = _error;
            continue;
          }
          if (stat.isDirectory()) {
            label = 'Dir';
            result += path.sep;
          } else if (stat.isFile()) {
            label = 'File';
          } else {
            continue;
          }
          suggestion = {
            word: result,
            prefix: prefix,
            label: label,
            data: {
              body: result
            }
          };
          if (suggestion.label !== 'File') {
            suggestion.onDidConfirm = function() {
              return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate');
            };
          }
          _results.push(suggestion);
        }
        return _results;
      })();
      return suggestions;
    };

    PathsProvider.prototype.dispose = function() {
      this.editor = null;
      return this.basePath = null;
    };

    return PathsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFVLE9BQUEsQ0FBUSxNQUFSLEVBQVYsS0FBRCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7S0FDSjs7QUFBQSw0QkFBQSxFQUFBLEdBQUksa0NBQUosQ0FBQTs7QUFBQSw0QkFDQSxRQUFBLEdBQVUsR0FEVixDQUFBOztBQUFBLDRCQUVBLFNBQUEsR0FBVyx5Q0FGWCxDQUFBOztBQUFBLDRCQUdBLEtBQUEsR0FBTyxFQUhQLENBQUE7O0FBQUEsNEJBS0EsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLFVBQUEsK0NBQUE7O1FBRGUsVUFBVTtPQUN6QjtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWlCLHdCQUFBLElBQW9CLHdCQUFwQixJQUF3Qyx3QkFBekQsQ0FBQTtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFBQSxNQUNBLFVBQUEseUNBQTJCLENBQUUsT0FBaEIsQ0FBQSxVQURiLENBQUE7QUFFQSxNQUFBLElBQUEsQ0FBQSxzQkFBaUIsVUFBVSxDQUFFLGdCQUE3QjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BRkE7QUFBQSxNQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsQ0FIWCxDQUFBO0FBSUEsTUFBQSxJQUFpQixnQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUpBO0FBQUEsTUFNQSxNQUFBLEdBQVMsSUFBQyxD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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-paths/lib/paths-provider.coffee
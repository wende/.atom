(function() {
  var fs, mkdir, path, promiseWrap, temp, transform, typeMap, unlink, writeFile,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  temp = require('temp');

  promiseWrap = function(obj, methodName) {
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new Promise(function(resolve, reject) {
        return obj[methodName].apply(obj, __slice.call(args).concat([function(err, result) {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }]));
      });
    };
  };

  mkdir = promiseWrap(temp, 'mkdir');

  writeFile = promiseWrap(fs, 'writeFile');

  unlink = promiseWrap(fs, 'unlink');

  typeMap = {
    info: 'Trace',
    warning: 'Warning',
    error: 'Error'
  };

  transform = function(filePath, textEditor, results) {
    if (!results) {
      return [];
    }
    return results.map(function(_arg) {
      var endCol, endLine, level, message, msg, range, startCol, startLine, _ref, _ref1, _ref2, _ref3, _ref4;
      message = _arg.message, level = _arg.level, range = _arg.range;
      _ref1 = (_ref = typeof range.serialize === "function" ? range.serialize() : void 0) != null ? _ref : range, (_ref2 = _ref1[0], startLine = _ref2[0], startCol = _ref2[1]), (_ref3 = _ref1[1], endLine = _ref3[0], endCol = _ref3[1]);
      msg = {
        type: (_ref4 = typeMap[level]) != null ? _ref4 : level,
        text: message,
        filePath: filePath,
        range: [[startLine, startCol], [endLine, endCol]]
      };
      return msg;
    });
  };

  module.exports = function(ClassicLinter) {
    var editorMap, grammarScopes;
    editorMap = new WeakMap();
    grammarScopes = ClassicLinter.syntax;
    if (!(grammarScopes instanceof Array)) {
      grammarScopes = [grammarScopes];
    }
    return {
      grammarScopes: grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: function(textEditor) {
        var filePath, lintFile, linter, tmpOptions;
        linter = editorMap.get(textEditor);
        if (!linter) {
          linter = new ClassicLinter(textEditor);
          editorMap.set(textEditor, linter);
        }
        lintFile = function(filename) {
          var dfd;
          dfd = Promise.defer();
          linter.lintFile(filename, dfd.resolve);
          return dfd.promise;
        };
        filePath = textEditor.getPath();
        tmpOptions = {
          prefix: 'AtomLinter',
          suffix: textEditor.getGrammar().scopeName
        };
        return mkdir('AtomLinter').then(function(tmpDir) {
          var tmpFile;
          tmpFile = path.join(tmpDir, path.basename(filePath));
          return writeFile(tmpFile, textEditor.getText()).then(function() {
            return lintFile(tmpFile).then(function(results) {
              unlink(tmpFile).then(function() {
                return fs.rmdir(tmpDir);
              });
              return transform(filePath, textEditor, results);
            });
          });
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsU0FBQyxHQUFELEVBQU0sVUFBTixHQUFBO0FBQ1osV0FBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLElBQUE7QUFBQSxNQURNLDhEQUNOLENBQUE7QUFBQSxhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtlQUNqQixHQUFJLENBQUEsVUFBQSxDQUFKLFlBQWdCLGFBQUEsSUFBQSxDQUFBLFFBQVMsQ0FBQSxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7QUFDdkIsVUFBQSxJQUFzQixHQUF0QjtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxHQUFQLENBQVAsQ0FBQTtXQUFBO2lCQUNBLE9BQUEsQ0FBUSxNQUFSLEVBRnVCO1FBQUEsQ0FBQSxDQUFULENBQWhCLEVBRGlCO01BQUEsQ0FBUixDQUFYLENBREs7SUFBQSxDQUFQLENBRFk7RUFBQSxDQUpkLENBQUE7O0FBQUEsRUFhQSxLQUFBLEdBQVEsV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FiUixDQUFBOztBQUFBLEVBY0EsU0FBQSxHQUFZLFdBQUEsQ0FBWSxFQUFaLEVBQWdCLFdBQWhCLENBZFosQ0FBQTs7QUFBQSxFQWVBLE1BQUEsR0FBUyxXQUFBLENBQVksRUFBWixFQUFnQixRQUFoQixDQWZULENBQUE7O0FBQUEsRUFpQkEsT0FBQSxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sT0FB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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/legacy.coffee
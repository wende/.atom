(function() {
  var BufferedProcess, CompositeDisposable, _ref;

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = {
    config: {
      elixircPath: {
        type: 'string',
        title: 'Elixirc path',
        "default": 'elixirc'
      },
      mixPath: {
        type: 'string',
        title: 'Mix path',
        "default": 'mix'
      },
      forceElixirc: {
        type: 'boolean',
        title: 'Always use elixirc',
        description: 'Activating this will force plugin to never use `mix compile` and always use `elixirc`.',
        "default": false
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-elixirc');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-elixirc.elixircPath', (function(_this) {
        return function(elixircPath) {
          return _this.elixircPath = elixircPath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-elixirc.mixPath', (function(_this) {
        return function(mixPath) {
          return _this.mixPath = mixPath;
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-elixirc.forceElixirc', (function(_this) {
        return function(forceElixirc) {
          return _this.forceElixirc = forceElixirc;
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var fs, getDepsPa, getFilePathDir, getOpts, handleResult, helpers, isExsFile, isForcedElixirc, isMixProject, isTestFile, lintElixirc, lintMix, os, parseError, parseWarning, path, projectPath, provider;
      helpers = require('atom-linter');
      os = require('os');
      fs = require('fs');
      path = require('path');
      projectPath = function() {
        return atom.project.getPaths()[0];
      };
      isMixProject = function() {
        return fs.existsSync(projectPath() + '/mix.exs');
      };
      isTestFile = function(textEditor) {
        var relativePath;
        relativePath = path.relative(projectPath(), textEditor.getPath());
        return relativePath.split(path.sep)[0] === 'test';
      };
      isForcedElixirc = (function(_this) {
        return function() {
          return _this.forceElixirc;
        };
      })(this);
      isExsFile = function(textEditor) {
        return textEditor.getPath().endsWith('.exs');
      };
      parseError = function(row, textEditor) {
        var re, reResult, ret;
        if (!row.startsWith('** ')) {
          return;
        }
        re = /.*\((.*)\) ([^:]+):(\d+): (.*)/;
        reResult = re.exec(row);
        if (reResult == null) {
          return;
        }
        return ret = {
          type: "Error",
          text: reResult[4],
          filePath: projectPath() + '/' + reResult[2],
          range: helpers.rangeFromLineNumber(textEditor, reResult[3] - 1)
        };
      };
      parseWarning = function(row, textEditor) {
        var re, reResult, ret;
        re = /([^:]*):(\d+): warning: (.*)/;
        reResult = re.exec(row);
        if (reResult == null) {
          return;
        }
        return ret = {
          type: "Warning",
          text: reResult[3],
          filePath: projectPath() + '/' + reResult[1],
          range: helpers.rangeFromLineNumber(textEditor, reResult[2] - 1)
        };
      };
      handleResult = function(textEditor) {
        return function(compileResult) {
          var error, errorStack, line, resultLines, resultString, warningStack, _i, _len, _ref1, _results;
          resultString = compileResult['stdout'] + "\n" + compileResult['stderr'];
          resultLines = resultString.split("\n");
          errorStack = ((function() {
            var _i, _len, _results;
            if (!(resultLines == null)) {
              _results = [];
              for (_i = 0, _len = resultLines.length; _i < _len; _i++) {
                line = resultLines[_i];
                _results.push(parseError(line, textEditor));
              }
              return _results;
            }
          })());
          warningStack = ((function() {
            var _i, _len, _results;
            if (!(resultLines == null)) {
              _results = [];
              for (_i = 0, _len = resultLines.length; _i < _len; _i++) {
                line = resultLines[_i];
                _results.push(parseWarning(line, textEditor));
              }
              return _results;
            }
          })());
          _ref1 = errorStack.concat(warningStack);
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            error = _ref1[_i];
            if (error != null) {
              _results.push(error);
            }
          }
          return _results;
        };
      };
      getFilePathDir = function(textEditor) {
        var filePath;
        filePath = textEditor.getPath();
        return path.dirname(filePath);
      };
      getOpts = function() {
        var opts;
        return opts = {
          cwd: projectPath(),
          throwOnStdErr: false,
          stream: 'both'
        };
      };
      getDepsPa = function(textEditor) {
        var buildDir, env;
        env = isTestFile(textEditor) ? "test" : "dev";
        buildDir = path.join("_build", env, "lib");
        return fs.readdirSync(path.join(projectPath(), buildDir)).map(function(item) {
          return path.join(projectPath(), buildDir, item, "ebin");
        });
      };
      lintElixirc = (function(_this) {
        return function(textEditor) {
          var elixircArgs, item, _i, _len, _ref1;
          elixircArgs = ["--ignore-module-conflict", "--app", "mix", "--app", "ex_unit", "-o", os.tmpDir()];
          _ref1 = getDepsPa(textEditor);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            elixircArgs.push("-pa", item);
          }
          elixircArgs.push(textEditor.getPath());
          return helpers.exec(_this.elixircPath, elixircArgs, getOpts()).then(handleResult(textEditor));
        };
      })(this);
      lintMix = (function(_this) {
        return function(textEditor) {
          return helpers.exec(_this.mixPath, ['compile'], getOpts()).then(handleResult(textEditor));
        };
      })(this);
      return provider = {
        grammarScopes: ['source.elixir'],
        scope: 'file',
        lintOnFly: false,
        name: 'Elixir',
        lint: (function(_this) {
          return function(textEditor) {
            if (isForcedElixirc() || !isMixProject() || isExsFile(textEditor)) {
              return lintElixirc(textEditor);
            } else {
              return lintMix(textEditor);
            }
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9saW50ZXItZWxpeGlyYy9saWIvaW5pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBQWxCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxjQURQO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtPQURGO0FBQUEsTUFJQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxLQUFBLEVBQU8sVUFEUDtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7T0FMRjtBQUFBLE1BUUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsS0FBQSxFQUFPLG9CQURQO0FBQUEsUUFFQSxXQUFBLEVBQWEsd0ZBRmI7QUFBQSxRQUdBLFNBQUEsRUFBUyxLQUhUO09BVEY7S0FERjtBQUFBLElBZUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsZ0JBQXJDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDRCQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxH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

//# sourceURL=/home/iraasta/.atom/packages/linter-elixirc/lib/init.coffee

(function() {
  var BufferedProcess, CompositeDisposable, Linter, Point, Range, XRegExp, fs, log, path, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  XRegExp = null;

  log = function() {
    return void 0;
  };

  warn = function() {
    return void 0;
  };

  Linter = (function() {
    Linter.syntax = '';

    Linter.prototype.cmd = '';

    Linter.prototype.regex = '';

    Linter.prototype.regexFlags = '';

    Linter.prototype.cwd = null;

    Linter.prototype.defaultLevel = 'error';

    Linter.prototype.linterName = null;

    Linter.prototype.executablePath = null;

    Linter.prototype.isNodeExecutable = false;

    Linter.prototype.errorStream = 'stdout';

    Linter.prototype.baseOptions = ['executionTimeout'];

    Linter.prototype.options = [];

    function Linter(editor) {
      var option, _i, _j, _len, _len1, _ref1, _ref2;
      this.editor = editor;
      this.updateOption = __bind(this.updateOption, this);
      this.cwd = path.dirname(this.editor.getPath());
      this.subscriptions = new CompositeDisposable;
      _ref1 = this.baseOptions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this.observeOption('linter', option);
      }
      _ref2 = this.options;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        option = _ref2[_j];
        this.observeOption("linter-" + this.linterName, option);
      }
      this._statCache = new Map();
    }

    Linter.prototype.observeOption = function(prefix, option) {
      var callback;
      callback = this.updateOption.bind(this, prefix, option);
      return this.subscriptions.add(atom.config.observe("" + prefix + "." + option, callback));
    };

    Linter.prototype.updateOption = function(prefix, option) {
      this[option] = atom.config.get("" + prefix + "." + option);
      return log("Updating `" + prefix + "` " + option + " to " + this[option]);
    };

    Linter.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    Linter.prototype._cachedStatSync = function(path) {
      var stat;
      stat = this._statCache.get(path);
      if (!stat) {
        stat = fs.statSync(path);
        this._statCache.set(path, stat);
      }
      return stat;
    };

    Linter.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, stats;
      cmd = this.cmd;
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        }
        if (/@tempdir/i.test(cmd_item)) {
          return cmd_item.replace(/@tempdir/gi, path.dirname(filePath));
        } else {
          return cmd_item;
        }
      });
      log('command and arguments', cmd_list);
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    Linter.prototype.getReportFilePath = function(filePath) {
      return path.join(path.dirname(filePath), this.reportFilePath);
    };

    Linter.prototype.getNodeExecutablePath = function() {
      return path.join(atom.packages.getApmPath(), '..', 'node');
    };

    Linter.prototype.linterNotFound = function() {
      var notFoundMessage;
      notFoundMessage = "Linting has been halted. Please install the linter binary or disable the linter plugin depending on it. Make sure to reload Atom to detect changes";
      return atom.notifications.addError("The linter binary '" + this.linterName + "' cannot be found.", {
        detail: notFoundMessage,
        dismissable: true
      });
    };

    Linter.prototype.lintFile = function(filePath, callback) {
      var SpawnedProcess, args, command, dataStderr, dataStdout, exit, exited, options, stderr, stdout, _ref1, _ref2;
      _ref1 = this.getCmdAndArgs(filePath), command = _ref1.command, args = _ref1.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout.push(output);
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr.push(output);
      };
      exit = (function(_this) {
        return function(exitCode) {
          var data, reportFilePath;
          exited = true;
          if (exitCode === 8) {
            return _this.linterNotFound();
          }
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout.join('');
              break;
            default:
              data = dataStderr.join('');
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      _ref2 = this.beforeSpawnProcess(command, args, options), command = _ref2.command, args = _ref2.args, options = _ref2.options;
      log("beforeSpawnProcess:", command, args, options);
      SpawnedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      SpawnedProcess.onWillThrowError((function(_this) {
        return function(err) {
          if (err == null) {
            return;
          }
          if (err.error.code === 'ENOENT') {
            return _this.linterNotFound();
          }
        };
      })(this));
      if (this.executionTimeout > 0) {
        return setTimeout((function(_this) {
          return function() {
            if (exited) {
              return;
            }
            SpawnedProcess.kill();
            return warn("command `" + command + "` timed out after " + _this.executionTimeout + " ms");
          };
        })(this), this.executionTimeout);
      }
    };

    Linter.prototype.beforeSpawnProcess = function(command, args, options) {
      return {
        command: command,
        args: args,
        options: options
      };
    };

    Linter.prototype.processMessage = function(message, callback) {
      var messages, regex;
      messages = [];
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
        return function(match, i) {
          var msg;
          msg = _this.createMessage(match);
          if (msg.range != null) {
            return messages.push(msg);
          }
        };
      })(this), this);
      return callback(messages);
    };

    Linter.prototype.createMessage = function(match) {
      var level;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else if (match.info) {
        level = 'info';
      } else {
        level = match.level || this.defaultLevel;
      }
      if (match.line == null) {
        match.line = 0;
      }
      if (match.col == null) {
        match.col = 0;
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    Linter.prototype.formatMessage = function(match) {
      return match.message;
    };

    Linter.prototype.lineLengthForRow = function(row) {
      var text;
      text = this.editor.lineTextForBufferRow(row);
      return (text != null ? text.length : void 0) || 0;
    };

    Linter.prototype.getEditorScopesForPosition = function(position) {
      try {
        return this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position).slice();
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref1, _ref2, _ref3;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref1 = match.lineStart) != null ? _ref1 : match.line);
      rowEnd = decrementParse((_ref2 = (_ref3 = match.lineEnd) != null ? _ref3 : match.line) != null ? _ref2 : rowStart);
      if (rowEnd >= this.editor.getLineCount()) {
        log("ignoring " + match + " - it's longer than the buffer");
        return null;
      }
      if (!match.colStart) {
        position = new Point(rowStart, match.col);
        scopes = this.getEditorScopesForPosition(position);
        while (innerMostScope = scopes.pop()) {
          range = this.getGetRangeForScopeAtPosition(innerMostScope, position);
          if (range != null) {
            return range;
          }
        }
      }
      if (match.colStart == null) {
        match.colStart = match.col;
      }
      colStart = decrementParse(match.colStart);
      colEnd = match.colEnd != null ? decrementParse(match.colEnd) : parseInt(this.lineLengthForRow(rowEnd));
      if (colStart === colEnd) {
        colStart = decrementParse(colStart);
      }
      return new Range([rowStart, colStart], [rowEnd, colEnd]);
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQXVELE9BQUEsQ0FBUSxNQUFSLENBQXZELEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsYUFBQSxLQUF0QixFQUE2QixhQUFBLEtBQTdCLEVBQW9DLHVCQUFBLGVBRnBDLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsSUFIVixDQUFBOztBQUFBLEVBTUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtXQUFHLE9BQUg7RUFBQSxDQU5OLENBQUE7O0FBQUEsRUFPQSxJQUFBLEdBQU8sU0FBQSxHQUFBO1dBQUcsT0FBSDtFQUFBLENBUFAsQ0FBQTs7QUFBQSxFQVdNO0FBSUosSUFBQSxNQUFDLENBQUEsTUFBRCxHQUFTLEVBQVQsQ0FBQTs7QUFBQSxxQkFJQSxHQUFBLEdBQUssRUFKTCxDQUFBOztBQUFBLHFCQWlCQSxLQUFBLEdBQU8sRUFqQlAsQ0FBQTs7QUFBQSxxQkFtQkEsVUFBQSxHQUFZLEVBbkJaLENBQUE7O0FBQUEscUJBc0JBLEdBQUEsR0FBSyxJQXRCTCxDQUFBOztBQUFBLHFCQXdCQSxZQUFBLEdBQWMsT0F4QmQsQ0FBQTs7QUFBQSxxQkEwQkEsVUFBQSxHQUFZLElBMUJaLENBQUE7O0FBQUEscUJBNEJBLGNBQUEsR0FBZ0IsSUE1QmhCLENBQUE7O0FBQUEscUJBOEJBLGdCQUFBLEdBQWtCLEtBOUJsQixDQUFBOztBQUFBLHFCQWlDQSxXQUFBLEdBQWEsUUFqQ2IsQ0FBQTs7QUFBQSxxQkFvQ0EsV0FBQSxHQUFhLENBQUMsa0JBQUQsQ0FwQ2IsQ0FBQTs7QUFBQSxx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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/linter.coffee
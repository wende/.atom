(function() {
  var BufferedProcess, CompositeDisposable, Linter, MessagePanelView, Point, Range, XRegExp, fs, log, path, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  _ = null;

  XRegExp = null;

  MessagePanelView = require('atom-message-panel').MessagePanelView;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

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
      var option, _i, _j, _len, _len1, _ref2, _ref3;
      this.editor = editor;
      this.beforeSpawnProcess = __bind(this.beforeSpawnProcess, this);
      this.updateOption = __bind(this.updateOption, this);
      this.cwd = path.dirname(this.editor.getPath());
      this.subscriptions = new CompositeDisposable;
      _ref2 = this.baseOptions;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        option = _ref2[_i];
        this.subscriptions.add(atom.config.observe('linter.executionTimeout', (function(_this) {
          return function(option) {
            _this[option] = option;
            return log("Updating `linter` " + option + " to " + _this[option]);
          };
        })(this)));
      }
      _ref3 = this.options;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        option = _ref3[_j];
        this.subscriptions.add(atom.config.observe("linter-" + this.linterName + "." + option, this.updateOption.bind(this, option)));
      }
      this._statCache = new Map();
    }

    Linter.prototype.updateOption = function(option) {
      this[option] = atom.config.get("linter-" + this.linterName + "." + option);
      return log("Updating `linter-" + this.linterName + "` " + option + " to " + this[option]);
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

    Linter.prototype.lintFile = function(filePath, callback) {
      var args, command, dataStderr, dataStdout, exit, exited, options, process, stderr, stdout, _ref2, _ref3;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout += output;
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr += output;
      };
      exit = (function(_this) {
        return function() {
          var data, reportFilePath;
          exited = true;
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout;
              break;
            default:
              data = dataStderr;
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      _ref3 = this.beforeSpawnProcess(command, args, options), command = _ref3.command, args = _ref3.args, options = _ref3.options;
      log("beforeSpawnProcess:", command, args, options);
      process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      process.onWillThrowError((function(_this) {
        return function(err) {
          var ignored, message, subtle, warningMessageTitle, _ref4, _ref5;
          if (err == null) {
            return;
          }
          if (err.error.code === 'ENOENT') {
            ignored = atom.config.get('linter.ignoredLinterErrors');
            subtle = atom.config.get('linter.subtleLinterErrors');
            warningMessageTitle = "The linter binary '" + _this.linterName + "' cannot be found.";
            if (_ref4 = _this.linterName, __indexOf.call(subtle, _ref4) >= 0) {
              message = new MessagePanelView({
                title: warningMessageTitle
              });
              message.attach();
              message.toggle();
            } else if (_ref5 = _this.linterName, __indexOf.call(ignored, _ref5) < 0) {
              atom.confirm({
                message: warningMessageTitle,
                detailedMessage: 'Is it on your path? Please follow the installation guide for your linter. Would you like further notifications to be fully or partially suppressed? You can change this later in the linter package settings.',
                buttons: {
                  Fully: function() {
                    ignored.push(_this.linterName);
                    return atom.config.set('linter.ignoredLinterErrors', ignored);
                  },
                  Partially: function() {
                    subtle.push(_this.linterName);
                    return atom.config.set('linter.subtleLinterErrors', subtle);
                  }
                }
              });
            } else {
              console.log(warningMessageTitle);
            }
            return err.handle();
          }
        };
      })(this));
      if (this.executionTimeout > 0) {
        return setTimeout((function(_this) {
          return function() {
            if (exited) {
              return;
            }
            process.kill();
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
        level = match.level || 'error';
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
      if (_ == null) {
        _ = require('lodash');
      }
      try {
        return _.clone(this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position));
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref2, _ref3, _ref4;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref2 = match.lineStart) != null ? _ref2 : match.line);
      rowEnd = decrementParse((_ref3 = (_ref4 = match.lineEnd) != null ? _ref4 : match.line) != null ? _ref3 : rowStart);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBIQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQXVELE9BQUEsQ0FBUSxNQUFSLENBQXZELEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsYUFBQSxLQUF0QixFQUE2QixhQUFBLEtBQTdCLEVBQW9DLHVCQUFBLGVBRnBDLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksSUFISixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLElBSlYsQ0FBQTs7QUFBQSxFQUtDLG1CQUFvQixPQUFBLENBQVEsb0JBQVIsRUFBcEIsZ0JBTEQsQ0FBQTs7QUFBQSxFQU1BLFFBQWMsT0FBQSxDQUFRLFNBQVIsQ0FBZCxFQUFDLFlBQUEsR0FBRCxFQUFNLGFBQUEsSUFOTixDQUFBOztBQUFBLEVBV007QUFJSixJQUFBLE1BQUMsQ0FBQSxNQUFELEdBQVMsRUFBVCxDQUFBOztBQUFBLHFCQUlBLEdBQUEsR0FBSyxFQUpMLENBQUE7O0FBQUEscUJBaUJBLEtBQUEsR0FBTyxFQWpCUCxDQUFBOztBQUFBLHFCQW1CQSxVQUFBLEdBQVksRUFuQlosQ0FBQTs7QUFBQSxxQkFzQkEsR0FBQSxHQUFLLElBdEJMLENBQUE7O0FBQUEscUJBd0JBLFlBQUEsR0FBYyxPQXhCZCxDQUFBOztBQUFBLHFCQTBCQSxVQUFBLEdBQVksSUExQlosQ0FBQTs7QUFBQSxxQkE0QkEsY0FBQSxHQUFnQixJQTVCaEIsQ0FBQTs7QUFBQSxxQkE4QkEsZ0JBQUEsR0FBa0IsS0E5QmxCLENBQUE7O0FBQUEscUJBaUNBLFdBQUEsR0FBYSxRQWpDYixDQUFBOztBQUFBLHFCQW9D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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/linter.coffee
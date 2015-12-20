(function() {
  var BufferedProcess, Linter, LinterErlc, Point, Range, child, exec, linterPath, os, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  os = require('os');

  _ref = require('child_process'), exec = _ref.exec, child = _ref.child;

  _ref1 = require('atom'), Range = _ref1.Range, Point = _ref1.Point, BufferedProcess = _ref1.BufferedProcess;

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterErlc = (function(_super) {
    __extends(LinterErlc, _super);

    LinterErlc.syntax = 'source.erlang';

    LinterErlc.prototype.defaultLevel = 'error';

    LinterErlc.prototype.cmd = ['erlc', "-Wall", "-v", "-I", "./include", "-o", os.tmpDir()];

    LinterErlc.prototype.linterName = 'erlc';

    LinterErlc.prototype.cwd = atom.project.path;

    LinterErlc.prototype.regex = '.*(?<file>.*):(?<line>\\d+):\\s*(?<warning>[Ww]arning:)?\\s*(?<message>.+)[\\n\\r]';

    function LinterErlc(editor) {
      LinterErlc.__super__.constructor.call(this, editor);
      this.configSubscription = atom.config.observe('linter-erlc.erlcExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-erlc.erlcExecutablePath');
        };
      })(this));
    }

    LinterErlc.prototype.destroy = function() {
      LinterErlc.__super__.destroy.apply(this, arguments);
      return this.configSubscription.dispose();
    };

    LinterErlc.prototype.lintFile = function(filePath, callback) {
      var args, build_env, command, dataStdAll, exit, includeDirs, options, pa, path, proc, stderr, stdout, timeout_s, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      this.cwd = atom.project.path;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      pa = atom.config.get('linter-erlc.pa');
      _ref3 = pa.split(",").map(function(x) {
        return x.trim();
      }).filter(function(x) {
        return x;
      });
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        path = _ref3[_i];
        args.push("-pa");
        args.push(path);
      }
      includeDirs = atom.config.get('linter-erlc.includeDirs');
      _ref4 = includeDirs.split(",").map(function(x) {
        return x.trim();
      }).filter(function(x) {
        return x;
      });
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        path = _ref4[_j];
        args.push("-I");
        args.push(path);
      }
      build_env = process.env["MIX_ENV"] || "dev";
      process.env["ERL_LIBS"] = atom.project.path + "/deps";
      options = {
        cwd: this.cwd
      };
      dataStdAll = [];
      stdout = function(output) {
        if (atom.config.get('linter.lintDebug')) {
          console.log("stdout " + output);
        }
        return dataStdAll += output;
      };
      stderr = function(output) {
        if (atom.config.get('linter.lintDebug')) {
          console.log("stderr " + output);
        }
        return dataStdAll += output;
      };
      exit = (function(_this) {
        return function() {
          return _this.processMessage(dataStdAll, callback);
        };
      })(this);
      proc = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      timeout_s = 5;
      return setTimeout(function() {
        return proc.kill();
      }, timeout_s * 1000);
    };

    return LinterErlc;

  })(Linter);

  module.exports = LinterErlc;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsT0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsRUFBQyxZQUFBLElBQUQsRUFBTyxhQUFBLEtBRFAsQ0FBQTs7QUFBQSxFQUVBLFFBQWtDLE9BQUEsQ0FBUSxNQUFSLENBQWxDLEVBQUMsY0FBQSxLQUFELEVBQVEsY0FBQSxLQUFSLEVBQWUsd0JBQUEsZUFGZixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxJQUh0RCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxFQUFBLEdBQUcsVUFBSCxHQUFjLGFBQXRCLENBSlQsQ0FBQTs7QUFBQSxFQU1NO0FBQ0osaUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsZUFBVCxDQUFBOztBQUFBLHlCQUNBLFlBQUEsR0FBYyxPQURkLENBQUE7O0FBQUEseUJBRUEsR0FBQSxHQUFLLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsV0FBL0IsRUFBNEMsSUFBNUMsRUFBa0QsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFsRCxDQUZMLENBQUE7O0FBQUEseUJBR0EsVUFBQSxHQUFZLE1BSFosQ0FBQTs7QUFBQSx5QkFJQSxHQUFBLEdBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUpsQixDQUFBOztBQUFBLHlCQUtBLEtBQUEsR0FBTyxvRkFMUCxDQUFBOztBQU9hLElBQUEsb0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSw0Q0FBTSxNQUFOLENBQUEs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
//# sourceURL=/home/iraasta/.atom/packages/linter-erlc/lib/linter-erlc.coffee
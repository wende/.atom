(function() {
  var BufferedProcess, Linter, LinterElixirc, Point, Range, child, exec, linterPath, os, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  os = require('os');

  _ref = require('child_process'), exec = _ref.exec, child = _ref.child;

  _ref1 = require('atom'), Range = _ref1.Range, Point = _ref1.Point, BufferedProcess = _ref1.BufferedProcess;

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterElixirc = (function(_super) {
    __extends(LinterElixirc, _super);

    LinterElixirc.syntax = 'source.elixir';

    LinterElixirc.prototype.defaultLevel = 'error';

    LinterElixirc.prototype.cmd = ['elixirc', "--ignore-module-conflict", "--app", "mix", "--app", "ex_unit", "-o", os.tmpDir()];

    LinterElixirc.prototype.linterName = 'elixirc';

    LinterElixirc.prototype.cwd = atom.project.path;

    LinterElixirc.prototype.regex = '.*\\(?(?<error>.*)?\\)?.?(?<file>.*):(?<line>\\d+):\\s*(?<warning>warning)?:?\\s*(?<message>.+)[\\n\\r]';

    function LinterElixirc(editor) {
      LinterElixirc.__super__.constructor.call(this, editor);
      this.configSubscription = atom.config.observe('linter-elixirc.elixircExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-elixirc.elixircExecutablePath');
        };
      })(this));
    }

    LinterElixirc.prototype.destroy = function() {
      LinterElixirc.__super__.destroy.apply(this, arguments);
      return this.configSubscription.dispose();
    };

    LinterElixirc.prototype.lintFile = function(filePath, callback) {
      var args, build_env, command, dataStdAll, exit, includeDirs, options, pa, path, proc, stderr, stdout, timeout_s, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      pa = atom.config.get('linter-elixirc.pa');
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
      includeDirs = atom.config.get('linter-elixirc.includeDirs');
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
      process.env["ERL_LIBS"] = atom.project.path + "/_build/" + build_env + "/lib/";
      options = {
        cwd: this.cwd
      };
      dataStdAll = [];
      stdout = stderr = function(output) {
        if (atom.config.get('linter.lintDebug')) {
          console.log(output);
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

    return LinterElixirc;

  })(Linter);

  module.exports = LinterElixirc;

}).call(this);

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
      atom.config.observe('linter-erlc.erlcExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-erlc.erlcExecutablePath');
        };
      })(this));
    }

    LinterErlc.prototype.destroy = function() {
      return atom.config.unobserve('linter-erlc.erlcExecutablePath');
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

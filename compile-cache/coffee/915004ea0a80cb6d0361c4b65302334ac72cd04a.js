(function() {
  var MochaWrapper, STATS_MATCHER, ansi, clickablePaths, escape, events, fs, killTree, path, psTree, spawn, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  path = require('path');

  util = require('util');

  events = require('events');

  escape = require('jsesc');

  ansi = require('ansi-html-stream');

  psTree = require('ps-tree');

  spawn = require('child_process').spawn;

  clickablePaths = require('./clickable-paths');

  STATS_MATCHER = /\d+\s+(?:failing|passing|pending)/g;

  module.exports = MochaWrapper = (function(_super) {
    __extends(MochaWrapper, _super);

    function MochaWrapper(context, debugMode) {
      var optionsForDebug;
      this.context = context;
      if (debugMode == null) {
        debugMode = false;
      }
      this.mocha = null;
      this.node = atom.config.get('mocha-test-runner.nodeBinaryPath');
      this.textOnly = atom.config.get('mocha-test-runner.textOnlyOutput');
      this.options = atom.config.get('mocha-test-runner.options');
      this.env = atom.config.get('mocha-test-runner.env');
      if (debugMode) {
        optionsForDebug = atom.config.get('mocha-test-runner.optionsForDebug');
        this.options = "" + this.options + " " + optionsForDebug;
      }
      this.resetStatistics();
    }

    MochaWrapper.prototype.stop = function() {
      if (this.mocha != null) {
        killTree(this.mocha.pid);
        return this.mocha = null;
      }
    };

    MochaWrapper.prototype.run = function() {
      var env, flags, index, key, name, opts, stream, value, _ref, _ref1;
      flags = [this.context.test];
      env = {
        PATH: path.dirname(this.node)
      };
      if (this.env) {
        _ref = this.env.split(' ');
        for (index in _ref) {
          name = _ref[index];
          _ref1 = name.split('='), key = _ref1[0], value = _ref1[1];
          env[key] = value;
        }
      }
      if (this.textOnly) {
        flags.push('--no-colors');
      } else {
        flags.push('--colors');
      }
      if (this.context.grep) {
        flags.push('--grep');
        flags.push(escape(this.context.grep, {
          escapeEverything: true
        }));
      }
      if (this.options) {
        Array.prototype.push.apply(flags, this.options.split(' '));
      }
      opts = {
        cwd: this.context.root,
        env: env
      };
      this.resetStatistics();
      this.mocha = spawn(this.context.mocha, flags, opts);
      if (this.textOnly) {
        this.mocha.stdout.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', data.toString());
          };
        })(this));
        this.mocha.stderr.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', data.toString());
          };
        })(this));
      } else {
        stream = ansi({
          chunked: false
        });
        this.mocha.stdout.pipe(stream);
        this.mocha.stderr.pipe(stream);
        stream.on('data', (function(_this) {
          return function(data) {
            _this.parseStatistics(data);
            return _this.emit('output', clickablePaths.link(data.toString()));
          };
        })(this));
      }
      this.mocha.on('error', (function(_this) {
        return function(err) {
          return _this.emit('error', err);
        };
      })(this));
      return this.mocha.on('exit', (function(_this) {
        return function(code) {
          if (code === 0) {
            return _this.emit('success', _this.stats);
          } else {
            return _this.emit('failure', _this.stats);
          }
        };
      })(this));
    };

    MochaWrapper.prototype.resetStatistics = function() {
      return this.stats = [];
    };

    MochaWrapper.prototype.parseStatistics = function(data) {
      var matches, stat, _results;
      _results = [];
      while (matches = STATS_MATCHER.exec(data)) {
        stat = matches[0];
        this.stats.push(stat);
        _results.push(this.emit('updateSummary', this.stats));
      }
      return _results;
    };

    return MochaWrapper;

  })(events.EventEmitter);

  killTree = function(pid, signal, callback) {
    signal = signal || 'SIGKILL';
    callback = callback || (function() {});
    return psTree(pid, function(err, children) {
      var childrenPid;
      childrenPid = children.map(function(p) {
        return p.PID;
      });
      [pid].concat(childrenPid).forEach(function(tpid) {
        var ex;
        try {
          return process.kill(tpid, signal);
        } catch (_error) {
          ex = _error;
          return console.log("Failed to " + signal + " " + tpid);
        }
      });
      return callback();
    });
  };

}).call(this);

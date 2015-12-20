(function() {
  var MochaWrapper, STATS_MATCHER, ansi, clickablePaths, escape, events, fs, kill, killTree, path, psTree, spawn, util,
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

  kill = require('tree-kill');

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
          return kill(tpid, signal);
        } catch (_error) {
          ex = _error;
          return console.log("Failed to " + signal + " " + tpid);
        }
      });
      return callback();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9tb2NoYS10ZXN0LXJ1bm5lci9saWIvbW9jaGEuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQVMsT0FBQSxDQUFRLElBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSLENBRFQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBUyxPQUFBLENBQVEsTUFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxPQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBUyxPQUFBLENBQVEsa0JBQVIsQ0FMVCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxTQUFSLENBTlQsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLEtBUGxDLENBQUE7O0FBQUEsRUFRQSxJQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FSVCxDQUFBOztBQUFBLEVBVUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FWakIsQ0FBQTs7QUFBQSxFQVlBLGFBQUEsR0FBZ0Isb0NBWmhCLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUVyQixtQ0FBQSxDQUFBOztBQUFhLElBQUEsc0JBQUUsT0FBRixFQUFXLFNBQVgsR0FBQTtBQUNYLFVBQUEsZUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBOztRQURzQixZQUFZO09BQ2xDO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElB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

//# sourceURL=/home/iraasta/.atom/packages/mocha-test-runner/lib/mocha.coffee

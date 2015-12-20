(function() {
  var CommandRunner, config, glob, path, spawn;

  path = require('path');

  spawn = require('child_process').spawn;

  glob = require('glob');

  config = require('./config');

  module.exports = CommandRunner = (function() {
    function CommandRunner(testStatus, testStatusView) {
      this.testStatus = testStatus;
      this.testStatusView = testStatusView;
    }

    CommandRunner.prototype.run = function() {
      var cfg, cmd, file, matches, pattern, projPath, _i, _len, _ref;
      projPath = atom.project.getPath();
      if (!projPath) {
        return;
      }
      cfg = config.readOrInitConfig();
      cmd = null;
      _ref = Object.keys(cfg);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        pattern = path.join(projPath, file);
        matches = glob.sync(pattern);
        if (matches.length > 0) {
          cmd = cfg[file];
          break;
        }
      }
      if (!cmd) {
        return;
      }
      return this.execute(cmd);
    };

    CommandRunner.prototype.execute = function(cmd) {
      var cwd, err, output, proc;
      if (this.running) {
        return;
      }
      this.running = true;
      this.testStatus.removeClass('success fail').addClass('pending');
      try {
        cwd = atom.project.getPath();
        proc = spawn("" + process.env.SHELL, ["-i", "-c", cmd], {
          cwd: cwd
        });
        output = '';
        proc.stdout.on('data', function(data) {
          return output += data.toString();
        });
        proc.stderr.on('data', function(data) {
          return output += data.toString();
        });
        return proc.on('close', (function(_this) {
          return function(code) {
            _this.running = false;
            _this.testStatusView.update(output);
            if (code === 0) {
              atom.emit('test-status:success');
              return _this.testStatus.removeClass('pending fail').addClass('success');
            } else {
              atom.emit('test-status:fail');
              return _this.testStatus.removeClass('pending success').addClass('fail');
            }
          };
        })(this));
      } catch (_error) {
        err = _error;
        this.running = false;
        this.testStatus.removeClass('pending success').addClass('fail');
        return this.testStatusView.update('An error occured while attempting to run the test command');
      }
    };

    return CommandRunner;

  })();

}).call(this);

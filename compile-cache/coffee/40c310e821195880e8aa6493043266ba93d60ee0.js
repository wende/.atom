(function() {
  var BufferedProcess, GitBridge, GitCmd, GitNotFoundError, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  path = require('path');

  GitNotFoundError = (function(_super) {
    __extends(GitNotFoundError, _super);

    function GitNotFoundError(message) {
      this.name = 'GitNotFoundError';
      GitNotFoundError.__super__.constructor.call(this, message);
    }

    return GitNotFoundError;

  })(Error);

  GitCmd = null;

  GitBridge = (function() {
    GitBridge.process = function(args) {
      return new BufferedProcess(args);
    };

    function GitBridge() {}

    GitBridge.locateGitAnd = function(callback) {
      var errorHandler, exitHandler, possiblePath, search;
      possiblePath = atom.config.get('merge-conflicts.gitPath');
      if (possiblePath) {
        GitCmd = possiblePath;
        callback(null);
        return;
      }
      search = ['git', '/usr/local/bin/git', '"%PROGRAMFILES%\\Git\\bin\\git"', '"%LOCALAPPDATA%\\Programs\\Git\\bin\\git"'];
      possiblePath = search.shift();
      exitHandler = (function(_this) {
        return function(code) {
          if (code === 0) {
            GitCmd = possiblePath;
            callback(null);
            return;
          }
          return errorHandler();
        };
      })(this);
      errorHandler = (function(_this) {
        return function(e) {
          if (e != null) {
            e.handle();
            e.error.code = "NOTENOENT";
          }
          possiblePath = search.shift();
          if (possiblePath == null) {
            callback(new GitNotFoundError("Please set the 'Git Path' correctly in the Atom settings ", "for the Merge Conflicts package."));
            return;
          }
          return _this.process({
            command: possiblePath,
            args: ['--version'],
            exit: exitHandler
          }).onWillThrowError(errorHandler);
        };
      })(this);
      return this.process({
        command: possiblePath,
        args: ['--version'],
        exit: exitHandler
      }).onWillThrowError(errorHandler);
    };

    GitBridge._getActivePath = function() {
      var _ref;
      return (_ref = atom.workspace.getActivePaneItem()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
    };

    GitBridge.getActiveRepo = function(filepath) {
      var repo, rootDir, rootDirIndex;
      rootDir = atom.project.relativizePath(filepath || this._getActivePath())[0];
      if (rootDir != null) {
        rootDirIndex = atom.project.getPaths().indexOf(rootDir);
        repo = atom.project.getRepositories()[rootDirIndex];
      } else {
        repo = atom.project.getRepositories()[0];
      }
      return repo;
    };

    GitBridge._repoWorkDir = function(filepath) {
      return this.getActiveRepo(filepath).getWorkingDirectory();
    };

    GitBridge._repoGitDir = function(filepath) {
      return this.getActiveRepo(filepath).getPath();
    };

    GitBridge._statusCodesFrom = function(chunk, handler) {
      var indexCode, line, m, p, workCode, __, _i, _len, _ref, _results;
      _ref = chunk.split("\n");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        m = line.match(/^(.)(.) (.+)$/);
        if (m) {
          __ = m[0], indexCode = m[1], workCode = m[2], p = m[3];
          _results.push(handler(indexCode, workCode, p));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GitBridge._checkHealth = function(callback) {
      if (!GitCmd) {
        console.trace("GitBridge method called before locateGitAnd");
        callback(new Error("GitBridge.locateGitAnd has not been called yet"));
        return false;
      }
      return true;
    };

    GitBridge.withConflicts = function(repo, handler) {
      var conflicts, errMessage, exitHandler, proc, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      conflicts = [];
      errMessage = [];
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (index === 'U' && work === 'U') {
              conflicts.push({
                path: p,
                message: 'both modified'
              });
            }
            if (index === 'A' && work === 'A') {
              return conflicts.push({
                path: p,
                message: 'both added'
              });
            }
          });
        };
      })(this);
      stderrHandler = function(line) {
        return errMessage.push(line);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, conflicts);
        } else {
          return handler(new Error(("abnormal git exit: " + code + "\n") + errMessage.join("\n")), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain'],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError(errMessage.join("\n")), null);
      });
    };

    GitBridge.isStaged = function(repo, filepath, handler) {
      var exitHandler, proc, staged, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      staged = true;
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (p === filepath) {
              return staged = index === 'M' && work === ' ';
            }
          });
        };
      })(this);
      stderrHandler = function(chunk) {
        return console.log("git status error: " + chunk);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, staged);
        } else {
          return handler(new Error("git status exit: " + code), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain', filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError, null);
      });
    };

    GitBridge.checkoutSide = function(repo, sideName, filepath, callback) {
      var proc;
      if (!this._checkHealth(callback)) {
        return;
      }
      proc = this.process({
        command: GitCmd,
        args: ['checkout', "--" + sideName, filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: function(line) {
          return console.log(line);
        },
        stderr: function(line) {
          return console.log(line);
        },
        exit: function(code) {
          if (code === 0) {
            return callback(null);
          } else {
            return callback(new Error("git checkout exit: " + code));
          }
        }
      });
      return proc.process.on('error', function(err) {
        return callback(new GitNotFoundError);
      });
    };

    GitBridge.add = function(repo, filepath, callback) {
      if (!this._checkHealth(callback)) {
        return;
      }
      return this.process({
        command: GitCmd,
        args: ['add', filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: function(line) {
          return console.log(line);
        },
        stderr: function(line) {
          return console.log(line);
        },
        exit: function(code) {
          if (code === 0) {
            return callback();
          } else {
            return callback(new Error("git add failed: exit code " + code));
          }
        }
      });
    };

    GitBridge.isRebasing = function() {
      var irebaseDir, irebaseStat, rebaseDir, rebaseStat, root;
      if (!this._checkHealth(function(e) {
        return atom.notifications.addError(e.message);
      })) {
        return;
      }
      root = this._repoGitDir();
      if (root == null) {
        return false;
      }
      rebaseDir = path.join(root, 'rebase-apply');
      rebaseStat = fs.statSyncNoException(rebaseDir);
      if (rebaseStat && rebaseStat.isDirectory()) {
        return true;
      }
      irebaseDir = path.join(root, 'rebase-merge');
      irebaseStat = fs.statSyncNoException(irebaseDir);
      return irebaseStat && irebaseStat.isDirectory();
    };

    return GitBridge;

  })();

  module.exports = {
    GitBridge: GitBridge,
    GitNotFoundError: GitNotFoundError
  };

}).call(this);

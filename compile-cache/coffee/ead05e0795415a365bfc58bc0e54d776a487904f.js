(function() {
  var atomRefresh, callGit, cwd, fs, getBranches, git, logcb, noop, parseDefault, parseDiff, parseStatus, path, project, q, repo;

  fs = require('fs');

  path = require('path');

  git = require('git-promise');

  q = require('q');

  logcb = function(log, error) {
    return console[error ? 'error' : 'log'](log);
  };

  repo = void 0;

  cwd = void 0;

  project = atom.project;

  if (project) {
    repo = project.getRepositories()[0];
    cwd = repo ? repo.getWorkingDirectory() : void 0;
  }

  noop = function() {
    return q.fcall(function() {
      return true;
    });
  };

  atomRefresh = function() {
    repo.refreshStatus();
  };

  getBranches = function() {
    return q.fcall(function() {
      var branches, h, refs, _i, _j, _len, _len1, _ref, _ref1;
      branches = {
        local: [],
        remote: [],
        tags: []
      };
      refs = repo.getReferences();
      _ref = refs.heads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        branches.local.push(h.replace('refs/heads/', ''));
      }
      _ref1 = refs.remotes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        h = _ref1[_j];
        branches.remote.push(h.replace('refs/remotes/', ''));
      }
      return branches;
    });
  };

  parseDiff = function(data) {
    return q.fcall(function() {
      var diff, diffs, line, _i, _len, _ref;
      diffs = [];
      diff = {};
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.length) {
          switch (false) {
            case !/^diff --git /.test(line):
              diff = {
                lines: [],
                added: 0,
                removed: 0
              };
              diff['diff'] = line.replace(/^diff --git /, '');
              diffs.push(diff);
              break;
            case !/^index /.test(line):
              diff['index'] = line.replace(/^index /, '');
              break;
            case !/^--- /.test(line):
              diff['---'] = line.replace(/^--- [a|b]\//, '');
              break;
            case !/^\+\+\+ /.test(line):
              diff['+++'] = line.replace(/^\+\+\+ [a|b]\//, '');
              break;
            default:
              diff['lines'].push(line);
              if (/^\+/.test(line)) {
                diff['added']++;
              }
              if (/^-/.test(line)) {
                diff['removed']++;
              }
          }
        }
      }
      return diffs;
    });
  };

  parseStatus = function(data) {
    return q.fcall(function() {
      var files, line, name, type, _i, _len, _ref, _ref1;
      files = [];
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (!line.length) {
          continue;
        }
        _ref1 = line.replace(/\ \ /g, ' ').trim().split(' '), type = _ref1[0], name = _ref1[1];
        files.push({
          name: name,
          selected: (function() {
            switch (type[type.length - 1]) {
              case 'C':
              case 'M':
              case 'R':
              case 'D':
              case 'A':
                return true;
              default:
                return false;
            }
          })(),
          type: (function() {
            switch (type[type.length - 1]) {
              case 'A':
                return 'added';
              case 'C':
                return 'modified';
              case 'D':
                return 'deleted';
              case 'M':
                return 'modified';
              case 'R':
                return 'modified';
              case 'U':
                return 'conflict';
              case '?':
                return 'new';
              default:
                return 'unknown';
            }
          })()
        });
      }
      return files;
    });
  };

  parseDefault = function(data) {
    return q.fcall(function() {
      return true;
    });
  };

  callGit = function(cmd, parser, nodatalog) {
    logcb("> git " + cmd);
    return git(cmd, {
      cwd: cwd
    }).then(function(data) {
      if (!nodatalog) {
        logcb(data);
      }
      return parser(data);
    }).fail(function(e) {
      logcb(e.stdout, true);
      logcb(e.message, true);
    });
  };

  module.exports = {
    isInitialised: function() {
      return cwd;
    },
    alert: function(text) {
      logcb(text);
    },
    setLogger: function(cb) {
      logcb = cb;
    },
    count: function(branch) {
      return repo.getAheadBehindCount(branch);
    },
    getLocalBranch: function() {
      return repo.getShortHead();
    },
    getRemoteBranch: function() {
      return repo.getUpstreamBranch();
    },
    isMerging: function() {
      return fs.existsSync(path.join(repo.path, 'MERGE_HEAD'));
    },
    getBranches: getBranches,
    hasRemotes: function() {
      var refs;
      refs = repo.getReferences();
      return refs && refs.remotes && refs.remotes.length;
    },
    hasOrigin: function() {
      return repo.getOriginURL() !== null;
    },
    add: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("add -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    commit: function(message) {
      message = message || Date.now();
      message = message.replace(/"/g, '\\"');
      return callGit("commit -m \"" + message + "\"", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    checkout: function(branch, remote) {
      return callGit("checkout " + (remote ? '--track ' : '') + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    createBranch: function(branch) {
      return callGit("branch " + branch, function(data) {
        return callGit("checkout " + branch, function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      });
    },
    deleteBranch: function(branch) {
      return callGit("branch -d " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    forceDeleteBranch: function(branch) {
      return callGit("branch -D " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    diff: function(file) {
      return callGit("--no-pager diff " + (file || ''), parseDiff, true);
    },
    fetch: function() {
      return callGit("fetch --prune", parseDefault);
    },
    merge: function(branch, noff) {
      var noffOutput;
      noffOutput = noff ? "--no-ff" : "";
      return callGit("merge " + noffOutput + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    pull: function() {
      return callGit("pull", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    flow: function(type, action, branch) {
      return callGit("flow " + type + " " + action + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    push: function(remote, branch) {
      var cmd;
      cmd = "-c push.default=simple push " + remote + " " + branch + " --porcelain";
      return callGit(cmd, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    log: function(branch) {
      return callGit("log origin/" + (repo.getUpstreamBranch() || 'master') + ".." + branch, parseDefault);
    },
    reset: function(files) {
      return callGit("checkout -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    remove: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("rm -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(true);
      });
    },
    status: function() {
      return callGit('status --porcelain --untracked-files=all', parseStatus);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9naXQtY29udHJvbC9saWIvZ2l0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwSEFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxhQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQUpKLENBQUE7O0FBQUEsRUFNQSxLQUFBLEdBQVEsU0FBQyxHQUFELEVBQU0sS0FBTixHQUFBO1dBQ04sT0FBUSxDQUFHLEtBQUgsR0FBYyxPQUFkLEdBQTJCLEtBQTNCLENBQVIsQ0FBMEMsR0FBMUMsRUFETTtFQUFBLENBTlIsQ0FBQTs7QUFBQSxFQVNBLElBQUEsR0FBTyxNQVRQLENBQUE7O0FBQUEsRUFVQSxHQUFBLEdBQU0sTUFWTixDQUFBOztBQUFBLEVBV0EsT0FBQSxHQUFVLElBQUksQ0FBQyxPQVhmLENBQUE7O0FBYUEsRUFBQSxJQUFHLE9BQUg7QUFDRSxJQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsZUFBUixDQUFBLENBQTBCLENBQUEsQ0FBQSxDQUFqQyxDQUFBO0FBQUEsSUFDQSxHQUFBLEdBQVMsSUFBSCxHQUFhLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQWIsR0FBQSxNQUROLENBREY7R0FiQTs7QUFBQSxFQW1CQSxJQUFBLEdBQU8sU0FBQSxHQUFBO1dBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FBUixFQUFIO0VBQUEsQ0FuQlAsQ0FBQTs7QUFBQSxFQXFCQSxXQUFBLEdBQWMsU0FBQSxHQUFB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

//# sourceURL=/home/iraasta/.atom/packages/git-control/lib/git.coffee

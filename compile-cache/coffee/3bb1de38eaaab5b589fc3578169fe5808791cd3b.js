(function() {
  var $, $$, BranchDialog, BranchView, CommitDialog, ConfirmDialog, DeleteDialog, DiffView, FileView, FlowDialog, GitControlView, LogView, MenuView, MergeDialog, PushDialog, View, git, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$, $$ = _ref.$$;

  git = require('./git');

  BranchView = require('./views/branch-view');

  DiffView = require('./views/diff-view');

  FileView = require('./views/file-view');

  LogView = require('./views/log-view');

  MenuView = require('./views/menu-view');

  BranchDialog = require('./dialogs/branch-dialog');

  CommitDialog = require('./dialogs/commit-dialog');

  ConfirmDialog = require('./dialogs/confirm-dialog');

  DeleteDialog = require('./dialogs/delete-dialog');

  MergeDialog = require('./dialogs/merge-dialog');

  FlowDialog = require('./dialogs/flow-dialog');

  PushDialog = require('./dialogs/push-dialog');

  module.exports = GitControlView = (function(_super) {
    __extends(GitControlView, _super);

    function GitControlView() {
      this.flow = __bind(this.flow, this);
      this.merge = __bind(this.merge, this);
      return GitControlView.__super__.constructor.apply(this, arguments);
    }

    GitControlView.content = function() {
      if (git.isInitialised()) {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            _this.subview('menuView', new MenuView());
            _this.div({
              "class": 'content',
              outlet: 'contentView'
            }, function() {
              _this.div({
                "class": 'sidebar'
              }, function() {
                _this.subview('filesView', new FileView());
                _this.subview('localBranchView', new BranchView({
                  name: 'Local',
                  local: true
                }));
                return _this.subview('remoteBranchView', new BranchView({
                  name: 'Remote'
                }));
              });
              _this.div({
                "class": 'domain'
              }, function() {
                return _this.subview('diffView', new DiffView());
              });
              _this.subview('branchDialog', new BranchDialog());
              _this.subview('commitDialog', new CommitDialog());
              _this.subview('mergeDialog', new MergeDialog());
              _this.subview('flowDialog', new FlowDialog());
              return _this.subview('pushDialog', new PushDialog());
            });
            return _this.subview('logView', new LogView());
          };
        })(this));
      } else {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            return _this.subview('logView', new LogView());
          };
        })(this));
      }
    };

    GitControlView.prototype.serialize = function() {};

    GitControlView.prototype.initialize = function() {
      console.log('GitControlView: initialize');
      git.setLogger((function(_this) {
        return function(log, iserror) {
          return _this.logView.log(log, iserror);
        };
      })(this));
      this.active = true;
      this.branchSelected = null;
      if (!git.isInitialised()) {
        git.alert("> This project is not a git repository. Either open another project or create a repository.");
      }
    };

    GitControlView.prototype.destroy = function() {
      console.log('GitControlView: destroy');
      this.active = false;
    };

    GitControlView.prototype.getTitle = function() {
      return 'git:control';
    };

    GitControlView.prototype.update = function(nofetch) {
      if (git.isInitialised()) {
        this.loadBranches();
        this.showStatus();
        if (!nofetch) {
          this.fetchMenuClick();
          this.diffView.clearAll();
        }
      }
    };

    GitControlView.prototype.loadLog = function() {
      git.log(this.selectedBranch).then(function(logs) {
        console.log('git.log', logs);
      });
    };

    GitControlView.prototype.checkoutBranch = function(branch, remote) {
      git.checkout(branch, remote).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.branchCount = function(count) {
      var remotes;
      if (git.isInitialised()) {
        remotes = git.hasOrigin();
        this.menuView.activate('upstream', remotes && count.behind);
        this.menuView.activate('downstream', remotes && (count.ahead || !git.getRemoteBranch()));
        this.menuView.activate('remote', remotes);
      }
    };

    GitControlView.prototype.loadBranches = function() {
      if (git.isInitialised()) {
        this.selectedBranch = git.getLocalBranch();
        git.getBranches().then((function(_this) {
          return function(branches) {
            _this.branches = branches;
            _this.remoteBranchView.addAll(branches.remote);
            _this.localBranchView.addAll(branches.local, true);
          };
        })(this));
      }
    };

    GitControlView.prototype.showSelectedFiles = function() {
      this.menuView.activate('file', this.filesView.hasSelected());
      this.menuView.activate('file.merging', this.filesView.hasSelected() || git.isMerging());
    };

    GitControlView.prototype.showStatus = function() {
      git.status().then((function(_this) {
        return function(files) {
          _this.filesView.addAll(files);
        };
      })(this));
    };

    GitControlView.prototype.branchMenuClick = function() {
      this.branchDialog.activate();
    };

    GitControlView.prototype.compareMenuClick = function() {
      git.diff(this.filesView.getSelected().all.join(' ')).then((function(_this) {
        return function(diffs) {
          return _this.diffView.addAll(diffs);
        };
      })(this));
    };

    GitControlView.prototype.commitMenuClick = function() {
      if (!(this.filesView.hasSelected() || git.isMerging())) {
        return;
      }
      this.commitDialog.activate();
    };

    GitControlView.prototype.commit = function() {
      var files, msg;
      if (!this.filesView.hasSelected()) {
        return;
      }
      msg = this.commitDialog.getMessage();
      files = this.filesView.getSelected();
      this.filesView.unselectAll();
      git.add(files.add).then(function() {
        return git.remove(files.rem);
      }).then(function() {
        return git.commit(msg);
      }).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.createBranch = function(branch) {
      git.createBranch(branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.deleteBranch = function(branch) {
      var confirmCb, forceDeleteCallback;
      confirmCb = (function(_this) {
        return function(params) {
          git.deleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      forceDeleteCallback = (function(_this) {
        return function(params) {
          return git.forceDeleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      this.contentView.append(new DeleteDialog({
        hdr: 'Delete Branch',
        msg: "Are you sure you want to delete the local branch '" + branch + "'?",
        cb: confirmCb,
        fdCb: forceDeleteCallback,
        branch: branch
      }));
    };

    GitControlView.prototype.fetchMenuClick = function() {
      if (git.isInitialised()) {
        if (!git.hasOrigin()) {
          return;
        }
      }
      git.fetch().then((function(_this) {
        return function() {
          return _this.loadBranches();
        };
      })(this));
    };

    GitControlView.prototype.mergeMenuClick = function() {
      this.mergeDialog.activate(this.branches.local);
    };

    GitControlView.prototype.merge = function(branch, noff) {
      git.merge(branch, noff).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.flowMenuClick = function() {
      this.flowDialog.activate(this.branches.local);
    };

    GitControlView.prototype.flow = function(type, action, branch) {
      git.flow(type, action, branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.pullMenuClick = function() {
      git.pull().then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.pushMenuClick = function() {
      git.getBranches().then((function(_this) {
        return function(branches) {
          return _this.pushDialog.activate(branches.remote);
        };
      })(this));
    };

    GitControlView.prototype.push = function(remote, branches) {
      return git.push(remote, branches).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.resetMenuClick = function() {
      var files;
      if (!this.filesView.hasSelected()) {
        return;
      }
      files = this.filesView.getSelected();
      return atom.confirm({
        message: "Reset will erase changes since the last commit in the selected files. Are you sure?",
        buttons: {
          Cancel: (function(_this) {
            return function() {};
          })(this),
          Reset: (function(_this) {
            return function() {
              git.reset(files.all).then(function() {
                return _this.update();
              });
            };
          })(this)
        }
      });
    };

    return GitControlView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9naXQtY29udHJvbC9saWIvZ2l0LWNvbnRyb2wtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUxBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsc0JBQVIsQ0FBaEIsRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsRUFBVSxVQUFBLEVBQVYsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUixDQUZOLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVIsQ0FMWCxDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVIsQ0FSWCxDQUFBOztBQUFBLEVBVUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUixDQVZmLENBQUE7O0FBQUEsRUFXQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHlCQUFSLENBWGYsQ0FBQTs7QUFBQSxFQVlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSLENBWmhCLENBQUE7O0FBQUEsRUFhQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHlCQUFSLENBYmYsQ0FBQTs7QUFBQSxFQWNBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FkZCxDQUFBOztBQUFBLEVBZUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSx1QkFBUixDQWZiLENBQUE7O0FBQUEsRUFnQkEsVUFBQSxHQUFhLE9BQUEsQ0FBUSx1QkFB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

//# sourceURL=/home/iraasta/.atom/packages/git-control/lib/git-control-view.coffee

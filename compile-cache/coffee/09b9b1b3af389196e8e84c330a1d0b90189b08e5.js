(function() {
  var $, $$, BranchDialog, BranchView, CommitDialog, ConfirmDialog, DiffView, FileView, GitControlView, LogView, MenuView, MergeDialog, View, git, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, $ = _ref.$, $$ = _ref.$$;

  git = require('./git');

  BranchView = require('./views/branch-view');

  DiffView = require('./views/diff-view');

  FileView = require('./views/file-view');

  LogView = require('./views/log-view');

  MenuView = require('./views/menu-view');

  BranchDialog = require('./dialogs/branch-dialog');

  CommitDialog = require('./dialogs/commit-dialog');

  ConfirmDialog = require('./dialogs/confirm-dialog');

  MergeDialog = require('./dialogs/merge-dialog');

  module.exports = GitControlView = (function(_super) {
    __extends(GitControlView, _super);

    function GitControlView() {
      this.merge = __bind(this.merge, this);
      return GitControlView.__super__.constructor.apply(this, arguments);
    }

    GitControlView.content = function() {
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
            return _this.subview('mergeDialog', new MergeDialog());
          });
          return _this.subview('logView', new LogView());
        };
      })(this));
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
    };

    GitControlView.prototype.destroy = function() {
      console.log('GitControlView: destroy');
      this.active = false;
    };

    GitControlView.prototype.getTitle = function() {
      return 'git:control';
    };

    GitControlView.prototype.update = function(nofetch) {
      this.loadBranches();
      this.showStatus();
      if (!nofetch) {
        this.fetchMenuClick();
        this.diffView.clearAll();
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
      remotes = git.hasOrigin();
      this.menuView.activate('upstream', remotes && count.behind);
      this.menuView.activate('downstream', remotes && (count.ahead || !git.getRemoteBranch()));
      this.menuView.activate('remote', remotes);
    };

    GitControlView.prototype.loadBranches = function() {
      this.selectedBranch = git.getLocalBranch();
      git.getBranches().then((function(_this) {
        return function(branches) {
          _this.branches = branches;
          _this.remoteBranchView.addAll(branches.remote);
          _this.localBranchView.addAll(branches.local, true);
        };
      })(this));
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
      git.diff().then((function(_this) {
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
      var confirmCb;
      confirmCb = (function(_this) {
        return function(params) {
          git.deleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      this.contentView.append(new ConfirmDialog({
        hdr: 'Delete Branch',
        msg: "Are you sure you want to delete the local branch '" + branch + "'?",
        cb: confirmCb,
        branch: branch
      }));
    };

    GitControlView.prototype.fetchMenuClick = function() {
      if (!git.hasOrigin()) {
        return;
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

    GitControlView.prototype.merge = function(branch) {
      git.merge(branch).then((function(_this) {
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
      git.push().then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.resetMenuClick = function() {
      var files;
      if (!this.filesView.hasSelected()) {
        return;
      }
      files = this.filesView.getSelected();
      git.reset(files.all).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    return GitControlView;

  })(View);

}).call(this);

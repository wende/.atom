(function() {
  var BranchItem, BranchView, View, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  git = require('../git');

  BranchItem = (function(_super) {
    __extends(BranchItem, _super);

    function BranchItem() {
      return BranchItem.__super__.constructor.apply(this, arguments);
    }

    BranchItem.content = function(branch) {
      var bklass, cklass, dclass;
      bklass = branch.current ? 'active' : '';
      cklass = branch.count.total ? '' : 'invisible';
      dclass = branch.current || !branch.local ? 'invisible' : '';
      return this.div({
        "class": "branch " + bklass,
        'data-name': branch.name
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'info'
          }, function() {
            _this.i({
              "class": 'icon chevron-right'
            });
            return _this.span({
              "class": 'clickable',
              click: 'checkout'
            }, branch.name);
          });
          _this.div({
            "class": "right-info " + dclass
          }, function() {
            return _this.i({
              "class": 'icon trash clickable',
              click: 'deleteThis'
            });
          });
          return _this.div({
            "class": "right-info count " + cklass
          }, function() {
            _this.span(branch.count.ahead);
            _this.i({
              "class": 'icon cloud-upload'
            });
            _this.span(branch.count.behind);
            return _this.i({
              "class": 'icon cloud-download'
            });
          });
        };
      })(this));
    };

    BranchItem.prototype.initialize = function(branch) {
      return this.branch = branch;
    };

    BranchItem.prototype.checkout = function() {
      return this.branch.checkout(this.branch.name);
    };

    BranchItem.prototype.deleteThis = function() {
      return this.branch["delete"](this.branch.name);
    };

    return BranchItem;

  })(View);

  module.exports = BranchView = (function(_super) {
    __extends(BranchView, _super);

    function BranchView() {
      return BranchView.__super__.constructor.apply(this, arguments);
    }

    BranchView.content = function(params) {
      return this.div({
        "class": 'branches'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon branch'
            });
            return _this.span(params.name);
          });
        };
      })(this));
    };

    BranchView.prototype.initialize = function(params) {
      this.params = params;
      return this.branches = [];
    };

    BranchView.prototype.clearAll = function() {
      this.find('>.branch').remove();
    };

    BranchView.prototype.addAll = function(branches) {
      var checkout, remove;
      this.selectedBranch = git["get" + (this.params.local ? 'Local' : 'Remote') + "Branch"]();
      this.clearAll();
      remove = (function(_this) {
        return function(name) {
          return _this.deleteBranch(name);
        };
      })(this);
      checkout = (function(_this) {
        return function(name) {
          return _this.checkoutBranch(name);
        };
      })(this);
      branches.forEach((function(_this) {
        return function(branch) {
          var count, current;
          current = _this.params.local && branch === _this.selectedBranch;
          count = {
            total: 0
          };
          if (current) {
            count = git.count(branch);
            count.total = count.ahead + count.behind;
            _this.parentView.branchCount(count);
          }
          _this.append(new BranchItem({
            name: branch,
            count: count,
            current: current,
            local: _this.params.local,
            "delete": remove,
            checkout: checkout
          }));
        };
      })(this));
    };

    BranchView.prototype.checkoutBranch = function(name) {
      this.parentView.checkoutBranch(name, !this.params.local);
    };

    BranchView.prototype.deleteBranch = function(name) {
      this.parentView.deleteBranch(name);
    };

    return BranchView;

  })(View);

}).call(this);

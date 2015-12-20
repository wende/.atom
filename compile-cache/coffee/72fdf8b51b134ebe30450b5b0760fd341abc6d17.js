(function() {
  var BranchDialog, Dialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = BranchDialog = (function(_super) {
    __extends(BranchDialog, _super);

    function BranchDialog() {
      return BranchDialog.__super__.constructor.apply(this, arguments);
    }

    BranchDialog.content = function() {
      return this.div({
        "class": 'dialog'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon x clickable',
              click: 'cancel'
            });
            return _this.strong('Branch');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Current Branch');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              readonly: true,
              outlet: 'fromBranch'
            });
            _this.label('New Branch');
            return _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'toBranch'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'branch'
            }, function() {
              _this.i({
                "class": 'icon branch'
              });
              return _this.span('Branch');
            });
            return _this.button({
              click: 'cancel'
            }, function() {
              _this.i({
                "class": 'icon x'
              });
              return _this.span('Cancel');
            });
          });
        };
      })(this));
    };

    BranchDialog.prototype.activate = function() {
      this.fromBranch.val(git.getLocalBranch());
      this.toBranch.val('');
      return BranchDialog.__super__.activate.call(this);
    };

    BranchDialog.prototype.branch = function() {
      this.deactivate();
      this.parentView.createBranch(this.toBranch.val());
    };

    return BranchDialog;

  })(Dialog);

}).call(this);

(function() {
  var Dialog, MergeDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = MergeDialog = (function(_super) {
    __extends(MergeDialog, _super);

    function MergeDialog() {
      return MergeDialog.__super__.constructor.apply(this, arguments);
    }

    MergeDialog.content = function() {
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
            return _this.strong('Merge');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Current Branch');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              readonly: true,
              outlet: 'toBranch'
            });
            _this.label('Merge From Branch');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'fromBranch'
            });
            return _this.div(function() {
              _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'noff'
              });
              return _this.label('No Fast-Forward');
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'merge'
            }, function() {
              _this.i({
                "class": 'icon merge'
              });
              return _this.span('Merge');
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

    MergeDialog.prototype.activate = function(branches) {
      var branch, current, _i, _len;
      current = git.getLocalBranch();
      this.toBranch.val(current);
      this.fromBranch.find('option').remove();
      for (_i = 0, _len = branches.length; _i < _len; _i++) {
        branch = branches[_i];
        if (branch !== current) {
          this.fromBranch.append("<option value='" + branch + "'>" + branch + "</option>");
        }
      }
      return MergeDialog.__super__.activate.call(this);
    };

    MergeDialog.prototype.merge = function() {
      this.deactivate();
      this.parentView.merge(this.fromBranch.val(), this.noFF());
    };

    MergeDialog.prototype.noFF = function() {
      return this.noff.is(':checked');
    };

    return MergeDialog;

  })(Dialog);

}).call(this);

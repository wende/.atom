(function() {
  var CommitDialog, Dialog,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  module.exports = CommitDialog = (function(_super) {
    __extends(CommitDialog, _super);

    function CommitDialog() {
      return CommitDialog.__super__.constructor.apply(this, arguments);
    }

    CommitDialog.content = function() {
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
            return _this.strong('Commit');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Commit Message');
            return _this.textarea({
              "class": 'native-key-bindings',
              outlet: 'msg'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'commit'
            }, function() {
              _this.i({
                "class": 'icon commit'
              });
              return _this.span('Commit');
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

    CommitDialog.prototype.activate = function() {
      this.msg.val('');
      return CommitDialog.__super__.activate.call(this);
    };

    CommitDialog.prototype.commit = function() {
      this.deactivate();
      this.parentView.commit();
    };

    CommitDialog.prototype.getMessage = function() {
      return this.msg.val();
    };

    return CommitDialog;

  })(Dialog);

}).call(this);

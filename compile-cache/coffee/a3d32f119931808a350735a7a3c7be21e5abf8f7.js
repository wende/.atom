(function() {
  var Dialog, PushDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = PushDialog = (function(_super) {
    __extends(PushDialog, _super);

    function PushDialog() {
      return PushDialog.__super__.constructor.apply(this, arguments);
    }

    PushDialog.content = function() {
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
            return _this.strong('Push');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.div(function() {
              return _this.button({
                click: 'upstream'
              }, function() {
                return _this.p('Push upstream', function() {
                  return _this.i({
                    "class": 'icon push'
                  });
                });
              });
            });
            _this.label('Push from branch');
            _this.input({
              "class": 'native-key-bindings',
              readonly: true,
              outlet: 'fromBranch'
            });
            _this.label('To branch');
            return _this.select({
              "class": 'native-key-bindings',
              outlet: 'toBranch'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'push'
            }, function() {
              _this.i({
                "class": 'icon push'
              });
              return _this.span('Push');
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

    PushDialog.prototype.activate = function(remotes) {
      var remote, _i, _len;
      this.fromBranch.val(git.getLocalBranch());
      this.toBranch.find('option').remove();
      for (_i = 0, _len = remotes.length; _i < _len; _i++) {
        remote = remotes[_i];
        this.toBranch.append("<option value='" + remote + "'>" + remote + "</option>");
      }
      return PushDialog.__super__.activate.call(this);
    };

    PushDialog.prototype.push = function() {
      var branch, remote;
      this.deactivate();
      remote = this.toBranch.val().split('/')[0];
      branch = this.toBranch.val().split('/')[1];
      this.parentView.push(remote, branch);
    };

    PushDialog.prototype.upstream = function() {
      this.deactivate();
      return this.parentView.push('', '');
    };

    return PushDialog;

  })(Dialog);

}).call(this);

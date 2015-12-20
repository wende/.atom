(function() {
  var GitNotFoundError, GitNotFoundErrorView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  GitNotFoundError = require('../git-bridge').GitNotFoundError;

  GitNotFoundErrorView = (function(_super) {
    __extends(GitNotFoundErrorView, _super);

    function GitNotFoundErrorView() {
      return GitNotFoundErrorView.__super__.constructor.apply(this, arguments);
    }

    GitNotFoundErrorView.content = function(err) {
      return this.div({
        "class": 'overlay from-top padded merge-conflict-error merge-conflicts-message'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'panel'
          }, function() {
            _this.div({
              "class": 'panel-heading no-path'
            }, function() {
              _this.code('git');
              return _this.text("can't be found in any of the default locations!");
            });
            _this.div({
              "class": 'panel-heading wrong-path'
            }, function() {
              _this.code('git');
              _this.text("can't be found at ");
              _this.code(atom.config.get('merge-conflicts.gitPath'));
              return _this.text('!');
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              _this.div({
                "class": 'block'
              }, 'Please specify the correct path in the merge-conflicts package settings.');
              return _this.div({
                "class": 'block'
              }, function() {
                _this.button({
                  "class": 'btn btn-error inline-block-tight',
                  click: 'openSettings'
                }, 'Open Settings');
                return _this.button({
                  "class": 'btn inline-block-tight',
                  click: 'notRightNow'
                }, 'Not Right Now');
              });
            });
          });
        };
      })(this));
    };

    GitNotFoundErrorView.prototype.initialize = function(err) {
      if (atom.config.get('merge-conflicts.gitPath')) {
        this.find('.no-path').hide();
        return this.find('.wrong-path').show();
      } else {
        this.find('.no-path').show();
        return this.find('.wrong-path').hide();
      }
    };

    GitNotFoundErrorView.prototype.openSettings = function() {
      atom.workspace.open('atom://config/packages');
      return this.remove();
    };

    GitNotFoundErrorView.prototype.notRightNow = function() {
      return this.remove();
    };

    return GitNotFoundErrorView;

  })(View);

  module.exports = {
    handleErr: function(err) {
      if (err == null) {
        return false;
      }
      if (err instanceof GitNotFoundError) {
        atom.workspace.addTopPanel({
          item: new GitNotFoundErrorView(err)
        });
      } else {
        atom.notifications.addError(err.message);
        console.error(err.message, err.trace);
      }
      return true;
    }
  };

}).call(this);

(function() {
  var ConfirmDialog, Dialog,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  module.exports = ConfirmDialog = (function(_super) {
    __extends(ConfirmDialog, _super);

    function ConfirmDialog() {
      return ConfirmDialog.__super__.constructor.apply(this, arguments);
    }

    ConfirmDialog.content = function(params) {
      return this.div({
        "class": 'dialog active'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon x clickable',
              click: 'cancel'
            });
            return _this.strong(params.hdr);
          });
          _this.div({
            "class": 'body'
          }, function() {
            return _this.div(params.msg);
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'confirm'
            }, function() {
              _this.i({
                "class": 'icon check'
              });
              return _this.span('Yes');
            });
            return _this.button({
              click: 'cancel'
            }, function() {
              _this.i({
                "class": 'icon x'
              });
              return _this.span('No');
            });
          });
        };
      })(this));
    };

    ConfirmDialog.prototype.initialize = function(params) {
      return this.params = params;
    };

    ConfirmDialog.prototype.confirm = function() {
      this.deactivate();
      this.params.cb(this.params);
    };

    return ConfirmDialog;

  })(Dialog);

}).call(this);

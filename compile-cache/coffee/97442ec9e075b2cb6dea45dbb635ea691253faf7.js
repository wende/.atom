(function() {
  var Dialog, FlowDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = FlowDialog = (function(_super) {
    __extends(FlowDialog, _super);

    function FlowDialog() {
      return FlowDialog.__super__.constructor.apply(this, arguments);
    }

    FlowDialog.content = function() {
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
            return _this.strong('Workflow - GitFlow');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Git Flow ');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowType',
              change: 'flowTypeChange'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowAction',
              change: 'flowActionChange'
            });
            _this.label('Branch Name:', {
              outlet: 'labelBranchName'
            });
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'branchName'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'branchChoose'
            });
            _this.label('Message:', {
              outlet: 'labelMessage'
            });
            return _this.textarea({
              "class": 'native-key-bindings',
              outlet: 'message'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'flow'
            }, function() {
              _this.i({
                "class": 'icon flow'
              });
              return _this.span('Ok');
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

    FlowDialog.prototype.activate = function(branches) {
      var current;
      current = git.getLocalBranch();
      this.branches = branches;
      this.flowType.find('option').remove();
      this.flowType.append("<option value='feature'>feature</option>");
      this.flowType.append("<option value='release'>release</option>");
      this.flowType.append("<option value='hotfix'>hotfix</option>");
      this.flowType.append("<option value='init'>init</option>");
      this.flowAction.find('option').remove();
      this.flowAction.append("<option value='start'>start</option>");
      this.flowAction.append("<option value='finish'>finish</option>");
      this.flowAction.append("<option value='publish'>publish</option>");
      this.flowAction.append("<option value='pull'>pull</option>");
      this.flowTypeChange();
      this.flowActionChange();
      return FlowDialog.__super__.activate.call(this);
    };

    FlowDialog.prototype.flow = function() {
      var actionSelected, branchSelected;
      this.deactivate();
      if (this.flowType.val() === "init") {
        this.parentView.flow(this.flowType.val(), '-d', '');
      } else {
        branchSelected = this.branchName.val() !== '' ? this.branchName.val() : this.branchChoose.val();
        actionSelected = this.flowAction.val();
        if ((branchSelected != null) && branchSelected !== '') {
          if (actionSelected === "finish" && this.message.val() !== '') {
            actionSelected = 'finish -m "' + this.message.val() + '"';
          }
          this.parentView.flow(this.flowType.val(), actionSelected, branchSelected);
        } else {
          git.alert("> No branches selected... Git flow action not valid.");
        }
      }
    };

    FlowDialog.prototype.checkMessageNeeded = function() {
      this.message.val("");
      if (this.flowAction.val() === "finish" && (this.flowType.val() === "release" || this.flowType.val() === "hotfix")) {
        this.message.show();
        this.labelMessage.show();
      } else {
        this.message.hide();
        this.labelMessage.hide();
      }
    };

    FlowDialog.prototype.flowTypeChange = function() {
      if (this.flowType.val() === "init") {
        this.flowAction.hide();
        this.branchName.hide();
        this.branchChoose.hide();
        this.labelBranchName.hide();
      } else {
        this.flowAction.show();
        this.flowActionChange();
        this.labelBranchName.show();
      }
      this.checkMessageNeeded();
    };

    FlowDialog.prototype.flowActionChange = function() {
      var branch, value, _i, _len, _ref;
      this.checkMessageNeeded();
      if (this.flowAction.val() !== "start") {
        this.branchName.hide();
        this.branchName.val('');
        this.branchChoose.find('option').remove();
        _ref = this.branches;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          branch = _ref[_i];
          if (branch.indexOf(this.flowType.val()) !== -1) {
            value = branch.replace(this.flowType.val() + '/', '');
            this.branchChoose.append("<option value='" + value + "'>" + value + "</option>");
          }
        }
        if (this.branchChoose.find('option').length <= 0) {
          this.branchChoose.append("<option value=''> --no " + this.flowType.val() + " branches--</option>");
        }
        return this.branchChoose.show();
      } else {
        this.branchName.show();
        this.branchChoose.val('');
        return this.branchChoose.hide();
      }
    };

    return FlowDialog;

  })(Dialog);

}).call(this);

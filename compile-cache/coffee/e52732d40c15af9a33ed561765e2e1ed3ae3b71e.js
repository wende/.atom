(function() {
  var Convert, TestStatusView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  Convert = require('ansi-to-html');

  module.exports = TestStatusView = (function(_super) {
    __extends(TestStatusView, _super);

    function TestStatusView() {
      return TestStatusView.__super__.constructor.apply(this, arguments);
    }

    TestStatusView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'test-status-output tool-panel panel-bottom padded native-key-bindings'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.div({
              "class": 'message',
              outlet: 'testStatusOutput'
            });
          });
        };
      })(this));
    };

    TestStatusView.prototype.initialize = function() {
      this.output = "<strong>No output</strong>";
      this.testStatusOutput.html(this.output).css('font-size', "" + (atom.config.getInt('editor.fontSize')) + "px");
      return atom.commands.add('atom-workspace', {
        'test-status:toggle-output': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
    };

    TestStatusView.prototype.update = function(output) {
      if (this.convert == null) {
        this.convert = new Convert;
      }
      this.output = this.convert.toHtml(output.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      return this.testStatusOutput.html("<pre>" + (this.output.trim()) + "</pre>");
    };

    TestStatusView.prototype.destroy = function() {
      return this.detach();
    };

    TestStatusView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return atom.workspace.addBottomPanel({
          item: this
        });
      }
    };

    return TestStatusView;

  })(View);

}).call(this);

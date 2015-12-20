(function() {
  var CommandRunner, TestStatusStatusBarView, TestStatusView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  TestStatusView = require('./test-status-view');

  CommandRunner = require('./command-runner');

  module.exports = TestStatusStatusBarView = (function(_super) {
    __extends(TestStatusStatusBarView, _super);

    function TestStatusStatusBarView() {
      return TestStatusStatusBarView.__super__.constructor.apply(this, arguments);
    }

    TestStatusStatusBarView.content = function() {
      return this.div({
        "class": 'inline-block'
      }, (function(_this) {
        return function() {
          return _this.span({
            outlet: 'testStatus',
            "class": 'test-status icon icon-hubot',
            tabindex: -1
          }, '');
        };
      })(this));
    };

    TestStatusStatusBarView.prototype.initialize = function() {
      this.testStatusView = new TestStatusView;
      this.commandRunner = new CommandRunner(this.testStatus, this.testStatusView);
      this.attach();
      atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.subscribeBufferEvents(editor);
        };
      })(this));
      this.subscribe(this, 'click', (function(_this) {
        return function() {
          return _this.testStatusView.toggle();
        };
      })(this));
      return atom.commands.add('atom-workspace', {
        'test-status:run-tests': (function(_this) {
          return function() {
            return _this.commandRunner.run();
          };
        })(this)
      });
    };

    TestStatusStatusBarView.prototype.attach = function() {
      var statusBar;
      statusBar = document.querySelector('status-bar');
      if (statusBar != null) {
        return this.statusBarTile = statusBar.addLeftTile({
          item: this,
          priority: 100
        });
      }
    };

    TestStatusStatusBarView.prototype.destroy = function() {
      atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.unsubscribeBufferEvents(editor);
        };
      })(this));
      this.testStatusView.destroy();
      this.testStatusView = null;
      return this.detach();
    };

    TestStatusStatusBarView.prototype.subscribeBufferEvents = function(editor) {
      var buffer;
      buffer = editor.getBuffer();
      this.subscribe(buffer.on('saved', (function(_this) {
        return function() {
          if (!atom.config.get('test-status.autorun')) {
            return;
          }
          return _this.commandRunner.run();
        };
      })(this)));
      return this.subscribe(buffer.on('destroyed', (function(_this) {
        return function() {
          return _this.unsubscribe(buffer);
        };
      })(this)));
    };

    TestStatusStatusBarView.prototype.unsubscribeBufferEvents = function(editor) {
      var buffer;
      buffer = editor.getBuffer();
      return this.unsubscribe(buffer);
    };

    return TestStatusStatusBarView;

  })(View);

}).call(this);

(function() {
  var TestStatusStatusBarView;

  TestStatusStatusBarView = require('./test-status-status-bar-view');

  module.exports = {
    config: {
      autorun: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      var createStatusEntry, statusBar;
      createStatusEntry = (function(_this) {
        return function() {
          return _this.testStatusStatusBar = new TestStatusStatusBarView;
        };
      })(this);
      statusBar = document.querySelector('status-bar');
      if (statusBar != null) {
        return createStatusEntry();
      } else {
        return atom.packages.once('activated', function() {
          return createStatusEntry();
        });
      }
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.testStatusStatusBar) != null) {
        _ref.destroy();
      }
      return this.testStatusStatusBar = null;
    }
  };

}).call(this);

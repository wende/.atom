(function() {
  var ToolBarManager;

  ToolBarManager = null;

  module.exports = {
    toolBar: null,
    activate: function() {
      var ToolBarView;
      ToolBarView = require('./tool-bar-view');
      this.toolBar = new ToolBarView();
      return ToolBarManager = require('./tool-bar-manager');
    },
    deactivate: function() {
      return this.toolBar.destroy();
    },
    serialize: function() {},
    config: {
      position: {
        type: 'string',
        "default": 'Top',
        "enum": ['Top', 'Right', 'Bottom', 'Left']
      },
      visible: {
        type: 'boolean',
        "default": true
      },
      iconSize: {
        type: 'string',
        "default": '24px',
        "enum": ['16px', '24px', '32px']
      }
    },
    provideToolBar: function() {
      return (function(_this) {
        return function(group) {
          return new ToolBarManager(group, _this.toolBar);
        };
      })(this);
    }
  };

}).call(this);

(function() {
  var $$, ToolBarButtonView, ToolBarManager;

  ToolBarButtonView = require('./tool-bar-button-view');

  $$ = require('space-pen').$$;

  module.exports = ToolBarManager = (function() {
    function ToolBarManager(group, toolBar) {
      this.group = group;
      this.toolBar = toolBar;
    }

    ToolBarManager.prototype.addButton = function(options) {
      var button;
      button = new ToolBarButtonView(options);
      button.group = this.group;
      this.toolBar.addItem(button);
      return button;
    };

    ToolBarManager.prototype.addSpacer = function(options) {
      var spacer;
      spacer = $$(function() {
        return this.hr({
          "class": 'tool-bar-spacer'
        });
      });
      spacer.priority = options != null ? options.priority : void 0;
      spacer.group = this.group;
      this.toolBar.addItem(spacer);
      return spacer;
    };

    ToolBarManager.prototype.removeItems = function() {
      var items;
      items = this.toolBar.items.filter((function(_this) {
        return function(item) {
          return item.group === _this.group;
        };
      })(this));
      return items.forEach((function(_this) {
        return function(item) {
          return _this.toolBar.removeItem(item);
        };
      })(this));
    };

    return ToolBarManager;

  })();

}).call(this);

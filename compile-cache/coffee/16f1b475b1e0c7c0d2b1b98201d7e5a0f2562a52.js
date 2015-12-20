(function() {
  module.exports = {
    activate: function(state) {},
    deactivate: function() {
      var _ref;
      return (_ref = this.toolBar) != null ? _ref.removeItems() : void 0;
    },
    serialize: function() {},
    consumeToolBar: function(toolBar) {
      this.toolBar = toolBar('main-tool-bar');
      this.toolBar.addButton({
        icon: 'document',
        callback: 'application:new-file',
        tooltip: 'New File',
        iconset: 'ion'
      });
      this.toolBar.addButton({
        icon: 'folder',
        callback: 'application:open-file',
        tooltip: 'Open...',
        iconset: 'ion'
      });
      this.toolBar.addButton({
        icon: 'archive',
        callback: 'core:save',
        tooltip: 'Save',
        iconset: 'ion'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        icon: 'search',
        callback: 'find-and-replace:show',
        tooltip: 'Find in Buffer',
        iconset: 'ion'
      });
      this.toolBar.addButton({
        icon: 'shuffle',
        callback: 'find-and-replace:show-replace',
        tooltip: 'Replace in Buffer',
        iconset: 'ion'
      });
      this.toolBar.addSpacer();
      this.toolBar.addButton({
        icon: 'navicon-round',
        callback: 'command-palette:toggle',
        tooltip: 'Toggle Command Palette',
        iconset: 'ion'
      });
      this.toolBar.addButton({
        icon: 'gear-a',
        callback: 'settings-view:open',
        tooltip: 'Open Settings View',
        iconset: 'ion'
      });
      if (atom.inDevMode()) {
        this.toolBar.addSpacer();
        this.toolBar.addButton({
          icon: 'refresh',
          callback: 'window:reload',
          tooltip: 'Reload Window',
          iconset: 'ion'
        });
        return this.toolBar.addButton({
          icon: 'terminal',
          callback: function() {
            return require('remote').getCurrentWindow().toggleDevTools();
          },
          tooltip: 'Toggle Developer Tools'
        });
      }
    }
  };

}).call(this);

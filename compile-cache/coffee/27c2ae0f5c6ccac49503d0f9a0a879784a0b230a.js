(function() {
  var CMD_TOGGLE, CompositeDisposable, EVT_SWITCH, GitControl, GitControlView, item, pane, view, views;

  GitControlView = require('./git-control-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  CMD_TOGGLE = 'git-control:toggle';

  EVT_SWITCH = 'pane-container:active-pane-item-changed';

  views = [];

  view = void 0;

  pane = void 0;

  item = void 0;

  module.exports = GitControl = {
    activate: function(state) {
      console.log('GitControl: activate');
      atom.commands.add('atom-workspace', CMD_TOGGLE, (function(_this) {
        return function() {
          return _this.toggleView();
        };
      })(this));
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          return _this.updateViews();
        };
      })(this));
    },
    deactivate: function() {
      console.log('GitControl: deactivate');
    },
    toggleView: function() {
      console.log('GitControl: toggle');
      if (!(view && view.active)) {
        view = new GitControlView();
        views.push(view);
        pane = atom.workspace.getActivePane();
        item = pane.addItem(view, 0);
        pane.activateItem(item);
      } else {
        pane.destroyItem(item);
      }
    },
    updateViews: function() {
      var activeView, v, _i, _len;
      activeView = atom.workspace.getActivePane().getActiveItem();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        v = views[_i];
        if (v === activeView) {
          v.update();
        }
      }
    },
    serialize: function() {}
  };

}).call(this);

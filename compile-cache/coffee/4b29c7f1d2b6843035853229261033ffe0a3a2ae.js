(function() {
  var $;

  $ = require('jquery');

  module.exports = {
    activate: function(state) {
      atom.workspaceView.command("layout-manager:maximize-active-pane", (function(_this) {
        return function() {
          return _this.maximize();
        };
      })(this));
      atom.workspaceView.command("layout-manager:enlarge-active-pane", (function(_this) {
        return function() {
          return _this.enlarge();
        };
      })(this));
      atom.workspaceView.command("layout-manager:shrink-active-pane", (function(_this) {
        return function() {
          return _this.shrink();
        };
      })(this));
      atom.workspaceView.command("layout-manager:move-pane-right", (function(_this) {
        return function() {
          return _this.moveRight();
        };
      })(this));
      atom.workspaceView.command("layout-manager:move-pane-left", (function(_this) {
        return function() {
          return _this.moveLeft();
        };
      })(this));
      atom.workspaceView.command("layout-manager:move-pane-down", (function(_this) {
        return function() {
          return _this.moveDown();
        };
      })(this));
      atom.workspaceView.command("layout-manager:move-pane-up", (function(_this) {
        return function() {
          return _this.moveUp();
        };
      })(this));
      atom.workspaceView.command("layout-manager:move-pane-next", (function(_this) {
        return function() {
          return _this.moveNext();
        };
      })(this));
      return atom.workspaceView.command("layout-manager:move-pane-previous", (function(_this) {
        return function() {
          return _this.movePrevious();
        };
      })(this));
    },
    maximize: function() {
      return $('html').toggleClass('maximize-pane-on');
    },
    enlarge: function() {
      var flex;
      flex = this.getFlex();
      flex.grow *= 1.1;
      flex.shrink *= 1.1;
      return this.setFlex(flex);
    },
    shrink: function() {
      var flex;
      flex = this.getFlex();
      flex.shrink /= 1.1;
      flex.grow /= 1.1;
      return this.setFlex(flex);
    },
    moveRight: function() {
      return this.move('horizontal', +1);
    },
    moveLeft: function() {
      return this.move('horizontal', -1);
    },
    moveUp: function() {
      return this.move('vertical', -1);
    },
    moveDown: function() {
      return this.move('vertical', +1);
    },
    moveNext: function() {
      return this.moveOrder(+1);
    },
    movePrevious: function() {
      return this.moveOrder(-1);
    },
    moveOrder: function(delta) {
      var pane, target;
      pane = atom.workspace.getActivePane();
      if (delta > 0) {
        atom.workspace.activateNextPane();
      } else {
        atom.workspace.activatePreviousPane();
      }
      target = atom.workspace.getActivePane();
      return this.swapEditor(pane, target);
    },
    move: function(orientation, delta) {
      var axis, child, pane, target, _ref;
      pane = atom.workspace.getActivePane();
      _ref = this.getAxis(pane, orientation), axis = _ref[0], child = _ref[1];
      if (axis != null) {
        target = this.getRelativePane(axis, child, delta);
      }
      if (target != null) {
        return this.swapEditor(pane, target);
      }
    },
    swapEditor: function(source, target) {
      var editor;
      editor = source.getActiveItem();
      source.removeItem(editor);
      target.addItem(editor);
      target.activateItem(editor);
      return target.activate();
    },
    getAxis: function(pane, orientation) {
      var axis, child;
      axis = pane.parent;
      child = pane;
      while (true) {
        if (axis.constructor.name !== 'PaneAxis') {
          return;
        }
        if (axis.orientation === orientation) {
          break;
        }
        child = axis;
        axis = axis.parent;
      }
      return [axis, child];
    },
    getRelativePane: function(axis, source, delta) {
      var position, target;
      position = axis.children.indexOf(source);
      target = position + delta;
      if (!(target < axis.children.length)) {
        return;
      }
      return axis.children[target].getPanes()[0];
    },
    getFlex: function() {
      var basis, grow, shrink, _ref;
      _ref = $('.pane.active').css('-webkit-flex').split(' '), grow = _ref[0], shrink = _ref[1], basis = _ref[2];
      return {
        grow: grow,
        shrink: shrink,
        basis: basis
      };
    },
    setFlex: function(_arg) {
      var basis, flex, grow, shrink;
      grow = _arg.grow, shrink = _arg.shrink, basis = _arg.basis;
      flex = [grow, shrink, basis].join(' ');
      return $('.pane.active').css('-webkit-flex', flex);
    },
    deactivate: function() {},
    serialize: function() {}
  };

}).call(this);

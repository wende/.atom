(function() {
  var CompositeDisposable, ToolBarView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  _ = require('underscore-plus');

  module.exports = ToolBarView = (function(_super) {
    __extends(ToolBarView, _super);

    function ToolBarView() {
      this.drawGutter = __bind(this.drawGutter, this);
      return ToolBarView.__super__.constructor.apply(this, arguments);
    }

    ToolBarView.content = function() {
      return this.div({
        "class": 'tool-bar'
      });
    };

    ToolBarView.prototype.items = [];

    ToolBarView.prototype.addItem = function(newItem) {
      var existingItem, index, newElement, nextElement, nextItem, _i, _len, _ref, _ref1, _ref2;
      if (newItem.priority == null) {
        newItem.priority = (_ref = (_ref1 = this.items[this.items.length - 1]) != null ? _ref1.priority : void 0) != null ? _ref : 50;
      }
      nextItem = null;
      _ref2 = this.items;
      for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
        existingItem = _ref2[index];
        if (existingItem.priority > newItem.priority) {
          nextItem = existingItem;
          break;
        }
      }
      this.items.splice(index, 0, newItem);
      newElement = atom.views.getView(newItem);
      nextElement = atom.views.getView(nextItem);
      this.element.insertBefore(newElement, nextElement);
      this.drawGutter();
      return nextItem;
    };

    ToolBarView.prototype.removeItem = function(item) {
      var element, index;
      index = this.items.indexOf(item);
      this.items.splice(index, 1);
      element = atom.views.getView(item);
      this.element.removeChild(element);
      return this.drawGutter();
    };

    ToolBarView.prototype.initialize = function() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-top', (function(_this) {
        return function() {
          _this.updatePosition('Top');
          return atom.config.set('tool-bar.position', 'Top');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-right', (function(_this) {
        return function() {
          _this.updatePosition('Right');
          return atom.config.set('tool-bar.position', 'Right');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-bottom', (function(_this) {
        return function() {
          _this.updatePosition('Bottom');
          return atom.config.set('tool-bar.position', 'Bottom');
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:position-left', (function(_this) {
        return function() {
          _this.updatePosition('Left');
          return atom.config.set('tool-bar.position', 'Left');
        };
      })(this)));
      atom.config.observe('tool-bar.iconSize', (function(_this) {
        return function(newValue) {
          return _this.updateSize(newValue);
        };
      })(this));
      atom.config.onDidChange('tool-bar.position', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          if (atom.config.get('tool-bar.visible')) {
            return _this.show();
          }
        };
      })(this));
      atom.config.onDidChange('tool-bar.visible', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          if (newValue) {
            return _this.show();
          } else {
            return _this.hide();
          }
        };
      })(this));
      if (atom.config.get('tool-bar.visible')) {
        this.show();
      }
      this.element.addEventListener('scroll', this.drawGutter);
      return window.addEventListener('resize', this.drawGutter);
    };

    ToolBarView.prototype.serialize = function() {};

    ToolBarView.prototype.destroy = function() {
      this.subscriptions.dispose();
      if (this.panel != null) {
        this.detach();
      }
      if (this.panel != null) {
        this.panel.destroy();
      }
      return window.removeEventListener('resize', this.drawGutter);
    };

    ToolBarView.prototype.updateSize = function(size) {
      this.removeClass('tool-bar-16px tool-bar-24px tool-bar-32px');
      return this.addClass("tool-bar-" + size);
    };

    ToolBarView.prototype.updatePosition = function(position) {
      this.removeClass('tool-bar-top tool-bar-right tool-bar-bottom tool-bar-left tool-bar-horizontal tool-bar-vertical');
      switch (position) {
        case 'Top':
          this.panel = atom.workspace.addTopPanel({
            item: this
          });
          break;
        case 'Right':
          this.panel = atom.workspace.addRightPanel({
            item: this
          });
          break;
        case 'Bottom':
          this.panel = atom.workspace.addBottomPanel({
            item: this
          });
          break;
        case 'Left':
          this.panel = atom.workspace.addLeftPanel({
            item: this,
            priority: 50
          });
      }
      this.addClass("tool-bar-" + (position.toLowerCase()));
      if (position === 'Top' || position === 'Bottom') {
        this.addClass('tool-bar-horizontal');
      } else {
        this.addClass('tool-bar-vertical');
      }
      this.updateMenu(position);
      return this.drawGutter();
    };

    ToolBarView.prototype.updateMenu = function(position) {
      var packagesMenu, positionMenu, positionsMenu, toolBarMenu;
      packagesMenu = _.find(atom.menu.template, function(_arg) {
        var label;
        label = _arg.label;
        return label === 'Packages' || label === '&Packages';
      });
      if (packagesMenu) {
        toolBarMenu = _.find(packagesMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === 'Tool Bar' || label === '&Tool Bar';
        });
      }
      if (toolBarMenu) {
        positionsMenu = _.find(toolBarMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === 'Position' || label === '&Position';
        });
      }
      if (positionsMenu) {
        positionMenu = _.find(positionsMenu.submenu, function(_arg) {
          var label;
          label = _arg.label;
          return label === position;
        });
      }
      return positionMenu != null ? positionMenu.checked = true : void 0;
    };

    ToolBarView.prototype.drawGutter = function() {
      var hiddenHeight, scrollHeight, visibleHeight;
      this.removeClass('gutter-top gutter-bottom');
      visibleHeight = this.height();
      scrollHeight = this.element.scrollHeight;
      hiddenHeight = scrollHeight - visibleHeight;
      if (visibleHeight < scrollHeight) {
        if (this.scrollTop() > 0) {
          this.addClass('gutter-top');
        }
        if (this.scrollTop() < hiddenHeight) {
          return this.addClass('gutter-bottom');
        }
      }
    };

    ToolBarView.prototype.hide = function() {
      if (this.panel != null) {
        this.detach();
      }
      if (this.panel != null) {
        return this.panel.destroy();
      }
    };

    ToolBarView.prototype.show = function() {
      this.hide();
      this.updatePosition(atom.config.get('tool-bar.position'));
      return this.updateSize(atom.config.get('tool-bar.iconSize'));
    };

    ToolBarView.prototype.toggle = function() {
      if (this.hasParent()) {
        this.hide();
        return atom.config.set('tool-bar.visible', false);
      } else {
        this.show();
        return atom.config.set('tool-bar.visible', true);
      }
    };

    return ToolBarView;

  })(View);

}).call(this);

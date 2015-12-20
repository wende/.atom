(function() {
  var $, MenuItem, MenuView, View, items, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  items = [
    {
      id: 'compare',
      menu: 'Compare',
      icon: 'compare',
      type: 'active'
    }, {
      id: 'commit',
      menu: 'Commit',
      icon: 'commit',
      type: 'file merging'
    }, {
      id: 'reset',
      menu: 'Reset',
      icon: 'sync',
      type: 'file'
    }, {
      id: 'fetch',
      menu: 'Fetch',
      icon: 'cloud-download',
      type: 'remote'
    }, {
      id: 'pull',
      menu: 'Pull',
      icon: 'pull',
      type: 'upstream'
    }, {
      id: 'push',
      menu: 'Push',
      icon: 'push',
      type: 'downstream'
    }, {
      id: 'merge',
      menu: 'Merge',
      icon: 'merge',
      type: 'active'
    }, {
      id: 'branch',
      menu: 'Branch',
      icon: 'branch',
      type: 'active'
    }, {
      id: 'flow',
      menu: 'GitFlow',
      icon: 'flow',
      type: 'active'
    }
  ];

  MenuItem = (function(_super) {
    __extends(MenuItem, _super);

    function MenuItem() {
      return MenuItem.__super__.constructor.apply(this, arguments);
    }

    MenuItem.content = function(item) {
      var klass;
      klass = item.type === 'active' ? '' : 'inactive';
      return this.div({
        "class": "item " + klass + " " + item.type,
        id: "menu" + item.id,
        click: 'click'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "icon large " + item.icon
          });
          return _this.div(item.menu);
        };
      })(this));
    };

    MenuItem.prototype.initialize = function(item) {
      return this.item = item;
    };

    MenuItem.prototype.click = function() {
      return this.parentView.click(this.item.id);
    };

    return MenuItem;

  })(View);

  module.exports = MenuView = (function(_super) {
    __extends(MenuView, _super);

    function MenuView() {
      return MenuView.__super__.constructor.apply(this, arguments);
    }

    MenuView.content = function(item) {
      return this.div({
        "class": 'menu'
      }, (function(_this) {
        return function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(_this.subview(item.id, new MenuItem(item)));
          }
          return _results;
        };
      })(this));
    };

    MenuView.prototype.click = function(id) {
      if (!(this.find("#menu" + id).hasClass('inactive'))) {
        return this.parentView["" + id + "MenuClick"]();
      }
    };

    MenuView.prototype.activate = function(type, active) {
      var menuItems;
      menuItems = this.find(".item." + type);
      if (active) {
        menuItems.removeClass('inactive');
      } else {
        menuItems.addClass('inactive');
      }
    };

    return MenuView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9naXQtY29udHJvbC9saWIvdmlld3MvbWVudS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FBUCxDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFRO0lBQ047QUFBQSxNQUFFLEVBQUEsRUFBSSxTQUFOO0FBQUEsTUFBaUIsSUFBQSxFQUFNLFNBQXZCO0FBQUEsTUFBa0MsSUFBQSxFQUFNLFNBQXhDO0FBQUEsTUFBbUQsSUFBQSxFQUFNLFFBQXpEO0tBRE0sRUFFTjtBQUFBLE1BQUUsRUFBQSxFQUFJLFFBQU47QUFBQSxNQUFnQixJQUFBLEVBQU0sUUFBdEI7QUFBQSxNQUFnQyxJQUFBLEVBQU0sUUFBdEM7QUFBQSxNQUFnRCxJQUFBLEVBQU0sY0FBdEQ7S0FGTSxFQUdOO0FBQUEsTUFBRSxFQUFBLEVBQUksT0FBTjtBQUFBLE1BQWUsSUFBQSxFQUFNLE9BQXJCO0FBQUEsTUFBOEIsSUFBQSxFQUFNLE1BQXBDO0FBQUEsTUFBNEMsSUFBQSxFQUFNLE1BQWxEO0tBSE0sRUFLTjtBQUFBLE1BQUUsRUFBQSxFQUFJLE9BQU47QUFBQSxNQUFlLElBQUEsRUFBTSxPQUFyQjtBQUFBLE1BQThCLElBQUEsRUFBTSxnQkFBcEM7QUFBQSxNQUFzRCxJQUFBLEVBQU0sUUFBNUQ7S0FMTSxFQU1OO0FBQUEsTUFBRSxFQUFBLEVBQUksTUFBTjtBQUFBLE1BQWMsSUFBQSxFQUFNLE1BQXBCO0FBQUEsTUFBNEIsSUFBQSxFQUFNLE1BQWxDO0FBQUEsTUFBMEMsSUFBQSxFQUFNLFVBQWhEO0tBTk0sRUFPTjtBQUFBLE1BQUUsRUFBQSxF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

//# sourceURL=/home/iraasta/.atom/packages/git-control/lib/views/menu-view.coffee

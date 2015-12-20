(function() {
  var CompositeDisposable, ToolBarButtonView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  module.exports = ToolBarButtonView = (function(_super) {
    __extends(ToolBarButtonView, _super);

    function ToolBarButtonView() {
      return ToolBarButtonView.__super__.constructor.apply(this, arguments);
    }

    ToolBarButtonView.content = function() {
      return this.button({
        "class": 'btn btn-default tool-bar-btn'
      });
    };

    ToolBarButtonView.prototype.initialize = function(options) {
      this.subscriptions = new CompositeDisposable;
      this.priority = options.priority;
      if (options.tooltip) {
        this.prop('title', options.tooltip);
        this.subscriptions.add(atom.tooltips.add(this, {
          title: options.tooltip,
          placement: this.getTooltipPlacement
        }));
      }
      if (options.iconset) {
        this.addClass("" + options.iconset + " " + options.iconset + "-" + options.icon);
      } else {
        this.addClass("icon-" + options.icon);
      }
      this.on('click', (function(_this) {
        return function() {
          if (!_this.hasClass('disabled')) {
            if (typeof options.callback === 'string') {
              return atom.commands.dispatch(_this.getPreviouslyFocusedElement(), options.callback);
            } else {
              return options.callback(options.data, _this.getPreviouslyFocusedElement());
            }
          }
        };
      })(this));
      return this.on('mouseover', (function(_this) {
        return function() {
          return _this.storeFocusedElement();
        };
      })(this));
    };

    ToolBarButtonView.prototype.setEnabled = function(enabled) {
      if (enabled) {
        return this.removeClass('disabled');
      } else {
        return this.addClass('disabled');
      }
    };

    ToolBarButtonView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    ToolBarButtonView.prototype.getPreviouslyFocusedElement = function() {
      if (this.previouslyFocusedElement && this.previouslyFocusedElement.nodeName !== 'BODY') {
        return this.eventElement = this.previouslyFocusedElement;
      } else {
        return this.eventElement = atom.views.getView(atom.workspace);
      }
    };

    ToolBarButtonView.prototype.storeFocusedElement = function() {
      if (!document.activeElement.classList.contains('tool-bar-btn')) {
        return this.previouslyFocusedElement = document.activeElement;
      }
    };

    ToolBarButtonView.prototype.getTooltipPlacement = function() {
      var toolbarPosition;
      toolbarPosition = atom.config.get('tool-bar.position');
      return toolbarPosition === "Top" && "bottom" || toolbarPosition === "Right" && "left" || toolbarPosition === "Bottom" && "top" || toolbarPosition === "Left" && "right";
    };

    return ToolBarButtonView;

  })(View);

}).call(this);

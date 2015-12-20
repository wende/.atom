(function() {
  var StatusBarSummary, StatusBarSummaryView, View, moveToNextMessage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  moveToNextMessage = require('./utils').moveToNextMessage;

  StatusBarSummaryView = (function() {
    function StatusBarSummaryView() {}

    StatusBarSummaryView.prototype.remove = function() {
      if (this.tile != null) {
        this.tile.destroy();
      }
      return this.tile = null;
    };

    StatusBarSummaryView.prototype.render = function(messages, editor) {
      var el, error, info, item, statusBar, warning, _i, _len;
      statusBar = document.querySelector("status-bar");
      if (statusBar == null) {
        return;
      }
      this.remove();
      info = warning = error = 0;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        item = messages[_i];
        if (item.level === 'info') {
          info += 1;
        }
        if (item.level === 'warning') {
          warning += 1;
        }
        if (item.level === 'error') {
          error += 1;
        }
      }
      if (info + warning + error === 0) {
        return;
      }
      el = new StatusBarSummary(messages, editor, info, warning, error);
      return this.tile = statusBar.addRightTile({
        item: el,
        priority: 100
      });
    };

    return StatusBarSummaryView;

  })();

  StatusBarSummary = (function(_super) {
    __extends(StatusBarSummary, _super);

    function StatusBarSummary() {
      return StatusBarSummary.__super__.constructor.apply(this, arguments);
    }

    StatusBarSummary.prototype.initialize = function(messages, editor) {
      if (!(messages.length > 0)) {
        return;
      }
      return this.on('click', function() {
        return moveToNextMessage(messages, editor);
      });
    };

    StatusBarSummary.content = function(messages, editor, info, warning, error) {
      return this.div({
        "class": 'linter-summary inline-block'
      }, (function(_this) {
        return function() {
          if (error > 0) {
            _this.div({
              "class": 'linter-error inline-block'
            }, error, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
          if (warning > 0) {
            _this.div({
              "class": 'linter-warning inline-block'
            }, warning, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
          if (info > 0) {
            return _this.div({
              "class": 'linter-info inline-block'
            }, info, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
        };
      })(this));
    };

    StatusBarSummary.prototype.detached = function() {
      return this.off('click', '.linter-summary-click-container');
    };

    return StatusBarSummary;

  })(View);

  module.exports = StatusBarSummaryView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Msb0JBQXFCLE9BQUEsQ0FBUSxTQUFSLEVBQXJCLGlCQURELENBQUE7O0FBQUEsRUFJTTtzQ0FDSjs7QUFBQSxtQ0FBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBRU4sTUFBQSxJQUFtQixpQkFBbkI7QUFBQSxRQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLENBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUhGO0lBQUEsQ0FBUixDQUFBOztBQUFBLG1DQU1BLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDTixVQUFBLG1EQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBWixDQUFBO0FBQ0EsTUFBQSxJQUFjLGlCQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQU8sT0FBQSxHQUFVLEtBQUEsR0FBUSxDQU56QixDQUFBO0FBT0EsV0FBQSwrQ0FBQTs0QkFBQTtBQUNFLFFBQUEsSUFBYSxJQUFJLENBQUMsS0FBTCxLQUFjLE1BQTNCO0FBQUEsVUFBQSxJQUFBLElBQVEsQ0FBUixDQUFBO1NBQUE7QUFDQSxRQUFBLElBQWdCLElBQUksQ0FBQyxLQUFMLEtBQWMsU0FBOUI7QUFBQSxVQUFBLE9BQUEsSUFBVyxDQUFYLENBQUE7U0FEQTtBQUVBLFFBQUEsSUFBYyxJQUFJLENBQUMsS0FBTCxLQUFjLE9BQTVCO0FBQUEsVUFBQSxLQUFBLElBQVMsQ0FB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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/statusbar-summary-view.coffee
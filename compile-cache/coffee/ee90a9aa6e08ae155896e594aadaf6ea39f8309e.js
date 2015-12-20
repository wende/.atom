(function() {
  var $, $$$, DEFAULT_HEADING_TEXT, ResultView, View, clickablePaths, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, View = _ref.View;

  clickablePaths = require('./clickable-paths');

  DEFAULT_HEADING_TEXT = 'Mocha test results';

  module.exports = ResultView = (function(_super) {
    __extends(ResultView, _super);

    function ResultView() {
      this.resizeView = __bind(this.resizeView, this);
      return ResultView.__super__.constructor.apply(this, arguments);
    }

    ResultView.content = function() {
      return this.div({
        "class": 'mocha-test-runner'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'panel'
          }, function() {
            _this.div({
              outlet: 'heading',
              "class": 'heading'
            }, function() {
              _this.div({
                "class": 'pull-right'
              }, function() {
                return _this.span({
                  outlet: 'closeButton',
                  "class": 'close-icon'
                });
              });
              return _this.span({
                outlet: 'headingText'
              }, DEFAULT_HEADING_TEXT);
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              return _this.pre({
                outlet: 'results',
                "class": 'results'
              });
            });
          });
        };
      })(this));
    };

    ResultView.prototype.initialize = function(state) {
      var height;
      height = state != null ? state.height : void 0;
      this.openHeight = Math.max(140, state != null ? state.openHeight : void 0, height);
      this.height(height);
      this.heading.on('dblclick', (function(_this) {
        return function() {
          return _this.toggleCollapse();
        };
      })(this));
      this.closeButton.on('click', (function(_this) {
        return function() {
          return atom.commands.dispatch(_this, 'result-view:close');
        };
      })(this));
      this.heading.on('mousedown', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
      this.results.addClass('native-key-bindings');
      this.results.attr('tabindex', -1);
      return clickablePaths.attachClickHandler();
    };

    ResultView.prototype.serialize = function() {
      return {
        height: this.height(),
        openHeight: this.openHeight
      };
    };

    ResultView.prototype.destroy = function() {
      return clickablePaths.removeClickHandler();
    };

    ResultView.prototype.resizeStarted = function(_arg) {
      var pageY;
      pageY = _arg.pageY;
      this.resizeData = {
        pageY: pageY,
        height: this.height()
      };
      $(document.body).on('mousemove', this.resizeView);
      return $(document.body).one('mouseup', this.resizeStopped.bind(this));
    };

    ResultView.prototype.resizeStopped = function() {
      var currentHeight;
      $(document.body).off('mousemove', this.resizeView);
      currentHeight = this.height();
      if (currentHeight > this.heading.outerHeight()) {
        return this.openHeight = currentHeight;
      }
    };

    ResultView.prototype.resizeView = function(_arg) {
      var headingHeight, pageY;
      pageY = _arg.pageY;
      headingHeight = this.heading.outerHeight();
      return this.height(Math.max(this.resizeData.height + this.resizeData.pageY - pageY, headingHeight));
    };

    ResultView.prototype.reset = function() {
      this.heading.removeClass('alert-success alert-danger');
      this.heading.addClass('alert-info');
      this.headingText.html("" + DEFAULT_HEADING_TEXT + "...");
      return this.results.empty();
    };

    ResultView.prototype.updateResultPanelHeight = function() {
      var panelBody;
      panelBody = this.find('.panel-body');
      return panelBody.height(this.height() - this.heading.outerHeight());
    };

    ResultView.prototype.addLine = function(line) {
      if (line !== '\n') {
        return this.results.append(line);
      }
    };

    ResultView.prototype.success = function(stats) {
      this.heading.removeClass('alert-info');
      this.heading.addClass('alert-success');
      return this.updateResultPanelHeight();
    };

    ResultView.prototype.failure = function(stats) {
      this.heading.removeClass('alert-info');
      this.heading.addClass('alert-danger');
      return this.updateResultPanelHeight();
    };

    ResultView.prototype.updateSummary = function(stats) {
      if (!(stats != null ? stats.length : void 0)) {
        return;
      }
      return this.headingText.html("" + DEFAULT_HEADING_TEXT + ": " + (stats.join(', ')));
    };

    ResultView.prototype.toggleCollapse = function() {
      var headingHeight, viewHeight;
      headingHeight = this.heading.outerHeight();
      viewHeight = this.height();
      if (!(headingHeight > 0)) {
        return;
      }
      if (viewHeight > headingHeight) {
        this.openHeight = viewHeight;
        return this.height(headingHeight);
      } else {
        return this.height(this.openHeight);
      }
    };

    return ResultView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9tb2NoYS10ZXN0LXJ1bm5lci9saWIvcmVzdWx0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLHNCQUFSLENBQWpCLEVBQUMsU0FBQSxDQUFELEVBQUksV0FBQSxHQUFKLEVBQVMsWUFBQSxJQUFULENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQURqQixDQUFBOztBQUFBLEVBR0Esb0JBQUEsR0FBdUIsb0JBSHZCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosaUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO09BQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDL0IsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxNQUFBLEVBQVEsU0FBUjtBQUFBLGNBQW1CLE9BQUEsRUFBTyxTQUExQjthQUFMLEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sWUFBUDtlQUFMLEVBQTBCLFNBQUEsR0FBQTt1QkFDeEIsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGtCQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsa0JBQXVCLE9B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

//# sourceURL=/home/iraasta/.atom/packages/mocha-test-runner/lib/result-view.coffee

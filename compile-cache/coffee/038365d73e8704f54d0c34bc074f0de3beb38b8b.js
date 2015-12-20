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

    ResultView.prototype.addLine = function(line) {
      if (line !== '\n') {
        return this.results.append(line);
      }
    };

    ResultView.prototype.success = function(stats) {
      this.heading.removeClass('alert-info');
      return this.heading.addClass('alert-success');
    };

    ResultView.prototype.failure = function(stats) {
      this.heading.removeClass('alert-info');
      return this.heading.addClass('alert-danger');
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

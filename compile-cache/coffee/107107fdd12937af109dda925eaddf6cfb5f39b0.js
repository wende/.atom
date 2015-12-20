(function() {
  var LogLine, LogView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  LogLine = (function(_super) {
    __extends(LogLine, _super);

    function LogLine() {
      return LogLine.__super__.constructor.apply(this, arguments);
    }

    LogLine.content = function(line) {
      return this.pre({
        "class": "" + (line.iserror ? 'error' : '')
      }, line.log);
    };

    return LogLine;

  })(View);

  module.exports = LogView = (function(_super) {
    __extends(LogView, _super);

    function LogView() {
      return LogView.__super__.constructor.apply(this, arguments);
    }

    LogView.content = function() {
      return this.div({
        "class": 'logger'
      });
    };

    LogView.prototype.log = function(log, iserror) {
      this.append(new LogLine({
        iserror: iserror,
        log: log
      }));
      this.scrollToBottom();
    };

    return LogView;

  })(View);

}).call(this);

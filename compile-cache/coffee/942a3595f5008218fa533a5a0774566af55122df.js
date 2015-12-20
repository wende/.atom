(function() {
  var CompositeDisposable, Mark, Point, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point;

  Mark = (function() {
    function Mark(cursor) {
      this.cursor = cursor;
      this.editor = cursor.editor;
      this.marker = this.editor.markBufferPosition(cursor.getBufferPosition());
      this.active = false;
      this.updating = false;
      this.lifetimeSubscription = this.cursor.onDidDestroy((function(_this) {
        return function(event) {
          return _this._destroy();
        };
      })(this));
    }

    Mark.prototype.set = function() {
      this.deactivate();
      this.marker.setHeadBufferPosition(this.cursor.getBufferPosition());
      return this;
    };

    Mark.prototype.getBufferPosition = function() {
      return this.marker.getHeadBufferPosition();
    };

    Mark.prototype.activate = function() {
      if (!this.active) {
        this.activeSubscriptions = new CompositeDisposable;
        this.activeSubscriptions.add(this.cursor.onDidChangePosition((function(_this) {
          return function(event) {
            return _this._updateSelection(event);
          };
        })(this)));
        this.activeSubscriptions.add(this.editor.getBuffer().onDidChange((function(_this) {
          return function(event) {
            if (!(_this._isIndent(event) || _this._isOutdent(event))) {
              return _this.deactivate();
            }
          };
        })(this)));
        return this.active = true;
      }
    };

    Mark.prototype.deactivate = function() {
      if (this.active) {
        this.activeSubscriptions.dispose();
        this.active = false;
      }
      return this.cursor.clearSelection();
    };

    Mark.prototype.isActive = function() {
      return this.active;
    };

    Mark.prototype.exchange = function() {
      var position;
      position = this.marker.getHeadBufferPosition();
      this.set().activate();
      return this.cursor.setBufferPosition(position);
    };

    Mark.prototype._destroy = function() {
      if (this.active) {
        this.deactivate();
      }
      this.marker.destroy();
      this.lifetimeSubscription.dispose();
      return delete this.cursor._atomicEmacsMark;
    };

    Mark.prototype._updateSelection = function(event) {
      var head, tail;
      if (!this.updating) {
        this.updating = true;
        try {
          head = this.cursor.getBufferPosition();
          tail = this.marker.getHeadBufferPosition();
          return this.setSelectionRange(head, tail);
        } finally {
          this.updating = false;
        }
      }
    };

    Mark.prototype.getSelectionRange = function() {
      return this.cursor.selection.getBufferRange();
    };

    Mark.prototype.setSelectionRange = function(head, tail) {
      var reversed;
      reversed = Point.min(head, tail) === head;
      return this.cursor.selection.setBufferRange([head, tail], {
        reversed: reversed
      });
    };

    Mark["for"] = function(cursor) {
      return cursor._atomicEmacsMark != null ? cursor._atomicEmacsMark : cursor._atomicEmacsMark = new Mark(cursor);
    };

    Mark.prototype._isIndent = function(event) {
      return this._isIndentOutdent(event.newRange, event.newText);
    };

    Mark.prototype._isOutdent = function(event) {
      return this._isIndentOutdent(event.oldRange, event.oldText);
    };

    Mark.prototype._isIndentOutdent = function(range, text) {
      var diff, tabLength;
      tabLength = this.editor.getTabLength();
      diff = range.end.column - range.start.column;
      if (diff === this.editor.getTabLength() && range.start.row === range.end.row && this._checkTextForSpaces(text, tabLength)) {
        return true;
      }
    };

    Mark.prototype._checkTextForSpaces = function(text, tabSize) {
      var ch, _i, _len;
      if (!(text && text.length === tabSize)) {
        return false;
      }
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        ch = text[_i];
        if (ch !== " ") {
          return false;
        }
      }
      return true;
    };

    return Mark;

  })();

  module.exports = Mark;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL21hcmsuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsT0FBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBQXRCLENBQUE7O0FBQUEsRUFhTTtBQUNTLElBQUEsY0FBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQU0sQ0FBQyxNQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBMkIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBM0IsQ0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBSFYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUpaLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUFXLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBWDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBTHhCLENBRFc7SUFBQSxDQUFiOztBQUFBLG1CQVFBLEdBQUEsR0FBSyxTQUFBLEdBQUE7QUFDSCxNQUFBLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQThCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQSxDQUE5QixDQURBLENBQUE7YUFFQSxLQUhHO0lBQUEsQ0FSTCxDQUFBOztBQUFBLG1CQWFBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUNqQixJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsRUFEaUI7SUFBQSxDQWJuQixDQUFBOztBQUFBLG1CQWdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFHLENBQUEsSUFBSyxDQUFBLE1BQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixHQUFBLENBQUEsbUJBQXZCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixJQUFDLENBQUEsTUFBTSxDQUFDLG1CQUFSLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7bUJBQ25ELEtBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFsQixFQURtRDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQXpCLENBREEsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLG1CQUFtQixDQUFDLEdBQXJCLENBQXlCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUN2RCxZQUFBLElBQUEsQ0FBQSxDQUFPLEtBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxDQUFBLElBQXFCLEtBQUMsQ0FBQSxVQUFELENBQVksS0FBWixDQUE1QixDQUFBO3FCQUNFLEtBQUMsQ0FBQSxVQUFELENBQUEsRUFERjthQUR1RDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBQXpCLENBSEEsQ0FBQTtlQU1BLElBQUMsQ0FBQSxNQUFELEdBQVUsS0FQWjtPQURRO0lBQUEsQ0FoQlYsQ0FBQTs7QUFBQSxtQkEwQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBRyxJQUFDLENBQUEsTUFBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLG1CQUFtQixDQUFDLE9BQXJCLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLEtBRFYsQ0FERjtPQUFBO2FBR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQUEsRUFKVTtJQUFBLENBMUJaLENBQUE7O0FBQUEsbUJBZ0NBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsT0FETztJQUFBLENBaENWLENBQUE7O0FBQUEsbUJBbUNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLHFCQUFSLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsR0FBRCxDQUFBLENBQU0sQ0FBQyxRQUFQLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixRQUExQixFQUhRO0lBQUEsQ0FuQ1YsQ0FBQTs7QUFBQSxtQkF3Q0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBaUIsSUFBQyxDQUFBLE1BQWxCO0FBQUEsUUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxvQkFBb0IsQ0FBQyxPQUF0QixDQUFBLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBQSxJQUFRLENBQUEsTUFBTSxDQUFDLGlCQUpQO0lBQUEsQ0F4Q1YsQ0FBQTs7QUFBQSxtQkE4Q0EsZ0JBQUEsR0FBa0IsU0FBQyxLQUFELEdBQUE7QUFHaEIsVUFBQSxVQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsSUFBRSxDQUFBLFFBQUw7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUFBO0FBQ0E7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQUEsQ0FBUCxDQUFBO0FBQUEsVUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxxQkFBUixDQUFBLENBRFAsQ0FBQTtpQkFFQSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFIRjtTQUFBO0FBS0UsVUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FMRjtTQUZGO09BSGdCO0lBQUEsQ0E5Q2xCLENBQUE7O0FBQUEsbUJBMERBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTthQUNqQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFsQixDQUFBLEVBRGlCO0lBQUEsQ0ExRG5CLENBQUE7O0FBQUEsbUJBNkRBLGlCQUFBLEdBQW1CLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNqQixVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxLQUFLLENBQUMsR0FBTixDQUFVLElBQVYsRUFBZ0IsSUFBaEIsQ0FBQSxLQUF5QixJQUFwQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBbEIsQ0FBaUMsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQUFqQyxFQUErQztBQUFBLFFBQUEsUUFBQSxFQUFVLFFBQVY7T0FBL0MsRUFGaUI7SUFBQSxDQTdEbkIsQ0FBQTs7QUFBQSxJQWlFQSxJQUFJLENBQUMsS0FBRCxDQUFKLEdBQVcsU0FBQyxNQUFELEdBQUE7K0NBQ1YsTUFBTSxDQUFDLG1CQUFQLE1BQU0sQ0FBQyxtQkFBd0IsSUFBQSxJQUFBLENBQUssTUFBTCxFQURyQjtJQUFBLENBakVYLENBQUE7O0FBQUEsbUJBb0VBLFNBQUEsR0FBVyxTQUFDLEtBQUQsR0FBQTthQUNULElBQUMsQ0FBQSxnQkFBRCxDQUFrQixLQUFLLENBQUMsUUFBeEIsRUFBa0MsS0FBSyxDQUFDLE9BQXhDLEVBRFM7SUFBQSxDQXBFWCxDQUFBOztBQUFBLG1CQXVFQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7YUFDVixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBSyxDQUFDLFFBQXhCLEVBQWtDLEtBQUssQ0FBQyxPQUF4QyxFQURVO0lBQUEsQ0F2RVosQ0FBQTs7QUFBQSxtQkEwRUEsZ0JBQUEsR0FBa0IsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ2hCLFVBQUEsZUFBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBVixHQUFtQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BRHRDLENBQUE7QUFFQSxNQUFBLElBQVEsSUFBQSxLQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFBLENBQVIsSUFBbUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFaLEtBQW1CLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBaEUsSUFBd0UsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQXJCLEVBQTJCLFNBQTNCLENBQWhGO2VBQUEsS0FBQTtPQUhnQjtJQUFBLENBMUVsQixDQUFBOztBQUFBLG1CQStFQSxtQkFBQSxHQUFxQixTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDbkIsVUFBQSxZQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBb0IsSUFBQSxJQUFTLElBQUksQ0FBQyxNQUFMLEtBQWUsT0FBNUMsQ0FBQTtBQUFBLGVBQU8sS0FBUCxDQUFBO09BQUE7QUFFQSxXQUFBLDJDQUFBO3NCQUFBO0FBQ0UsUUFBQSxJQUFvQixFQUFBLEtBQU0sR0FBMUI7QUFBQSxpQkFBTyxLQUFQLENBQUE7U0FERjtBQUFBLE9BRkE7YUFJQSxLQUxtQjtJQUFBLENBL0VyQixDQUFBOztnQkFBQTs7TUFkRixDQUFBOztBQUFBLEVBb0dBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBcEdqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/lib/mark.coffee

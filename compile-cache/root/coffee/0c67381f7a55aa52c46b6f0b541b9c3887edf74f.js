(function() {
  var Commands, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.messages = null;
    }

    Commands.prototype.toggleLinter = function() {
      var _ref;
      return (_ref = this.linter.getActiveEditorLinter()) != null ? _ref.toggleStatus() : void 0;
    };

    Commands.prototype.setBubbleTransparent = function() {
      return this.linter.views.setBubbleTransparent();
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, _ref;
      try {
        if ((_ref = this.linter.getActiveEditorLinter()) != null) {
          _ref.lint(false);
        }
        return this.linter.views.render();
      } catch (_error) {
        error = _error;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.nextError = function() {
      var message, next;
      if (!this.messages || (next = this.messages.next()).done) {
        next = (this.messages = this.linter.views.getMessages().values()).next();
      }
      if (next.done) {
        return;
      }
      message = next.value;
      if (!message.filePath) {
        return;
      }
      if (!message.range) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.destroy = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFTTtBQUNTLElBQUEsa0JBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLG1CQUFBLEVBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO0FBQUEsUUFDQSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGpCO0FBQUEsUUFFQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsb0JBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGakM7QUFBQSxRQUdBLGtDQUFBLEVBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSx1QkFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhwQztBQUFBLFFBSUEsYUFBQSxFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmY7T0FEaUIsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBVFosQ0FEVztJQUFBLENBQWI7O0FBQUEsdUJBWUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsSUFBQTt3RUFBK0IsQ0FBRSxZQUFqQyxDQUFBLFdBRFk7SUFBQSxDQVpkLENBQUE7O0FBQUEsdUJBZUEsb0JBQUEsR0FBc0IsU0FBQSxHQUFBO2FBQ3BCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFkLENBQUEsRUFEb0I7SUFBQSxDQWZ0QixDQUFBOztBQUFBLHVCQWtCQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxvQkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTt3QkFBQTtBQUNFLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFmLENBQW1CLFVBQW5CLENBQUEsQ0FERjtBQUFBLE9BQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxJQUFDLENBQUEseUJBQXBDLENBRkEsQ0FBQTthQUdBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxJQUFDLENBQUEseUJBQWpDLEVBSnVCO0lBQUEsQ0FsQnpCLENBQUE7O0FBQUEsdUJBd0JBLHlCQUFBLEdBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLG9CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsQ0FBc0IsVUFBdEIsQ0FBQSxDQURGO0FBQUEsT0FBQTtBQUFBLE1BRUEsUUFBUSxDQUFDLG1CQUFULENBQTZCLE9BQTdCLEVBQXNDLElBQUMsQ0FBQSx5QkFBdkMsQ0FGQSxDQUFBO2FBR0EsTUFBTSxDQUFDLG1CQUFQLENBQTJCLE1BQTNCLEVBQW1DLElBQUMsQ0FBQSx5QkFBcEMsRUFKeUI7SUFBQSxDQXhCM0IsQ0FBQTs7QUFBQSx1QkE4QkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsV0FBQTtBQUFBOztjQUNpQyxDQUFFLElBQWpDLENBQXNDLEtBQXRDO1NBQUE7ZUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFkLENBQUEsRUFGRjtPQUFBLGNBQUE7QUFLRSxRQURJLGNBQ0osQ0FBQTtlQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsS0FBSyxDQUFDLE9BQWxDLEVBQTJDO0FBQUEsVUFBQyxNQUFBLEVBQVEsS0FBSyxDQUFDLEtBQWY7QUFBQSxVQUFzQixXQUFBLEVBQWEsSUFBbkM7U0FBM0MsRUFMRjtPQURJO0lBQUEsQ0E5Qk4sQ0FBQTs7QUFBQSx1QkFzQ0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLElBQUssQ0FBQSxRQUFMLElBQWlCLENBQUMsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFBLENBQVIsQ0FBeUIsQ0FBQyxJQUE5QztBQUNFLFFBQUEsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFkLENBQUEsQ0FBMkIsQ0FBQyxNQUE1QixDQUFBLENBQWIsQ0FBa0QsQ0FBQyxJQUFuRCxDQUFBLENBQVAsQ0FERjtPQUFBO0FBRUEsTUFBQSxJQUFVLElBQUksQ0FBQyxJQUFmO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFBQSxNQUdBLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FIZixDQUFBO0FBSUEsTUFBQSxJQUFBLENBQUEsT0FBcUIsQ0FBQyxRQUF0QjtBQUFBLGNBQUEsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFBLENBQUEsT0FBcUIsQ0FBQyxLQUF0QjtBQUFBLGNBQUEsQ0FBQTtPQUxBO2FBTUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE9BQU8sQ0FBQyxRQUE1QixDQUFxQyxDQUFDLElBQXRDLENBQTJDLFNBQUEsR0FBQTtlQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyx1QkFBckMsQ0FBNkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUEzRSxFQUR5QztNQUFBLENBQTNDLEVBUFM7SUFBQSxDQXRDWCxDQUFBOztBQUFBLHVCQWdEQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQVosQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRk87SUFBQSxDQWhEVCxDQUFBOztvQkFBQTs7TUFIRixDQUFBOztBQUFBLEVBdURBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBdkRqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/commands.coffee
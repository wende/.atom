(function() {
  var Multiline, MultilineElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Multiline = (function(_super) {
    __extends(Multiline, _super);

    function Multiline() {
      return Multiline.__super__.constructor.apply(this, arguments);
    }

    Multiline.prototype.attachedCallback = function() {
      var el, line, _i, _len, _ref, _results;
      this.tabIndex = 0;
      _ref = this.text.split(/\n/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line) {
          el = document.createElement('linter-message-line');
          el.textContent = line;
          _results.push(this.appendChild(el));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Multiline.prototype.setText = function(text) {
      this.text = text;
      return this;
    };

    Multiline.fromText = function(text) {
      return new MultilineElement().setText(text);
    };

    return Multiline;

  })(HTMLElement);

  module.exports = MultilineElement = document.registerElement('linter-multiline-message', {
    prototype: Multiline.prototype
  });

  module.exports.fromText = Multiline.fromText;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx3QkFBQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFaLENBQUE7QUFDQTtBQUFBO1dBQUEsMkNBQUE7d0JBQUE7QUFDRSxRQUFBLElBQUcsSUFBSDtBQUNFLFVBQUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxhQUFULENBQXVCLHFCQUF2QixDQUFMLENBQUE7QUFBQSxVQUNBLEVBQUUsQ0FBQyxXQUFILEdBQWlCLElBRGpCLENBQUE7QUFBQSx3QkFFQSxJQUFDLENBQUEsV0FBRCxDQUFhLEVBQWIsRUFGQSxDQURGO1NBQUEsTUFBQTtnQ0FBQTtTQURGO0FBQUE7c0JBRmdCO0lBQUEsQ0FBbEIsQ0FBQTs7QUFBQSx3QkFRQSxPQUFBLEdBQVMsU0FBRSxJQUFGLEdBQUE7QUFBVyxNQUFWLElBQUMsQ0FBQSxPQUFBLElBQVMsQ0FBQTthQUFBLEtBQVg7SUFBQSxDQVJULENBQUE7O0FBQUEsSUFVQSxTQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsSUFBRCxHQUFBO2FBQ0wsSUFBQSxnQkFBQSxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsSUFBM0IsRUFESztJQUFBLENBVlgsQ0FBQTs7cUJBQUE7O0tBRHNCLFlBQXhCLENBQUE7O0FBQUEsRUFjQSxNQUFNLENBQUMsT0FBUCxHQUFpQixnQkFBQSxHQUNmLFFBQVEsQ0FBQyxlQUFULENBQXlCLDBCQUF6QixFQUFxRDtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQVMsQ0FBQyxTQUFyQjtHQUFyRCxDQWZGLENBQUE7O0FBQUEsRUFnQkEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFmLEdBQTBCLFNBQVMsQ0FBQyxRQWhCcEMsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/views/multiline.coffee
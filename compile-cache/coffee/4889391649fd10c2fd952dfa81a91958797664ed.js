(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-erlang-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-erlang-erlangprovider';

    RsenseProvider.prototype.selector = '.source.erlang';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = options.cursor.getBufferRow() + 1;
          col = options.cursor.getBufferColumn() + 1;
          return completions = _this.rsenseClient.checkCompletion(options.editor, options.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(options.prefix, completions);
            if (!(suggestions != null ? suggestions.length : void 0)) {
              return resolve();
            }
            return resolve(suggestions);
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, kind, suggestion, suggestions, _i, _len;
      console.log(prefix);
      console.log(completions);
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          kind = completion.kind.toLowerCase();
          suggestion = {
            snippet: "" + completion.name + "(${1:label}) prefix: prefix label: "
          };
          suggestions.push(suggestion);
        }
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.dispose = function() {};

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQU9BLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUVqQixjQUFBLHFCQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBQSxHQUFnQyxDQUF0QyxDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FBQSxHQUFtQyxDQUR6QyxDQUFBO2lCQUVBLFdBQUEsR0FBYyxLQUFDLENBQUEsWUFBWSxDQUFDLGVBQWQsQ0FBOEIsT0FBTyxDQUFDLE1BQXRDLEVBQ2QsT0FBTyxDQUFDLE1BRE0sRUFDRSxHQURGLEVBQ08sR0FEUCxFQUNZLFNBQUMsV0FBRCxHQUFBO0FBQ3hCLGdCQUFBLFdBQUE7QUFBQSxZQUFBLFdBQUEsR0FBYyxLQUFDLENBQUEsZUFBRCxDQUFpQixPQUFPLENBQUMsTUFBekIsRUFBaUMsV0FBakMsQ0FBZCxDQUFBO0FBQ0EsWUFBQSxJQUFBLENBQUEsdUJBQXdCLFdBQVcsQ0FBRSxnQkFBckM7QUFBQSxxQkFBTyxPQUFBLENBQUEsQ0FBUCxDQUFBO2FBREE7QUFFQSxtQkFBTyxPQUFBLENBQVEsV0FBUixDQUFQLENBSHdCO1VBQUEsQ0FEWixFQUpHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixDQUFYLENBRGM7SUFBQSxDQVBoQixDQUFBOztBQUFBLDZCQW1CQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFdBQVQsR0FBQTtBQUNmLFVBQUEsbURBQUE7QUFBQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixDQUFBLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksV0FBWixDQURBLENBQUE7QUFFQSxNQUFBLElBQUcsbUJBQUg7QUFDRSxRQUFBLFdBQUEsR0FBYyxFQUFkLENBQUE7QUFDQSxhQUFBLGtEQUFBO3VDQUFBO2dCQUFtQyxVQUFVLENBQUMsSUFBWCxLQUFxQjs7V0FDdEQ7QUFBQSxVQUFBLElBQUEsR0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQWhCLENBQUEsQ0FBUCxDQUFBO0FBQUEsVUFDQSxVQUFBLEdBQ0U7QUFBQSxZQUFBLE9BQUEsRUFBUyxFQUFBLEdBQUcsVUFBVSxDQUFDLElBQWQsR0FBbUIscUNBQTVCO1dBRkYsQ0FBQTtBQUFBLFVBS0EsV0FBVyxDQUFDLElBQVosQ0FBaUIsVUFBakIsQ0FMQSxDQURGO0FBQUEsU0FEQTtBQVFBLGVBQU8sV0FBUCxDQVRGO09BRkE7QUFZQSxhQUFPLEVBQVAsQ0FiZTtJQUFBLENBbkJqQixDQUFBOztBQUFBLDZCQWtDQSxPQUFBLEdBQVMsU0FBQSxHQUFBLENBbENULENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-provider.coffee
(function() {
  var RsenseClient, RsenseProvider,
    __slice = [].slice;

  RsenseClient = require('./autocomplete-elixir-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-elixir-elixirprovider';

    RsenseProvider.prototype.selector = '.source.elixir';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, matcher, prefix, row;
          row = options.cursor.getBufferRow();
          col = options.cursor.getBufferColumn();
          prefix = options.editor.getTextInBufferRange([[row, 0], [row, col]]);
          matcher = /\S*(\w|:|\.)$/.exec(prefix);
          if (!matcher) {
            resolve([]);
          }
          prefix = matcher[0];
          options.prefix = prefix;
          return completions = _this.rsenseClient.checkCompletion(options.editor, options.buffer, row, col, options.prefix, function(completions) {
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
      var completion, count, first, i, kind, last, suggestion, suggestions, word, _i, _j, _len, _ref, _ref1;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          kind = completion.kind.toLowerCase();
          word = completion.name;
          count = parseInt(/\d*$/.exec(word)) || 0;
          if (count) {
            word = word.split("/")[0] + "(";
            i = 0;
            while (++i <= count) {
              word += ("${" + i + ":" + i + "}") + (i !== count ? "," : ")");
            }
            word += "${" + (count + 1) + ":_}";
          }
          _ref = prefix.split(/(:|\.)/), last = _ref[_ref.length - 1];
          _ref1 = prefix.split("."), first = 2 <= _ref1.length ? __slice.call(_ref1, 0, _j = _ref1.length - 1) : (_j = 0, []), last = _ref1[_j++];
          console.log("prefix:" + prefix);
          console.log("word:" + completion.name);
          console.log("first:" + first);
          suggestion = {
            snippet: word,
            prefix: completions.length === 1 ? last : first.join("."),
            label: "" + completion.qualified_name
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFDQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxFQUFBLEdBQUksb0NBQUosQ0FBQTs7QUFBQSw2QkFDQSxRQUFBLEdBQVUsZ0JBRFYsQ0FBQTs7QUFBQSw2QkFFQSxZQUFBLEdBQWMsSUFGZCxDQUFBOztBQUlhLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQUEsQ0FBcEIsQ0FEVztJQUFBLENBSmI7O0FBQUEsNkJBUUEsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBQ2pCLGNBQUEsc0NBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQWYsQ0FBQSxDQUFOLENBQUE7QUFBQSxVQUNBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWYsQ0FBQSxDQUROLENBQUE7QUFBQSxVQUdBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFmLENBQW9DLENBQUMsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFELEVBQVUsQ0FBQyxHQUFELEVBQU0sR0FBTixDQUFWLENBQXBDLENBSFQsQ0FBQTtBQUFBLFVBSUEsT0FBQSxHQUFVLGVBQWUsQ0FBQyxJQUFoQixDQUFxQixNQUFyQixDQUpWLENBQUE7QUFLQSxVQUFBLElBQUEsQ0FBQSxPQUFBO0FBQW9CLFlBQUEsT0FBQSxDQUFRLEVBQVIsQ0FBQSxDQUFwQjtXQUxBO0FB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee
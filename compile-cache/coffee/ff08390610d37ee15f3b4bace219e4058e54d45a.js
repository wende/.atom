(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-elixir-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-elixir-elixirprovider';

    RsenseProvider.prototype.selector = '.source.elixir';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.getSuggestions = function(request) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, npref, postfix, prefix, row, _ref;
          row = request.bufferPosition.row;
          col = request.bufferPosition.column;
          prefix = request.editor.getTextInBufferRange([[row, 0], [row, col]]);
          _ref = prefix.split(/[ ()]/), prefix = _ref[_ref.length - 1];
          if (!prefix) {
            resolve([]);
          }
          npref = /.*\./.exec(prefix);
          postfix = "";
          if (npref) {
            postfix = prefix.replace(npref[0], "");
            prefix = npref[0];
          }
          return completions = _this.rsenseClient.checkCompletion(prefix, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(prefix, postfix, completions);
            if (!(suggestions != null ? suggestions.length : void 0)) {
              return resolve();
            }
            return resolve(suggestions);
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, postfix, completions) {
      var argTypes, args, completion, count, func, i, inserted, isModule, label, last, one, ret, spec, specs, suggestion, suggestions, types, word, _, _i, _len, _ref, _ref1, _ref2, _ref3;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!((completion.name !== prefix + postfix) && (completion.name.indexOf(postfix) === 0))) {
            continue;
          }
          one = completion.continuation;
          _ref = completion.name.trim().split("@"), word = _ref[0], spec = _ref[1];
          argTypes = null;
          ret = null;
          if (!word || !word[0]) {
            continue;
          }
          if (word[0] === word[0].toUpperCase()) {
            _ref1 = ["Module", true], ret = _ref1[0], isModule = _ref1[1];
          }
          label = completion.spec;
          if (spec) {
            specs = spec.replace(/^[\w!?]+/, "");
            types = specs.substring(1, specs.length - 1).split(",");
            label = specs;
            _ref2 = specs.match(/\(?(.+)\)\s*::\s*(.*)/), _ = _ref2[0], args = _ref2[1], ret = _ref2[2];
            argTypes = args.split(",");
          }
          count = parseInt(/\d+$/.exec(word)) || 0;
          func = /\d+$/.test(word);
          if (func) {
            word = word.split("/")[0] + "(";
          }
          inserted = word;
          i = 0;
          while (++i <= count) {
            if (argTypes) {
              word += ("${" + i + ":" + argTypes[i - 1] + "}") + (i !== count ? "," : "");
            } else {
              word += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
            }
            inserted += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
          }
          if (func) {
            word += ")${" + (count + 1) + ":\u0020}";
            inserted += ")${" + (count + 1) + ":\u0020}";
          }
          _ref3 = (prefix + postfix).split("."), last = _ref3[_ref3.length - 1];
          suggestion = {
            snippet: one ? prefix + postfix + word : word,
            displayText: one ? prefix + postfix + word : word,
            prefix: one ? prefix + postfix : last,
            label: ret ? ret : "any",
            type: module ? "method" : (func ? "function" : void 0, "variable"),
            description: spec || ret || "Desc"
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQVFBLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNqQixjQUFBLG1EQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUE3QixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUQ3QixDQUFBO0FBQUEsVUFHQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBRCxFQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBVixDQUFwQyxDQUhULENBQUE7QUFBQSxVQUlBLE9BQWlCLE1BQU0sQ0FBQyxLQUFQLENBQWEsT0FBYixDQUFqQixFQUFPLDhCQUpQLENBQUE7QUFLQSxVQUFBLElBQUEsQ0FBQSxNQUFBO0FBQW1CLFlBQUEsT0FBQSxDQUFRLEVBQVIsQ0FBQSxDQUFuQjtXQUxBO0FBQUEsVUFPQSxLQUFBLEdBQVEsTUFBTSxD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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee
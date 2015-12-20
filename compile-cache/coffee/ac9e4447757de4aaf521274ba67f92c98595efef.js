(function() {
  var IS_ELIXIR, RsenseClient, RsenseProvider, lang;

  IS_ELIXIR = false;

  lang = IS_ELIXIR ? "elixir" : "erlang";

  RsenseClient = require("./autocomplete-" + lang + "-client.coffee");

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.selector = ".source." + lang;

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
      var argTypes, args, completion, count, func, i, inserted, isModule, label, last, one, ret, spec, specs, suggestion, suggestions, type, types, word, _, _i, _len, _ref, _ref1, _ref2, _ref3;
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
          console.log(word);
          console.log(word[0]);
          console.log("is mod " + isModule);
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
          console.log("is function " + func);
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
          _ref3 = (prefix + postfix).split(IS_ELIXIR ? "." : ":"), last = _ref3[_ref3.length - 1];
          type = "variable";
          if (isModule) {
            type = "method";
          }
          if (func) {
            type = "function";
          }
          suggestion = {
            snippet: one ? prefix + postfix + word : word,
            displayText: one ? prefix + postfix + word : word,
            prefix: one ? prefix + postfix : last,
            label: ret ? ret : "any",
            type: type,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLEtBQVosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBVSxTQUFILEdBQWtCLFFBQWxCLEdBQWdDLFFBRnZDLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFTLGlCQUFBLEdBQWlCLElBQWpCLEdBQXNCLGdCQUEvQixDQUpmLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsUUFBQSxHQUFXLFVBQUEsR0FBVSxJQUFyQixDQUFBOztBQUFBLDZCQUNBLFlBQUEsR0FBYyxJQURkLENBQUE7O0FBR2EsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLFlBQUEsQ0FBQSxDQUFwQixDQURXO0lBQUEsQ0FIYjs7QUFBQSw2QkFNQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsYUFBVyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDakIsY0FBQSxtREFBQTtBQUFBLFVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBN0IsQ0FBQTtBQUFBLFVBQ0EsR0FBQSxHQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFEN0IsQ0FBQTtBQUFBLFVBR0EsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQyxDQUFDLEdBQUQsRUFBTSxDQUFOLENBQUQsRUFBVSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQVYsQ0FBcEMsQ0FIVCxDQUFBO0FBQUEsVUFJQSxPQUFpQixNQUFNLENBQUMsS0FBUCxDQUFhLE9BQWIsQ0FBakIsRUFBTyw4QkFKUCxDQUFBO0FBS0Es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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang-2.0/lib/autocomplete-erlang-provider.coffee
(function() {
  var IS_ELIXIR, RsenseClient, RsenseProvider, lang;

  IS_ELIXIR = true;

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
            replacementPrefix: one ? prefix + postfix : last,
            rightLabel: ret ? ret : "any",
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUU7QUFBQSxNQUFBLDZDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBVSxTQUFILEdBQWtCLFFBQWxCLEdBQWdDLFFBRnZDLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFTLGlCQUFBLEdBQWlCLElBQWpCLEdBQXNCLGdCQUEvQixDQUpmLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsUUFBQSxHQUFXLFVBQUEsR0FBVSxJQUFyQixDQUFBOztBQUFBLDZCQUNBLFlBQUEsR0FBYyxJQURkLENBQUE7O0FBR2EsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLFlBQUEsQ0FBQSxDQUFwQixDQURXO0lBQUEsQ0FIYjs7QUFBQSw2QkFNQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsYUFBVyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFDakIsY0FBQSxtREFBQTtBQUFBLFVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBN0IsQ0FBQTtBQUFBLFVBQ0EsR0FBQSxHQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFEN0IsQ0FBQTtBQUFBLFVBR0EsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQyxDQUFDLEdBQUQsRUFBTSxDQUFOLENBQUQsRUFBVSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBQVYsQ0FBcEMsQ0FIVCxDQUFBO0FBQUEsVUFJQSxPQUFpQixNQUFNLENBQUMsS0FBUCxDQUFhLE9BQWIsQ0FBakIsRUFBTyw4QkFKUCxDQUFBO0FBS0EsVUFBQSxJQUFBLENBQUEsTUFBQTtBQUFtQixZQUFBLE9BQUEsQ0FBUSxFQUFSLENBQUEsQ0FBbkI7V0FMQTtBQUFBLFVBT0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQVBSLENBQUE7QUFBQSxVQVFBLE9BQUEsR0FBVSxFQVJWLENBQUE7QUFTQSxVQUFBLElBQUcsS0FBSDtBQUNFLFlBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBTSxDQUFBLENBQUEsQ0FBckIsRUFBeUIsRUFBekIsQ0FBVixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsS0FBTSxDQUFBLENBQUEsQ0FEZixDQURGO1dBVEE7aUJBYUEsV0FBQSxHQUFjLEtBQUMsQ0FBQSxZQUFZLENBQUMsZUFBZCxDQUE4QixNQUE5QixFQUFzQyxTQUFDLFdBQUQsR0FBQTtBQUNsRCxnQkFBQSxXQUFBO0FBQUEsWUFBQSxXQUFBLEdBQWMsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsTUFBakIsRUFBeUIsT0FBekIsRUFBbUMsV0FBbkMsQ0FBZCxDQUFBO0FBQ0EsWUFBQSxJQUFBLENBQUEsdUJBQXdCLFdBQVcsQ0FBRSxnQkFBckM7QUFBQSxxQkFBTyxPQUFBLENBQUEsQ0FBUCxDQUFBO2FBREE7QUFFQSxtQkFBTyxPQUFBLENBQVEsV0FBUixDQUFQLENBSGtEO1VBQUEsQ0FBdEMsRUFkRztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsQ0FBWCxDQURjO0lBQUEsQ0FOaEIsQ0FBQTs7QUFBQSw2QkEyQkEsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFdBQWxCLEdBQUE7QUFDZixVQUFBLHNMQUFBO0FBQUEsTUFBQSxJQUFHLG1CQUFIO0FBQ0UsUUFBQSxXQUFBLEdBQWMsRUFBZCxDQUFBO0FBQ0EsYUFBQSxrREFBQTt1Q0FBQTtnQkFBbUMsQ0FBQyxVQUFVLENBQUMsSUFBWCxLQUFxQixNQUFBLEdBQU8sT0FBN0IsQ0FBQSxJQUEwQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBaEIsQ0FBd0IsT0FBeEIsQ0FBQSxLQUFvQyxDQUFyQzs7V0FFM0U7QUFBQSxVQUFBLEdBQUEsR0FBTSxVQUFVLENBQUMsWUFBakIsQ0FBQTtBQUFBLFVBQ0EsT0FBZSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQWhCLENBQUEsQ0FBc0IsQ0FBQyxLQUF2QixDQUE2QixHQUE3QixDQUFmLEVBQUMsY0FBRCxFQUFPLGNBRFAsQ0FBQTtBQUFBLFVBRUEsUUFBQSxHQUFXLElBRlgsQ0FBQTtBQUFBLFVBR0EsR0FBQSxHQUFNLElBSE4sQ0FBQTtBQUlBLFVBQUEsSUFBRyxDQUFBLElBQUEsSUFBUyxDQUFBLElBQU0sQ0FBQSxDQUFBLENBQWxCO0FBQTBCLHFCQUExQjtXQUpBO0FBS0EsVUFBQSxJQUFHLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBUixDQUFBLENBQWQ7QUFBeUMsWUFBQSxRQUFpQixDQUFDLFFBQUQsRUFBVSxJQUFWLENBQWpCLEVBQUMsY0FBRCxFQUFLLG1CQUFMLENBQXpDO1dBTEE7QUFBQSxVQU1BLEtBQUEsR0FBUSxVQUFVLENBQUMsSUFObkIsQ0FBQTtBQU9BLFVBQUEsSUFBRyxJQUFIO0FBQ0UsWUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLEVBQXdCLEVBQXhCLENBQVIsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQWEsQ0FBL0IsQ0FBaUMsQ0FBQyxLQUFsQyxDQUF3QyxHQUF4QyxDQURSLENBQUE7QUFBQSxZQUVBLEtBQUEsR0FBUSxLQUZSLENBQUE7QUFBQSxZQUdBLFFBQWlCLEtBQUssQ0FBQyxLQUFOLENBQVksdUJBQVosQ0FBakIsRUFBQyxZQUFELEVBQUksZUFBSixFQUFVLGNBSFYsQ0FBQTtBQUFBLFlBS0EsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUxYLENBREY7V0FQQTtBQUFBLFVBY0EsS0FBQSxHQUFRLFFBQUEsQ0FBUyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBVCxDQUFBLElBQStCLENBZHZDLENBQUE7QUFBQSxVQWVBLElBQUEsR0FBTyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FmUCxDQUFBO0FBZ0JBLFVBQUEsSUFBRyxJQUFIO0FBQWEsWUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQWdCLENBQUEsQ0FBQSxDQUFoQixHQUFxQixHQUE1QixDQUFiO1dBaEJBO0FBQUEsVUFpQkEsUUFBQSxHQUFXLElBakJYLENBQUE7QUFBQSxVQWtCQSxDQUFBLEdBQUksQ0FsQkosQ0FBQTtBQW1CQSxpQkFBTSxFQUFBLENBQUEsSUFBTyxLQUFiLEdBQUE7QUFDRSxZQUFBLElBQUcsUUFBSDtBQUFpQixjQUFBLElBQUEsSUFBUSxDQUFDLElBQUEsR0FBSSxDQUFKLEdBQU0sR0FBTixHQUFTLFFBQVMsQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUFsQixHQUF1QixHQUF4QixDQUFBLEdBQTZCLENBQUksQ0FBQSxLQUFLLEtBQVIsR0FBbUIsR0FBbkIsR0FBNEIsRUFBN0IsQ0FBckMsQ0FBakI7YUFBQSxNQUFBO0FBQ0ssY0FBQSxJQUFBLElBQVMsQ0FBQyxJQUFBLEdBQUksQ0FBSixHQUFNLEdBQU4sR0FBUyxDQUFULEdBQVcsR0FBWixDQUFBLEdBQWlCLENBQUksQ0FBQSxLQUFLLEtBQVIsR0FBbUIsR0FBbkIsR0FBNEIsRUFBN0IsQ0FBMUIsQ0FETDthQUFBO0FBQUEsWUFFQSxRQUFBLElBQVksQ0FBQyxJQUFBLEdBQUksQ0FBSixHQUFNLEdBQU4sR0FBUyxDQUFULEdBQVcsR0FBWixDQUFBLEdBQWlCLENBQUksQ0FBQSxLQUFLLEtBQVIsR0FBbUIsR0FBbkIsR0FBNEIsRUFBN0IsQ0FGN0IsQ0FERjtVQUFBLENBbkJBO0FBeUJBLFVBQUEsSUFBRyxJQUFIO0FBQ0UsWUFBQSxJQUFBLElBQVMsS0FBQSxHQUFJLENBQUMsS0FBQSxHQUFNLENBQVAsQ0FBSixHQUFhLFVBQXRCLENBQUE7QUFBQSxZQUNBLFFBQUEsSUFBYSxLQUFBLEdBQUksQ0FBQyxLQUFBLEdBQU0sQ0FBUCxDQUFKLEdBQWEsVUFEMUIsQ0FERjtXQXpCQTtBQUFBLFVBNEJBLFFBQWMsQ0FBQyxNQUFBLEdBQVMsT0FBVixDQUFrQixDQUFDLEtBQW5CLENBQTRCLFNBQUgsR0FBa0IsR0FBbEIsR0FBMkIsR0FBcEQsQ0FBZCxFQUFNLDhCQTVCTixDQUFBO0FBQUEsVUE4QkEsSUFBQSxHQUFPLFVBOUJQLENBQUE7QUErQkEsVUFBQSxJQUFHLFFBQUg7QUFBaUIsWUFBQSxJQUFBLEdBQU8sUUFBUCxDQUFqQjtXQS9CQTtBQWdDQSxVQUFBLElBQUcsSUFBSDtBQUFpQixZQUFBLElBQUEsR0FBTyxVQUFQLENBQWpCO1dBaENBO0FBQUEsVUFrQ0EsVUFBQSxHQUNFO0FBQUEsWUFBQSxPQUFBLEVBQWEsR0FBSCxHQUFZLE1BQUEsR0FBUyxPQUFULEdBQW1CLElBQS9CLEdBQXlDLElBQW5EO0FBQUEsWUFDQSxXQUFBLEVBQWlCLEdBQUgsR0FBWSxNQUFBLEdBQVMsT0FBVCxHQUFtQixJQUEvQixHQUF5QyxJQUR2RDtBQUFBLFlBRUEsaUJBQUEsRUFBdUIsR0FBSCxHQUFZLE1BQUEsR0FBUyxPQUFyQixHQUFrQyxJQUZ0RDtBQUFBLFlBR0EsVUFBQSxFQUFlLEdBQUgsR0FBWSxHQUFaLEdBQXFCLEtBSGpDO0FBQUEsWUFJQSxJQUFBLEVBQU0sSUFKTjtBQUFBLFlBS0EsV0FBQSxFQUFhLElBQUEsSUFBUSxHQUFSLElBQWUsTUFMNUI7V0FuQ0YsQ0FBQTtBQUFBLFVBMkNBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFVBQWpCLENBM0NBLENBRkY7QUFBQSxTQURBO0FBK0NBLGVBQU8sV0FBUCxDQWhERjtPQUFBO0FBaURBLGFBQU8sRUFBUCxDQWxEZTtJQUFBLENBM0JqQixDQUFBOztBQUFBLDZCQStFQSxPQUFBLEdBQVMsU0FBQSxHQUFBLENBL0VULENBQUE7OzBCQUFBOztNQVRGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee
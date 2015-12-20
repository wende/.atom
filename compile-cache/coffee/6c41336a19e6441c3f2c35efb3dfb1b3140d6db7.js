(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-elixir-provider.coffee');

  module.exports = {
    config: {
      elixrPath: {
        type: 'string',
        "default": ""
      }
    },
    rsenseProvider: null,
    activate: function(state) {
      return this.rsenseProvider = new RsenseProvider();
    },
    provideAutocompletion: function() {
      return [this.rsenseProvider];
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.rsenseProvider) != null) {
        _ref.dispose();
      }
      return this.rsenseProvider = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQURGO0tBREY7QUFBQSxJQU1BLGNBQUEsRUFBZ0IsSUFOaEI7QUFBQSxJQVFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsY0FBQSxDQUFBLEVBRGQ7SUFBQSxDQVJWO0FBQUEsSUFXQSxxQkFBQSxFQUF1QixTQUFBLEdBQUE7YUFDckIsQ0FBQyxJQUFDLENBQUEsY0FBRixFQURxQjtJQUFBLENBWHZCO0FBQUEsSUFjQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOztZQUFlLENBQUUsT0FBakIsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsS0FGUjtJQUFBLENBZFo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir.coffee
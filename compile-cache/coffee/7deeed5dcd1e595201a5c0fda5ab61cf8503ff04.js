(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-elixir-provider.coffee');

  module.exports = {
    config: {
      elixirPath: {
        type: 'string',
        "default": "",
        description: "Absolute path to elixir executable (essential for MacOS)"
      },
      erlangHome: {
        type: 'string',
        "default": "",
        description: "Absolute path to erlang bin directory (essential for MacOS)"
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx1Q0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDBEQUZiO09BREY7QUFBQSxNQUlBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsNkRBRmI7T0FMRjtLQURGO0FBQUEsSUFVQSxjQUFBLEVBQWdCLElBVmhCO0FBQUEsSUFZQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBQSxFQURkO0lBQUEsQ0FaVjtBQUFBLElBZUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO2FBQ3JCLENBQUMsSUFBQyxDQUFBLGNBQUYsRUFEcUI7SUFBQSxDQWZ2QjtBQUFBLElBa0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWUsQ0FBRSxPQUFqQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUZSO0lBQUEsQ0FsQlo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir.coffee
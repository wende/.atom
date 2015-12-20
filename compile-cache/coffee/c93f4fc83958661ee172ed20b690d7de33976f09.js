(function() {
  var RsenseProvider, delorean;

  RsenseProvider = require('./autocomplete-elixir-provider.coffee');

  delorean = require("./delorean/delorean.coffee");

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
      this.rsenseProvider = new RsenseProvider();
      return delorean.activate(state);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHVDQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDRCQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwwREFGYjtPQURGO0FBQUEsTUFJQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZEQUZiO09BTEY7S0FERjtBQUFBLElBVUEsY0FBQSxFQUFnQixJQVZoQjtBQUFBLElBWUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBQSxDQUF0QixDQUFBO2FBQ0EsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsS0FBbEIsRUFGUTtJQUFBLENBWlY7QUFBQSxJQWdCQSxxQkFBQSxFQUF1QixTQUFBLEdBQUE7YUFDckIsQ0FBQyxJQUFDLENBQUEsY0FBRixFQURxQjtJQUFBLENBaEJ2QjtBQUFBLElBbUJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWUsQ0FBRSxPQUFqQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUZSO0lBQUEsQ0FuQlo7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir.coffee

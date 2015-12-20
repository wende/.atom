(function() {
  module.exports = {
    provider: null,
    ready: false,
    activate: function() {
      return this.ready = true;
    },
    deactivate: function() {
      return this.provider = null;
    },
    getProvider: function() {
      var PathsProvider;
      if (this.provider != null) {
        return this.provider;
      }
      PathsProvider = require('./paths-provider');
      this.provider = new PathsProvider();
      return this.provider;
    },
    provide: function() {
      return {
        provider: this.getProvider()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsSUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLElBR0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FERDtJQUFBLENBSFY7QUFBQSxJQU1BLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsUUFBRCxHQUFZLEtBREY7SUFBQSxDQU5aO0FBQUEsSUFTQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQ1gsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFvQixxQkFBcEI7QUFBQSxlQUFPLElBQUMsQ0FBQSxRQUFSLENBQUE7T0FBQTtBQUFBLE1BQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVIsQ0FEaEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxhQUFBLENBQUEsQ0FGaEIsQ0FBQTtBQUdBLGFBQU8sSUFBQyxDQUFBLFFBQVIsQ0FKVztJQUFBLENBVGI7QUFBQSxJQWVBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxhQUFPO0FBQUEsUUFBQyxRQUFBLEVBQVUsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFYO09BQVAsQ0FETztJQUFBLENBZlQ7R0FERixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-paths/lib/autocomplete-paths.coffee
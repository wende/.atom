(function() {
  module.exports = {
    configDefaults: {
      elixircExecutablePath: "",
      includeDirs: "",
      pa: ""
    },
    activate: function() {
      return console.log('activate linter-elixirc');
    }
  };

}).call(this);

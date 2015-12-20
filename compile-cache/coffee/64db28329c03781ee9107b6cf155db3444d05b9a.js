(function() {
  module.exports = {
    configDefaults: {
      erlcExecutablePath: "",
      includeDirs: "",
      pa: ""
    },
    activate: function() {
      return console.log('activate linter-erlc');
    }
  };

}).call(this);

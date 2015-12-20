(function() {
  var DEFAULT_MAPPINGS, cson, fs, path;

  fs = require('fs');

  path = require('path');

  cson = require('season');

  DEFAULT_MAPPINGS = {
    'script/test': 'script/test',
    'script/cibuild': 'script/cibuild',
    'Makefile': 'make test',
    'test/**/*_test.rb': 'rake test',
    'spec/**/*_spec.rb': 'rake spec',
    'Gruntfile.*': 'grunt test',
    'gulpfile.*': 'gulp test',
    'test/mocha.opts': 'mocha',
    'deft-package.json': 'deft test',
    '*_test.go': 'go test -v .',
    'phpunit.xml': 'phpunit',
    'setup.py': 'python setup.py test',
    'Cargo.toml': 'cargo test',
    'package.json': 'npm test'
  };

  module.exports = {
    readOrInitConfig: function() {
      var fn;
      fn = path.join(atom.config.configDirPath, 'test-status.cson');
      if (fs.existsSync(fn)) {
        return cson.readFileSync(fn);
      } else {
        cson.writeFileSync(fn, DEFAULT_MAPPINGS);
        return DEFAULT_MAPPINGS;
      }
    }
  };

}).call(this);

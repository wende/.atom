(function() {
  var fs, path, requireSpecs, runAllSpecs, setSpecDirectory, setSpecField, setSpecType, specDirectory, _;

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  require('./spec-helper');

  requireSpecs = function(specDirectory, specType) {
    var specFilePath, _i, _len, _ref, _results;
    _ref = fs.listTreeSync(specDirectory);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      specFilePath = _ref[_i];
      if (!(/-spec\.(coffee|js)$/.test(specFilePath))) {
        continue;
      }
      require(specFilePath);
      _results.push(setSpecDirectory(specDirectory));
    }
    return _results;
  };

  setSpecField = function(name, value) {
    var index, specs, _i, _ref, _results;
    specs = jasmine.getEnv().currentRunner().specs();
    if (specs.length === 0) {
      return;
    }
    _results = [];
    for (index = _i = _ref = specs.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
      if (specs[index][name] != null) {
        break;
      }
      _results.push(specs[index][name] = value);
    }
    return _results;
  };

  setSpecType = function(specType) {
    return setSpecField('specType', specType);
  };

  setSpecDirectory = function(specDirectory) {
    return setSpecField('specDirectory', specDirectory);
  };

  runAllSpecs = function() {
    var fixturesPackagesPath, packagePath, packagePaths, resourcePath, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
    resourcePath = atom.getLoadSettings().resourcePath;
    requireSpecs(path.join(resourcePath, 'spec'));
    setSpecType('core');
    fixturesPackagesPath = path.join(__dirname, 'fixtures', 'packages');
    packagePaths = atom.packages.getAvailablePackageNames().map(function(packageName) {
      return atom.packages.resolvePackagePath(packageName);
    });
    packagePaths = _.groupBy(packagePaths, function(packagePath) {
      if (packagePath.indexOf("" + fixturesPackagesPath + path.sep) === 0) {
        return 'fixtures';
      } else if (packagePath.indexOf("" + resourcePath + path.sep) === 0) {
        return 'bundled';
      } else {
        return 'user';
      }
    });
    _ref1 = (_ref = packagePaths.bundled) != null ? _ref : [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      packagePath = _ref1[_i];
      requireSpecs(path.join(packagePath, 'spec'));
    }
    setSpecType('bundled');
    _ref3 = (_ref2 = packagePaths.user) != null ? _ref2 : [];
    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
      packagePath = _ref3[_j];
      requireSpecs(path.join(packagePath, 'spec'));
    }
    return setSpecType('user');
  };

  if (specDirectory = atom.getLoadSettings().specDirectory) {
    requireSpecs(specDirectory);
    setSpecType('user');
  } else {
    runAllSpecs();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsQ0FBUSxlQUFSLENBSEEsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxTQUFDLGFBQUQsRUFBZ0IsUUFBaEIsR0FBQTtBQUNiLFFBQUEsc0NBQUE7QUFBQTtBQUFBO1NBQUEsMkNBQUE7OEJBQUE7WUFBd0QscUJBQXFCLENBQUMsSUFBdEIsQ0FBMkIsWUFBM0I7O09BQ3REO0FBQUEsTUFBQSxPQUFBLENBQVEsWUFBUixDQUFBLENBQUE7QUFBQSxvQkFHQSxnQkFBQSxDQUFpQixhQUFqQixFQUhBLENBREY7QUFBQTtvQkFEYTtFQUFBLENBTGYsQ0FBQTs7QUFBQSxFQVlBLFlBQUEsR0FBZSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDYixRQUFBLGdDQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLGFBQWpCLENBQUEsQ0FBZ0MsQ0FBQyxLQUFqQyxDQUFBLENBQVIsQ0FBQTtBQUNBLElBQUEsSUFBVSxLQUFLLENBQUMsTUFBTixLQUFnQixDQUExQjtBQUFBLFlBQUEsQ0FBQTtLQURBO0FBRUE7U0FBYSxvR0FBYixHQUFBO0FBQ0UsTUFBQSxJQUFTLDBCQUFUO0FBQUEsY0FBQTtPQUFBO0FBQUEsb0JBQ0EsS0FBTSxDQUFBLEtBQUEsQ0FBTyxDQUFBLElBQUEsQ0FBYixHQUFxQixNQURyQixDQURGO0FBQUE7b0JBSGE7RUFBQSxDQVpmLENBQUE7O0FBQUEsRUFtQkEsV0FBQSxHQUFjLFNBQUMsUUFBRCxHQUFBO1dBQ1osWUFBQSxDQUFhLFVBQWIsRUFBeUIsUUFBekIsRUFEWTtFQUFBLENBbkJkLENBQUE7O0FBQUEsRUFzQkEsZ0JBQUEsR0FBbUIsU0FBQyxhQUFELEdBQUE7V0FDakIsWUFBQSxDQUFhLGVBQWIsRUFBOEIsYUFBOUIsRUFEaUI7RUFBQSxDQXRCbkIsQ0FBQTs7QUFBQSxFQXlCQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osUUFBQSw2R0FBQTtBQUFBLElBQUMsZUFBZ0IsSUFBSSxDQUFDLGVBQUwsQ0FBQSxFQUFoQixZQUFELENBQUE7QUFBQSxJQUVBLFlBQUEsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsTUFBeEIsQ0FBYixDQUZBLENBQUE7QUFBQSxJQUdBLFdBQUEsQ0FBWSxNQUFaLENBSEEsQ0FBQTtBQUFBLElBS0Esb0JBQUEsR0FBdUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDLFVBQWpDLENBTHZCLENBQUE7QUFBQSxJQU1BLFlBQUEsR0FBZSxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUFkLENBQUEsQ0FBd0MsQ0FBQyxHQUF6QyxDQUE2QyxTQUFDLFdBQUQsR0FBQTthQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLFdBQWpDLEVBRDBEO0lBQUEsQ0FBN0MsQ0FOZixDQUFBO0FBQUEsSUFRQSxZQUFBLEdBQWUsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxZQUFWLEVBQXdCLFNBQUMsV0FBRCxHQUFBO0FBQ3JDLE1BQUEsSUFBRyxXQUFXLENBQUMsT0FBWixDQUFvQixFQUFBLEdBQUcsb0JBQUgsR0FBMEIsSUFBSSxDQUFDLEdBQW5ELENBQUEsS0FBNkQsQ0FBaEU7ZUFDRSxXQURGO09BQUEsTUFFSyxJQUFHLFdBQVcsQ0FBQyxPQUFaLENBQW9CLEVBQUEsR0FBRyxZQUFILEdBQWtCLElBQUksQ0FBQyxHQUEzQyxDQUFBLEtBQXFELENBQXhEO2VBQ0gsVUFERztPQUFBLE1BQUE7ZUFHSCxPQUhHO09BSGdDO0lBQUEsQ0FBeEIsQ0FSZixDQUFBO0FBaUJBO0FBQUEsU0FBQSw0Q0FBQTs4QkFBQTtBQUFBLE1BQUEsWUFBQSxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixNQUF2QixDQUFiLENBQUEsQ0FBQTtBQUFBLEtBakJBO0FBQUEsSUFrQkEsV0FBQSxDQUFZLFNBQVosQ0FsQkEsQ0FBQTtBQXFCQTtBQUFBLFNBQUEsOENBQUE7OEJBQUE7QUFBQSxNQUFBLFlBQUEsQ0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBdUIsTUFBdkIsQ0FBYixDQUFBLENBQUE7QUFBQSxLQXJCQTtXQXNCQSxXQUFBLENBQVksTUFBWixFQXZCWTtFQUFBLENBekJkLENBQUE7O0FBa0RBLEVBQUEsSUFBRyxhQUFBLEdBQWdCLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBc0IsQ0FBQyxhQUExQztBQUNFLElBQUEsWUFBQSxDQUFhLGFBQWIsQ0FBQSxDQUFBO0FBQUEsSUFDQSxXQUFBLENBQVksTUFBWixDQURBLENBREY7R0FBQSxNQUFBO0FBSUUsSUFBQSxXQUFBLENBQUEsQ0FBQSxDQUpGO0dBbERBO0FBQUEiCn0=
//# sourceURL=/usr/share/atom/resources/app/spec/spec-suite.coffee
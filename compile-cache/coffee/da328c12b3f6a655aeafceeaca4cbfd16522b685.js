(function() {
  var Atom, error, exportsPath, path, runSpecSuite, _ref;

  require('crash-reporter').start({
    productName: 'Atom',
    companyName: 'GitHub'
  });

  path = require('path');

  try {
    require('../src/window');
    Atom = require('../src/atom');
    window.atom = Atom.loadOrCreate('spec');
    if (!atom.getLoadSettings().exitWhenDone) {
      atom.getCurrentWindow().show();
    }
    runSpecSuite = require('./jasmine-helper').runSpecSuite;
    exportsPath = path.join(atom.getLoadSettings().resourcePath, 'exports');
    require('module').globalPaths.push(exportsPath);
    process.env.NODE_PATH = exportsPath;
    document.title = "Spec Suite";
    runSpecSuite('./spec-suite', atom.getLoadSettings().logFile);
  } catch (_error) {
    error = _error;
    if (typeof atom !== "undefined" && atom !== null ? atom.getLoadSettings().exitWhenDone : void 0) {
      console.error((_ref = error.stack) != null ? _ref : error);
      atom.exit(1);
    } else {
      throw error;
    }
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsT0FBQSxDQUFRLGdCQUFSLENBQXlCLENBQUMsS0FBMUIsQ0FBZ0M7QUFBQSxJQUFBLFdBQUEsRUFBYSxNQUFiO0FBQUEsSUFBcUIsV0FBQSxFQUFhLFFBQWxDO0dBQWhDLENBQUEsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBSUE7QUFDRSxJQUFBLE9BQUEsQ0FBUSxlQUFSLENBQUEsQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBRFAsQ0FBQTtBQUFBLElBRUEsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFJLENBQUMsWUFBTCxDQUFrQixNQUFsQixDQUZkLENBQUE7QUFNQSxJQUFBLElBQUEsQ0FBQSxJQUEwQyxDQUFDLGVBQUwsQ0FBQSxDQUFzQixDQUFDLFlBQTdEO0FBQUEsTUFBQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUF1QixDQUFDLElBQXhCLENBQUEsQ0FBQSxDQUFBO0tBTkE7QUFBQSxJQVFDLGVBQWdCLE9BQUEsQ0FBUSxrQkFBUixFQUFoQixZQVJELENBQUE7QUFBQSxJQVdBLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBc0IsQ0FBQyxZQUFqQyxFQUErQyxTQUEvQyxDQVhkLENBQUE7QUFBQSxJQVlBLE9BQUEsQ0FBUSxRQUFSLENBQWlCLENBQUMsV0FBVyxDQUFDLElBQTlCLENBQW1DLFdBQW5DLENBWkEsQ0FBQTtBQUFBLElBY0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFaLEdBQXdCLFdBZHhCLENBQUE7QUFBQSxJQWdCQSxRQUFRLENBQUMsS0FBVCxHQUFpQixZQWhCakIsQ0FBQTtBQUFBLElBaUJBLFlBQUEsQ0FBYSxjQUFiLEVBQTZCLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBc0IsQ0FBQyxPQUFwRCxDQWpCQSxDQURGO0dBQUEsY0FBQTtBQW9CRSxJQURJLGNBQ0osQ0FBQTtBQUFBLElBQUEsbURBQUcsSUFBSSxDQUFFLGVBQU4sQ0FBQSxDQUF1QixDQUFDLHFCQUEzQjtBQUNFLE1BQUEsT0FBTyxDQUFDLEtBQVIsdUNBQTRCLEtBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLENBREEsQ0FERjtLQUFBLE1BQUE7QUFJRSxZQUFNLEtBQU4sQ0FKRjtLQXBCRjtHQUpBO0FBQUEiCn0=
//# sourceURL=/usr/share/atom/resources/app/spec/spec-bootstrap.coffee
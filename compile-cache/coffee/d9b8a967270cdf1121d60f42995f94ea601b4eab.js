(function() {
  module.exports = {
    apply: function() {
      var root, setAccentColor, setAltCmdPalette, setAnimationStatus, setCompactTreeView, setDepth, setFontSize, setPanelContrast, setRippleAccentColor, setRobotoFont, setShowTabIcons, setSlimScrollbars, setTabSize, setThemeStyle;
      root = document.documentElement;
      setAccentColor = function(currentAccentColor) {
        root.classList.remove('blue');
        root.classList.remove('cyan');
        root.classList.remove('green');
        root.classList.remove('orange');
        root.classList.remove('pink');
        root.classList.remove('purple');
        root.classList.remove('red');
        root.classList.remove('teal');
        root.classList.remove('white');
        root.classList.remove('yellow');
        return root.classList.add(currentAccentColor.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.accentColor', function() {
        return setAccentColor(atom.config.get('atom-material-ui.accentColor'));
      });
      setAccentColor(atom.config.get('atom-material-ui.accentColor'));
      setRobotoFont = function(boolean) {
        if (boolean) {
          return root.classList.add('roboto-mono');
        } else {
          return root.classList.remove('roboto-mono');
        }
      };
      atom.config.onDidChange('atom-material-ui.useRoboto', function() {
        return setRobotoFont(atom.config.get('atom-material-ui.useRoboto'));
      });
      setRobotoFont(atom.config.get('atom-material-ui.useRoboto'));
      setSlimScrollbars = function(boolean) {
        if (boolean) {
          return root.classList.add('slim-scrollbar');
        } else {
          return root.classList.remove('slim-scrollbar');
        }
      };
      atom.config.onDidChange('atom-material-ui.slimScrollbar', function() {
        return setSlimScrollbars(atom.config.get('atom-material-ui.slimScrollbar'));
      });
      setSlimScrollbars(atom.config.get('atom-material-ui.slimScrollbar'));
      setAnimationStatus = function(boolean) {
        if (boolean) {
          return root.classList.add('no-animations');
        } else {
          return root.classList.remove('no-animations');
        }
      };
      atom.config.onDidChange('atom-material-ui.disableAnimations', function() {
        return setAnimationStatus(atom.config.get('atom-material-ui.disableAnimations'));
      });
      setAnimationStatus(atom.config.get('atom-material-ui.disableAnimations'));
      setPanelContrast = function(boolean) {
        if (boolean) {
          return root.classList.add('panel-contrast');
        } else {
          return root.classList.remove('panel-contrast');
        }
      };
      atom.config.onDidChange('atom-material-ui.panelContrast', function() {
        return setPanelContrast(atom.config.get('atom-material-ui.panelContrast'));
      });
      setPanelContrast(atom.config.get('atom-material-ui.panelContrast'));
      setDepth = function(boolean) {
        if (boolean) {
          return root.classList.add('panel-depth');
        } else {
          return root.classList.remove('panel-depth');
        }
      };
      atom.config.onDidChange('atom-material-ui.depth', function() {
        return setDepth(atom.config.get('atom-material-ui.depth'));
      });
      setDepth(atom.config.get('atom-material-ui.depth'));
      setAltCmdPalette = function(boolean) {
        if (boolean) {
          return root.classList.add('alt-cmd-palette');
        } else {
          return root.classList.remove('alt-cmd-palette');
        }
      };
      atom.config.onDidChange('atom-material-ui.altCmdPalette', function() {
        return setAltCmdPalette(atom.config.get('atom-material-ui.altCmdPalette'));
      });
      setAltCmdPalette(atom.config.get('atom-material-ui.altCmdPalette'));
      setTabSize = function(currentTabSize) {
        root.classList.remove('tab-size-small');
        root.classList.remove('tab-size-normal');
        root.classList.remove('tab-size-big');
        return root.classList.add('tab-size-' + currentTabSize.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.tabSize', function() {
        return setTabSize(atom.config.get('atom-material-ui.tabSize'));
      });
      setTabSize(atom.config.get('atom-material-ui.tabSize'));
      setThemeStyle = function(currentThemeStyle) {
        root.classList.remove('theme-style-darker');
        root.classList.remove('theme-style-default');
        root.classList.remove('theme-style-lighter');
        return root.classList.add('theme-style-' + currentThemeStyle.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.themeSyle', function() {
        return setThemeStyle(atom.config.get('atom-material-ui.themeSyle'));
      });
      setThemeStyle(atom.config.get('atom-material-ui.themeSyle'));
      setCompactTreeView = function(boolean) {
        if (boolean) {
          return root.classList.add('compact-tree-view');
        } else {
          return root.classList.remove('compact-tree-view');
        }
      };
      atom.config.onDidChange('atom-material-ui.compactTreeView', function() {
        return setCompactTreeView(atom.config.get('atom-material-ui.compactTreeView'));
      });
      setCompactTreeView(atom.config.get('atom-material-ui.compactTreeView'));
      setFontSize = function(currentFontSize) {
        root.classList.remove('font-size-small');
        root.classList.remove('font-size-regular');
        root.classList.remove('font-size-big');
        root.classList.remove('font-size-huge');
        return root.classList.add('font-size-' + currentFontSize.toLowerCase());
      };
      atom.config.onDidChange('atom-material-ui.fontSize', function() {
        return setFontSize(atom.config.get('atom-material-ui.fontSize'));
      });
      setFontSize(atom.config.get('atom-material-ui.fontSize'));
      setShowTabIcons = function(boolean) {
        if (boolean) {
          return root.classList.add('tab-icons');
        } else {
          return root.classList.remove('tab-icons');
        }
      };
      atom.config.onDidChange('atom-material-ui.showTabIcons', function() {
        return setShowTabIcons(atom.config.get('atom-material-ui.showTabIcons'));
      });
      setShowTabIcons(atom.config.get('atom-material-ui.showTabIcons'));
      setRippleAccentColor = function(boolean) {
        if (boolean) {
          return root.classList.add('ripple-accent-color');
        } else {
          return root.classList.remove('ripple-accent-color');
        }
      };
      atom.config.onDidChange('atom-material-ui.rippleAccentColor', function() {
        return setRippleAccentColor(atom.config.get('atom-material-ui.rippleAccentColor'));
      });
      return setRippleAccentColor(atom.config.get('atom-material-ui.rippleAccentColor'));
    }
  };

}).call(this);

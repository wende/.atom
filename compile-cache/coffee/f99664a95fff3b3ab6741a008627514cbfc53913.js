(function() {
  var $, FileItem, FileView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  FileItem = (function(_super) {
    __extends(FileItem, _super);

    function FileItem() {
      return FileItem.__super__.constructor.apply(this, arguments);
    }

    FileItem.content = function(file) {
      return this.div({
        "class": "file " + file.type,
        'data-name': file.name
      }, (function(_this) {
        return function() {
          _this.i({
            "class": 'icon check clickable',
            click: 'select'
          });
          _this.i({
            "class": "icon file-" + file.type
          });
          return _this.span({
            "class": 'clickable',
            click: 'select'
          }, file.name);
        };
      })(this));
    };

    FileItem.prototype.initialize = function(file) {
      return this.file = file;
    };

    FileItem.prototype.select = function() {
      return this.file.select(this.file.name);
    };

    return FileItem;

  })(View);

  module.exports = FileView = (function(_super) {
    __extends(FileView, _super);

    function FileView() {
      return FileView.__super__.constructor.apply(this, arguments);
    }

    FileView.content = function() {
      return this.div({
        "class": 'files'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading clickable'
          }, function() {
            _this.i({
              click: 'toggleBranch',
              "class": 'icon forked'
            });
            _this.span({
              click: 'toggleBranch'
            }, 'Workspace');
            return _this.div({
              "class": 'action',
              click: 'selectAll'
            }, function() {
              _this.span('Select');
              _this.i({
                "class": 'icon check'
              });
              return _this.input({
                "class": 'invisible',
                type: 'checkbox',
                outlet: 'allCheckbox',
                checked: true
              });
            });
          });
          return _this.div({
            "class": 'placeholder'
          }, 'No local working copy changes detected');
        };
      })(this));
    };

    FileView.prototype.initialize = function() {
      this.files = {};
      this.arrayOfFiles = new Array;
      return this.hidden = false;
    };

    FileView.prototype.toggleBranch = function() {
      if (this.hidden) {
        this.addAll(this.arrayOfFiles);
      } else {
        this.clearAll();
      }
      return this.hidden = !this.hidden;
    };

    FileView.prototype.hasSelected = function() {
      var file, name, _ref1;
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (file.selected) {
          return true;
        }
      }
      return false;
    };

    FileView.prototype.getSelected = function() {
      var file, files, name, _ref1;
      files = {
        all: [],
        add: [],
        rem: []
      };
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (!file.selected) {
          continue;
        }
        files.all.push(name);
        switch (file.type) {
          case 'deleted':
            files.rem.push(name);
            break;
          default:
            files.add.push(name);
        }
      }
      return files;
    };

    FileView.prototype.showSelected = function() {
      var file, fnames, name, _ref1;
      fnames = [];
      this.arrayOfFiles = Object.keys(this.files).map((function(_this) {
        return function(file) {
          return _this.files[file];
        };
      })(this));
      this.find('.file').toArray().forEach((function(_this) {
        return function(div) {
          var f, name;
          f = $(div);
          if (name = f.attr('data-name')) {
            if (_this.files[name].selected) {
              fnames.push(name);
              f.addClass('active');
            } else {
              f.removeClass('active');
            }
          }
        };
      })(this));
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (__indexOf.call(fnames, name) < 0) {
          file.selected = false;
        }
      }
      this.parentView.showSelectedFiles();
    };

    FileView.prototype.clearAll = function() {
      this.find('>.file').remove();
    };

    FileView.prototype.addAll = function(files) {
      var file, fnames, name, select, _ref1;
      fnames = [];
      this.clearAll();
      if (files.length) {
        this.removeClass('none');
        select = (function(_this) {
          return function(name) {
            return _this.selectFile(name);
          };
        })(this);
        files.forEach((function(_this) {
          return function(file) {
            var _base, _name;
            fnames.push(file.name);
            file.select = select;
            (_base = _this.files)[_name = file.name] || (_base[_name] = {
              name: file.name
            });
            _this.files[file.name].type = file.type;
            _this.files[file.name].selected = file.selected;
            _this.append(new FileItem(file));
          };
        })(this));
      } else {
        this.addClass('none');
      }
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        if (__indexOf.call(fnames, name) < 0) {
          file.selected = false;
        }
      }
      this.showSelected();
    };

    FileView.prototype.selectFile = function(name) {
      if (name) {
        this.files[name].selected = !!!this.files[name].selected;
      }
      this.allCheckbox.prop('checked', false);
      this.showSelected();
    };

    FileView.prototype.selectAll = function() {
      var file, name, val, _ref1;
      if (this.hidden) {
        return;
      }
      val = !!!this.allCheckbox.prop('checked');
      this.allCheckbox.prop('checked', val);
      _ref1 = this.files;
      for (name in _ref1) {
        file = _ref1[name];
        file.selected = val;
      }
      this.showSelected();
    };

    FileView.prototype.unselectAll = function() {
      var file, name, _i, _len, _ref1;
      _ref1 = this.files;
      for (file = _i = 0, _len = _ref1.length; _i < _len; file = ++_i) {
        name = _ref1[file];
        if (file.selected) {
          file.selected = false;
        }
      }
    };

    return FileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9naXQtY29udHJvbC9saWIvdmlld3MvZmlsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxZQUFBLElBQUQsRUFBTyxTQUFBLENBQVAsQ0FBQTs7QUFBQSxFQUVNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBUSxPQUFBLEdBQU8sSUFBSSxDQUFDLElBQXBCO0FBQUEsUUFBNEIsV0FBQSxFQUFhLElBQUksQ0FBQyxJQUE5QztPQUFMLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkQsVUFBQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sc0JBQVA7QUFBQSxZQUErQixLQUFBLEVBQU8sUUFBdEM7V0FBSCxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBUSxZQUFBLEdBQVksSUFBSSxDQUFDLElBQXpCO1dBQUgsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxXQUFQO0FBQUEsWUFBb0IsS0FBQSxFQUFPLFFBQTNCO1dBQU4sRUFBMkMsSUFBSSxDQUFDLElBQWhELEVBSHVEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx1QkFNQSxVQUFBLEdBQVks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

//# sourceURL=/home/iraasta/.atom/packages/git-control/lib/views/file-view.coffee

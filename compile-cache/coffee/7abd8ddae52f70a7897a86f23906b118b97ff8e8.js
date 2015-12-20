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
            "class": 'icon check'
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
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon forked'
            });
            _this.span('Workspace');
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
      return this.files = {};
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

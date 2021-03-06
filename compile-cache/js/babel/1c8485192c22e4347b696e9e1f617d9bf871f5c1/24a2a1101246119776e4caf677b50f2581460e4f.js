var url = require('url');
var TermView = require('./lib/TermView');

module.exports = {
  termViews: [],
  config: {
    'autoRunCommand': {
      'type': 'string',
      'default': null
    }
  },
  config: {
    autoRunCommand: {
      type: 'string',
      'default': null
    }
  },
  activate: function activate(state) {
    this.state = state;
    var self = this;
    atom.commands.add('atom-workspace', 'term:open', self.openTerm.bind(self));
    ['up', 'right', 'down', 'left'].forEach(function (direction) {
      atom.commands.add('atom-workspace', 'term:open-split-' + direction, self.splitTerm.bind(self, direction));
    });
    if (state.termViews) {}
  },
  createTermView: function createTermView() {
    var opts = {
      runCommand: atom.config.get('term.autoRunCommand')
    };
    var termView = new TermView(opts);
    termView.on('remove', this.handleRemoveTerm.bind(this));
    this.termViews.push(termView);
    return termView;
  },
  splitTerm: function splitTerm(direction) {
    var termView = this.createTermView();
    direction = capitalize(direction);
    atom.workspace.getActivePane()['split' + direction]({
      items: [termView]
    });
  },
  openTerm: function openTerm() {
    var termView = new TermView();
    activePane = atom.workspace.getActivePane();
    activePane.addItem(termView);
    activePane.activateNextItem();
  },
  handleRemoveTerm: function handleRemoveTerm(termView) {
    var termViews = this.termViews;
    termViews.splice(termViews.indexOf(termView), 1); // remove
  },
  deactivate: function deactivate() {
    this.termViews.forEach(function (view) {
      view.deactivate();
    });
  },
  serialize: function serialize() {
    var termViewsState = this.termViews.map(function () {
      return termViews.serialize();
    });
    return {
      termViews: termViewsState
    };
  }
};

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// TODO: restore
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvdGVybS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXpDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDYixXQUFTLEVBQUUsRUFBRTtBQUNiLFFBQU0sRUFBRTtBQUNOLG9CQUFnQixFQUFFO0FBQ2hCLFlBQU0sRUFBRSxRQUFRO0FBQ2hCLGVBQVMsRUFBRSxJQUFJO0tBQ2hCO0dBQ0Y7QUFDRCxRQUFNLEVBQUM7QUFDTCxrQkFBYyxFQUFDO0FBQ1gsVUFBSSxFQUFDLFFBQVE7QUFDYixpQkFBUyxJQUFJO0tBQ2hCO0dBQ0Y7QUFDRCxVQUFRLEVBQUUsa0JBQVUsS0FBSyxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMxRSxLQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLFNBQVMsRUFBRTtBQUMzRCxVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBQyxrQkFBa0IsR0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDeEcsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLEVBRXBCO0dBQ0Y7QUFDRCxnQkFBYyxFQUFFLDBCQUFZO0FBQzFCLFFBQUksSUFBSSxHQUFHO0FBQ1QsZ0JBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztLQUNuRCxDQUFDO0FBQ0YsUUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEMsWUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLFdBQU8sUUFBUSxDQUFDO0dBQ2pCO0FBQ0QsV0FBUyxFQUFFLG1CQUFVLFNBQVMsRUFBRTtBQUM5QixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDckMsYUFBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsQyxRQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sR0FBQyxTQUFTLENBQUMsQ0FBQztBQUNoRCxXQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7S0FDbEIsQ0FBQyxDQUFDO0dBQ0o7QUFDRCxVQUFRLEVBQUUsb0JBQVc7QUFDbkIsUUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUM5QixjQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUM1QyxjQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLGNBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQy9CO0FBQ0Qsa0JBQWdCLEVBQUUsMEJBQVUsUUFBUSxFQUFFO0FBQ3BDLFFBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDL0IsYUFBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ2xEO0FBQ0QsWUFBVSxFQUFFLHNCQUFZO0FBQ3RCLFFBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ3JDLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQixDQUFDLENBQUM7R0FDSjtBQUNELFdBQVMsRUFBRSxxQkFBWTtBQUNyQixRQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZO0FBQ2xELGFBQU8sU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQzlCLENBQUMsQ0FBQztBQUNILFdBQU87QUFDTCxlQUFTLEVBQUUsY0FBYztLQUMxQixDQUFDO0dBQ0g7Q0FDSixDQUFDOztBQUVGLFNBQVMsVUFBVSxDQUFFLEdBQUcsRUFBRTtBQUN4QixTQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0NBQzFEIiwiZmlsZSI6Ii9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvdGVybS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciBUZXJtVmlldyA9IHJlcXVpcmUoJy4vbGliL1Rlcm1WaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRlcm1WaWV3czogW10sXG4gICAgY29uZmlnOiB7XG4gICAgICBcImF1dG9SdW5Db21tYW5kXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwiZGVmYXVsdFwiOiBudWxsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb25maWc6e1xuICAgICAgYXV0b1J1bkNvbW1hbmQ6e1xuICAgICAgICAgIHR5cGU6J3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogbnVsbFxuICAgICAgfSAgXG4gICAgfSxcbiAgICBhY3RpdmF0ZTogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCd0ZXJtOm9wZW4nLCBzZWxmLm9wZW5UZXJtLmJpbmQoc2VsZikpO1xuICAgICAgWyd1cCcsICdyaWdodCcsICdkb3duJywgJ2xlZnQnXS5mb3JFYWNoKGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywndGVybTpvcGVuLXNwbGl0LScrZGlyZWN0aW9uLCBzZWxmLnNwbGl0VGVybS5iaW5kKHNlbGYsIGRpcmVjdGlvbikpO1xuICAgICAgfSk7XG4gICAgICBpZiAoc3RhdGUudGVybVZpZXdzKSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RvcmVcbiAgICAgIH1cbiAgICB9LFxuICAgIGNyZWF0ZVRlcm1WaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgcnVuQ29tbWFuZDogYXRvbS5jb25maWcuZ2V0KCd0ZXJtLmF1dG9SdW5Db21tYW5kJylcbiAgICAgIH07XG4gICAgICB2YXIgdGVybVZpZXcgPSBuZXcgVGVybVZpZXcob3B0cyk7XG4gICAgICB0ZXJtVmlldy5vbigncmVtb3ZlJywgdGhpcy5oYW5kbGVSZW1vdmVUZXJtLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy50ZXJtVmlld3MucHVzaCh0ZXJtVmlldyk7XG4gICAgICByZXR1cm4gdGVybVZpZXc7XG4gICAgfSxcbiAgICBzcGxpdFRlcm06IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAgIHZhciB0ZXJtVmlldyA9IHRoaXMuY3JlYXRlVGVybVZpZXcoKTtcbiAgICAgIGRpcmVjdGlvbiA9IGNhcGl0YWxpemUoZGlyZWN0aW9uKTtcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVsnc3BsaXQnK2RpcmVjdGlvbl0oe1xuICAgICAgICBpdGVtczogW3Rlcm1WaWV3XVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBvcGVuVGVybTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGVybVZpZXcgPSBuZXcgVGVybVZpZXcoKTtcbiAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gICAgICBhY3RpdmVQYW5lLmFkZEl0ZW0odGVybVZpZXcpO1xuICAgICAgYWN0aXZlUGFuZS5hY3RpdmF0ZU5leHRJdGVtKCk7XG4gICAgfSxcbiAgICBoYW5kbGVSZW1vdmVUZXJtOiBmdW5jdGlvbiAodGVybVZpZXcpIHtcbiAgICAgIHZhciB0ZXJtVmlld3MgPSB0aGlzLnRlcm1WaWV3cztcbiAgICAgIHRlcm1WaWV3cy5zcGxpY2UodGVybVZpZXdzLmluZGV4T2YodGVybVZpZXcpLCAxKTsgLy8gcmVtb3ZlXG4gICAgfSxcbiAgICBkZWFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnRlcm1WaWV3cy5mb3JFYWNoKGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHZpZXcuZGVhY3RpdmF0ZSgpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBzZXJpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ZXJtVmlld3NTdGF0ZSA9IHRoaXMudGVybVZpZXdzLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0ZXJtVmlld3Muc2VyaWFsaXplKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRlcm1WaWV3czogdGVybVZpZXdzU3RhdGVcbiAgICAgIH07XG4gICAgfVxufTtcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSAoc3RyKSB7XG4gIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xufVxuIl19
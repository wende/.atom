var assert = require("assert");

// the test runner will call "term.resize(100, 100)" after 1 second
process.on("SIGWINCH", function () {
  var size = process.stdout.getWindowSize();
  assert.equal(size[0], 100);
  assert.equal(size[1], 100);
  clearTimeout(timeout);
});

var timeout = setTimeout(function () {
  console.error("TIMEOUT!");
  process.exit(7);
}, 5000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWVybGFuZy9saWIvc2VydmVyL3B0eS5qcy90ZXN0L2NoaWxkcmVuL3Jlc2l6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUcvQixPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZO0FBQ2pDLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDMUMsUUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsY0FBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3ZCLENBQUMsQ0FBQzs7QUFFSCxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsWUFBWTtBQUNuQyxTQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFCLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDakIsRUFBRSxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9pcmFhc3RhLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1lcmxhbmcvbGliL3NlcnZlci9wdHkuanMvdGVzdC9jaGlsZHJlbi9yZXNpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbi8vIHRoZSB0ZXN0IHJ1bm5lciB3aWxsIGNhbGwgXCJ0ZXJtLnJlc2l6ZSgxMDAsIDEwMClcIiBhZnRlciAxIHNlY29uZFxucHJvY2Vzcy5vbignU0lHV0lOQ0gnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzaXplID0gcHJvY2Vzcy5zdGRvdXQuZ2V0V2luZG93U2l6ZSgpO1xuICBhc3NlcnQuZXF1YWwoc2l6ZVswXSwgMTAwKTtcbiAgYXNzZXJ0LmVxdWFsKHNpemVbMV0sIDEwMCk7XG4gIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn0pO1xuXG52YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmVycm9yKCdUSU1FT1VUIScpO1xuICBwcm9jZXNzLmV4aXQoNyk7XG59LCA1MDAwKTtcbiJdfQ==
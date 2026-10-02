// Minimal, fail-safe enhancement. Page works fully without JS.
(function () {
  'use strict';
  // Hours per public Booksy listing (minutes from midnight). Sun closed.
  var HOURS = { 1: [540, 1140], 2: [540, 1140], 3: [540, 1140], 4: [540, 1140], 5: [540, 1140], 6: [540, 900] };
  function fmt(m) { var h = Math.floor(m / 60), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ' ' + ap; }
  function updateStatus() {
    var el = document.getElementById('open-status');
    if (!el || typeof Intl === 'undefined') return;
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[map.weekday];
      var mins = (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10);
      if (typeof day !== 'number' || isNaN(mins)) return;
      var row = document.querySelector('.hours tr[data-day="' + day + '"]');
      if (row) row.classList.add('today');
      var h = HOURS[day];
      var open = !!h && mins >= h[0] && mins < h[1];
      el.textContent = open
        ? 'Open now until ' + fmt(h[1]) + ' (per Booksy listing).'
        : 'Closed now. Book ahead on Booksy for the next open slot.';
      el.classList.add(open ? 'is-open' : 'is-closed');
    } catch (e) {
      // Keep the default static hours text. No error shown to visitors.
    }
  }
  try { updateStatus(); } catch (e) { /* fail closed: static page remains */ }
})();

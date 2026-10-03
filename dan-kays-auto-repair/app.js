// Minimal, fail-safe enhancement. Page works fully without JS (static hours text stays).
(function () {
  'use strict';
  var MODE = "table"; // "table", "24" or "none"
  var HOURS = {"1": [[450, 1050]], "2": [[450, 1050]], "3": [[450, 1050]], "4": [[450, 1050]], "5": [[450, 1050]]}; // minutes from midnight, per public listing
  var SRC = "per public Google listing";
  function fmt(m) { var h = Math.floor(m / 60), mi = m % 60, ap = h >= 12 && h < 24 ? 'PM' : 'AM'; h = h % 12 || 12; return h + (mi ? ':' + (mi < 10 ? '0' : '') + mi : '') + ' ' + ap; }
  function update() {
    if (MODE === 'none') return;
    var el = document.getElementById('open-status');
    if (!el || typeof Intl === 'undefined' || !Intl.DateTimeFormat) return;
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[map.weekday];
    var mins = (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10);
    if (typeof day !== 'number' || isNaN(mins)) return;
    var row = document.querySelector('.hours tr[data-day="' + day + '"]');
    if (row) row.classList.add('today');
    if (MODE !== 'table') return;
    var ranges = HOURS[day] || [], open = null;
    for (var i = 0; i < ranges.length; i++) { if (mins >= ranges[i][0] && mins < ranges[i][1]) open = ranges[i]; }
    el.textContent = open ? 'Open now until ' + fmt(open[1]) + ' (' + SRC + ').' : 'Closed right now. See hours below (' + SRC + ').';
    el.classList.add(open ? 'is-open' : 'is-closed');
  }
  try { update(); } catch (e) { /* fail closed: static text remains */ }
})();

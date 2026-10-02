// Minimal, fail-safe enhancements. Page works fully without JS.
(function () {
  'use strict';

  // Open/closed indicator in America/New_York time. Any failure keeps the static text.
  function updateStatus() {
    var el = document.getElementById('open-status');
    if (!el) return;
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var day = days[map.weekday];
      var mins = (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10);
      if (typeof day !== 'number' || isNaN(mins)) return;

      var row = document.querySelector('.hours tr[data-day="' + day + '"]');
      if (row) row.classList.add('today');

      var open = day !== 1 && mins >= 690 && mins < 1290; // 11:30 to 21:30
      el.textContent = open
        ? 'Open now until 9:30 PM (while food lasts).'
        : 'Closed now. Open Tue to Sun, 11:30 AM to 9:30 PM.';
      el.classList.add(open ? 'is-open' : 'is-closed');
    } catch (e) {
      // Keep the default static hours text. No error shown to visitors.
    }
  }

  // Copy address, only shown if the Clipboard API is available.
  function setupCopy() {
    var btn = document.getElementById('copy-address');
    var msg = document.getElementById('copy-msg');
    if (!btn || !msg || !navigator.clipboard || !window.isSecureContext) return;
    btn.hidden = false;
    btn.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText('12 SW 1st Ave, Gainesville, FL 32601').then(function () {
          msg.textContent = 'Address copied.';
        }, function () {
          msg.textContent = 'Could not copy. Address: 12 SW 1st Ave, Gainesville, FL 32601';
        });
      } catch (e) {
        msg.textContent = 'Could not copy. Address: 12 SW 1st Ave, Gainesville, FL 32601';
      }
    });
  }

  try { updateStatus(); setupCopy(); } catch (e) { /* fail closed: static page remains */ }
})();

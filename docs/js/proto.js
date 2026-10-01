/* ==========================================================================
   proto.js — shared prototype behaviour: navigator, Notes switch, pager,
   context between pages, units, governorate, enquiry basket, compare tray,
   WhatsApp links and toasts. Page-specific behaviour lives in pages.js.
   ========================================================================== */

(function () {
  'use strict';
  var MT = window.MT = window.MT || {};

  /* --- Session storage, wrapped (private mode safe) ---------------------- */
  MT.get = function (key, fallback) {
    try { var v = window.sessionStorage.getItem('mt-' + key); return v === null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  };
  MT.set = function (key, value) {
    try { window.sessionStorage.setItem('mt-' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  };

  /* --- ?param= context with sessionStorage fallback (R09) ---------------- */
  MT.param = function (name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) { MT.set('ctx-' + name, v); return v; }
    return MT.get('ctx-' + name, null);
  };
  MT.remember = function (name, value) { MT.set('ctx-' + name, value); };

  /* --- Formatting (R05) -------------------------------------------------- */
  MT.num = function (n, dp) {
    return Number(n).toLocaleString('en-GB', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  };
  MT.egp = function (n) { return 'EGP ' + MT.num(Math.round(n)); };
  MT.egpM = function (n) { return 'EGP ' + (n / 1e6).toLocaleString('en-GB', { maximumFractionDigits: 1 }) + 'm'; };
  MT.units = function () { return MT.get('units', 'metric'); };
  MT.spec = function (kind, v) {
    var us = MT.units() === 'us';
    if (kind === 'kw') return us ? MT.num(v * 1.341) + ' hp' : MT.num(v, v % 1 ? 1 : 0) + ' kW';
    if (kind === 'kg') return us ? MT.num(v * 2.20462) + ' lb' : MT.num(v) + ' kg';
    if (kind === 'mm') {
      if (!us) return MT.num(v) + ' mm';
      var inches = v / 25.4; return Math.floor(inches / 12) + ' ft ' + Math.round(inches % 12) + ' in';
    }
    return String(v);
  };
  MT.date = function (iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  MT.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };

  /* --- Branches and governorate (R10) ------------------------------------ */
  MT.branch = function (id) { return (MT.branches || []).filter(function (b) { return b.id === id; })[0]; };
  MT.gov = function () { return MT.get('gov', null); };
  MT.setGov = function (g) { MT.set('gov', g); document.dispatchEvent(new CustomEvent('mt:gov')); };
  MT.nearest = function () { var g = MT.gov(); return g && MT.governorates[g] ? MT.branch(MT.governorates[g]) : null; };
  MT.govOptions = function (selected) {
    return Object.keys(MT.governorates).sort().map(function (g) {
      return '<option' + (g === selected ? ' selected' : '') + '>' + g + '</option>';
    }).join('');
  };

  /* --- Status badges (R06) ---------------------------------------------- */
  MT.badge = function (stock) {
    var b = stock.branch ? MT.branch(stock.branch) : null;
    var where = b ? ' · ' + b.city : '';
    switch (stock.s) {
      case 'in': return '<span class="badge s-in">In stock' + where + '</span>';
      case 'order': return '<span class="badge s-order">On order · ' + MT.esc(stock.lead || 'lead time on request') + '</span>';
      case 'reserved': return '<span class="badge s-reserved">Reserved' + where + '</span>';
      case 'sold': return '<span class="badge s-sold">Sold</span>';
      case 'free': return '<span class="badge s-in">Available for your dates</span>';
      case 'booked': return '<span class="badge s-booked">Booked for part of your dates</span>';
      default: return '';
    }
  };

  /* --- WhatsApp (R34) ---------------------------------------------------- */
  MT.wa = function (text, number) {
    return 'https://wa.me/' + (number || '201103917720') + '?text=' + encodeURIComponent(text);
  };

  /* --- Toast ------------------------------------------------------------- */
  var toastTimer;
  MT.toast = function (html) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html; t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 4000);
  };

  /* --- Enquiry basket (R29) --------------------------------------------- */
  MT.basket = function () { return MT.get('basket', []); };
  MT.saveBasket = function (items) { MT.set('basket', items); MT.renderBasketCount(); document.dispatchEvent(new CustomEvent('mt:basket')); };
  MT.addToBasket = function (item) {
    var items = MT.basket();
    var found = items.filter(function (i) { return i.key === item.key; })[0];
    if (found) { found.qty = (found.qty || 1) + 1; } else { item.qty = item.qty || 1; items.push(item); }
    MT.saveBasket(items);
    MT.toast('Added ' + MT.esc(item.name) + ' to your quote. <a href="' + MT.rel('pages/enquiry.html') + '">View quote (' + items.length + ')</a>');
  };
  MT.renderBasketCount = function () {
    var n = MT.basket().length;
    document.querySelectorAll('[data-basket-count]').forEach(function (el) { el.textContent = n; });
  };

  /* --- Compare (R15) ---------------------------------------------------- */
  MT.compare = function () { return MT.get('compare', []); };
  MT.toggleCompare = function (id) {
    var ids = MT.compare(), i = ids.indexOf(id);
    if (i > -1) ids.splice(i, 1);
    else if (ids.length >= 3) { MT.toast('You can compare up to 3 models. Remove one first.'); return false; }
    else ids.push(id);
    MT.set('compare', ids); MT.renderTray(); document.dispatchEvent(new CustomEvent('mt:compare'));
    return true;
  };
  MT.renderTray = function () {
    var host = document.querySelector('[data-tray]');
    if (!host) return;
    var ids = MT.compare();
    document.body.classList.toggle('has-tray', ids.length > 0);
    if (!ids.length) { host.hidden = true; host.innerHTML = ''; return; }
    host.hidden = false;
    var all = (MT.machines || []).concat(MT.legacy || []);
    var lis = ids.map(function (id) {
      var m = all.filter(function (x) { return x.id === id; })[0];
      return '<li>' + MT.esc(m ? m.name : id) + ' <button type="button" aria-label="Remove ' + MT.esc(m ? m.name : id) + ' from compare" data-uncompare="' + id + '">×</button></li>';
    }).join('');
    host.innerHTML = '<div class="container"><strong>Compare</strong><ul>' + lis + '</ul>' +
      '<a class="btn btn-sm' + (ids.length < 2 ? '" aria-disabled="true" tabindex="-1" style="opacity:.45;pointer-events:none' : '') + '" href="' + MT.rel('pages/compare.html') + '?ids=' + ids.join(',') + '">Compare ' + ids.length + ' model' + (ids.length > 1 ? 's' : '') + '</a>' +
      '<button type="button" class="link-btn" data-clear-compare>Clear</button></div>';
  };
  document.addEventListener('click', function (e) {
    var un = e.target.closest('[data-uncompare]');
    if (un) { MT.toggleCompare(un.getAttribute('data-uncompare')); }
    if (e.target.closest('[data-clear-compare]')) { MT.set('compare', []); MT.renderTray(); document.dispatchEvent(new CustomEvent('mt:compare')); }
  });

  /* --- Paths ------------------------------------------------------------ */
  MT.root = function () { return /\/pages\//.test(window.location.pathname) ? '../' : './'; };
  MT.rel = function (p) { return MT.root() + p; };

  /* --- Navigator + pager (R01, R03) ------------------------------------- */
  MT.sequence = [
    { f: 'index.html', p: 0, t: 'Overview' },
    { f: 'machines.html', p: 1, t: '1 · Machine listing and finder' },
    { f: 'machine.html', p: 1, t: '1 · Machine page' },
    { f: 'compare.html', p: 1, t: '1 · Compare models' },
    { f: 'used.html', p: 2, t: '2 · Used machines' },
    { f: 'used-machine.html', p: 2, t: '2 · Used machine page' },
    { f: 'rental.html', p: 2, t: '2 · Rental by date' },
    { f: 'sell.html', p: 2, t: '2 · Sell or trade in' },
    { f: 'enquiry.html', p: 3, t: '3 · Your quote and enquiry' },
    { f: 'offers.html', p: 4, t: '4 · Offers' },
    { f: 'finance.html', p: 4, t: '4 · Finance and running costs' },
    { f: 'branches.html', p: 5, t: '5 · Branches and parts' },
    { f: 'book-service.html', p: 5, t: '5 · Book a service visit' }
  ];
  function current() {
    var f = window.location.pathname.split('/').pop() || 'index.html';
    for (var i = 0; i < MT.sequence.length; i++) if (MT.sequence[i].f === f) return i;
    return 0;
  }
  function initNavigator() {
    var idx = current(), cur = MT.sequence[idx];
    document.querySelectorAll('.proto-links a[data-proto]').forEach(function (a) {
      var p = parseInt(a.getAttribute('data-proto'), 10);
      var href = a.getAttribute('href').split('/').pop();
      if (href === cur.f) a.setAttribute('aria-current', 'page');
      else if (p === cur.p && p > 0) a.classList.add('is-parent');
    });
    var pager = document.querySelector('[data-pager]');
    if (!pager) return;
    var html = '';
    if (idx > 0) {
      var pr = MT.sequence[idx - 1];
      html += '<a class="prev" href="' + MT.rel((pr.p ? 'pages/' : '') + pr.f) + '"><small>Previous</small><strong>← ' + pr.t + '</strong></a>';
    }
    if (idx < MT.sequence.length - 1) {
      var nx = MT.sequence[idx + 1];
      html += '<a class="next" href="' + MT.rel('pages/' + nx.f) + '"><small>Next</small><strong>' + nx.t + ' →</strong></a>';
    }
    pager.insertAdjacentHTML('afterbegin', html);
  }

  /* --- Notes switch (R02) ----------------------------------------------- */
  function initNotes() {
    var sw = document.querySelector('[data-notes-switch]');
    if (!sw) return;
    if (!document.querySelector('.wf-note, .proto-why')) { sw.hidden = true; return; }
    sw.hidden = false;
    var on = MT.get('notes', false);
    function apply() {
      document.body.classList.toggle('notes-on', on);
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
    }
    sw.addEventListener('click', function () { on = !on; MT.set('notes', on); apply(); });
    apply();
  }

  /* --- Dock (R07) ------------------------------------------------------- */
  function initDock() {
    var wa = document.querySelector('[data-dock="whatsapp"]');
    if (wa) wa.setAttribute('href', MT.wa(document.body.getAttribute('data-wa') || 'Hello Mantrac, I have a question.'));
    var br = document.querySelector('[data-dock="branch"]');
    var near = MT.nearest();
    if (br && near) br.lastChild.textContent = near.city;
  }
  MT.setDockText = function (text) {
    var wa = document.querySelector('[data-dock="whatsapp"]');
    if (wa) wa.setAttribute('href', MT.wa(text));
  };

  /* --- Units toggle (R05): any [data-units] group ------------------------ */
  function initUnits() {
    document.querySelectorAll('[data-units]').forEach(function (group) {
      group.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-value') === MT.units() ? 'true' : 'false');
        b.addEventListener('click', function () {
          MT.set('units', b.getAttribute('data-value'));
          document.querySelectorAll('[data-units] button').forEach(function (x) {
            x.setAttribute('aria-pressed', x.getAttribute('data-value') === MT.units() ? 'true' : 'false');
          });
          document.dispatchEvent(new CustomEvent('mt:units'));
        });
      });
    });
  }

  /* --- Simple validation helper for prototype forms (R08) ---------------- */
  MT.validate = function (form) {
    var ok = true, first = null;
    form.querySelectorAll('[data-required]').forEach(function (el) {
      var field = el.closest('.field') || el.parentElement;
      var msg = field.querySelector('.field-error');
      var val = el.type === 'checkbox' ? el.checked : el.value.trim();
      var bad = !val;
      if (!bad && el.getAttribute('data-pattern')) bad = !(new RegExp(el.getAttribute('data-pattern'))).test(el.value.replace(/\s/g, ''));
      field.classList.toggle('has-error', bad);
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (msg) msg.hidden = !bad;
      if (bad) { ok = false; if (!first) first = el; }
    });
    if (first) first.focus();
    return ok;
  };
  MT.ref = function (prefix) { return prefix + '-' + String(Math.floor(100000 + Math.random() * 899999)); };

  document.addEventListener('DOMContentLoaded', function () {
    initNavigator();
    initNotes();
    initDock();
    initUnits();
    MT.renderBasketCount();
    MT.renderTray();
  });
})();

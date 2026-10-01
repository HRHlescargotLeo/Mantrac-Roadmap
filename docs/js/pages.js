/* ==========================================================================
   pages.js — page behaviour for the Mantrac prototypes, keyed by
   <body data-page="...">. Shared helpers come from proto.js (window.MT).
   ========================================================================== */

(function () {
  'use strict';
  var MT = window.MT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = MT.esc;

  /* --- Shared: governorate selects ---------------------------------------- */
  function initGovSelects() {
    $$('[data-gov-select]').forEach(function (sel) {
      sel.innerHTML = '<option value="">Choose governorate</option>' + MT.govOptions(MT.gov());
      sel.addEventListener('change', function () { if (sel.value) MT.setGov(sel.value); });
    });
    document.addEventListener('mt:gov', function () {
      $$('[data-gov-select]').forEach(function (sel) { sel.value = MT.gov() || ''; });
    });
  }

  function findMachine(id) {
    return MT.machines.concat(MT.legacy).filter(function (m) { return m.id === id; })[0];
  }
  MT.findMachine = findMachine;

  function machineCard(m) {
    var href = MT.rel('pages/machine.html') + '?model=' + m.id;
    var checked = MT.compare().indexOf(m.id) > -1 ? ' checked' : '';
    var stock = m.legacy ? '<span class="badge s-sold">Previous model · parts and service only</span>' : MT.badge(m.stock);
    var price = m.legacy ? '' : '<p class="price-line">Indicative from <strong>' + MT.egpM(m.from) + '</strong> <span class="badge sample">sample</span></p>';
    var actions = m.legacy
      ? '<a class="btn btn-secondary btn-sm" href="' + MT.rel('pages/branches.html') + '?service=Parts%20counter">Find parts and service</a>'
      : '<div class="row"><button type="button" class="btn btn-sm" data-add-machine="' + m.id + '">Add to quote</button>' +
        '<label class="cmp"><input type="checkbox" data-compare="' + m.id + '"' + checked + '> Compare</label></div>' +
        '<a href="' + MT.wa('Hello Mantrac, please send me today\'s price for the Cat ' + m.name + ' excavator.') + '" target="_blank" rel="noopener">Ask for today\'s price on WhatsApp</a>';
    return '<article class="mcard">' +
      '<div class="wf-placeholder">Product photo ' + esc(m.name) + '</div>' +
      '<div class="mcard-body"><span class="mcard-cat">' + m.size + ' excavator</span>' +
      '<h3><a href="' + href + '">Cat ' + esc(m.name) + '</a></h3>' +
      '<dl class="specs"><div><dt>Net power</dt><dd>' + MT.spec('kw', m.kw) + '</dd></div>' +
      '<div><dt>Operating weight</dt><dd>' + MT.spec('kg', m.kg) + '</dd></div>' +
      '<div><dt>Max dig depth</dt><dd>' + MT.spec('mm', m.dig) + '</dd></div></dl>' +
      stock + price + '</div><div class="mcard-actions">' + actions + '</div></article>';
  }

  function bindMachineActions(root) {
    root.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add-machine]');
      if (add) {
        var m = findMachine(add.getAttribute('data-add-machine'));
        MT.addToBasket({ key: 'new-' + m.id, type: 'New machine', id: m.id, name: 'Cat ' + m.name + ' excavator', detail: m.stock.s === 'in' ? 'In stock at ' + MT.branch(m.stock.branch).city : 'On order, ' + (m.stock.lead || 'lead time on request') });
      }
    });
    root.addEventListener('change', function (e) {
      var c = e.target.closest('[data-compare]');
      if (c && !MT.toggleCompare(c.getAttribute('data-compare'))) c.checked = false;
    });
  }

  /* === 1a Machine listing ================================================ */
  function machines() {
    var state = MT.get('filters', { size: [], dig: [], app: [], avail: [], tier: [] });
    var FACETS = {
      size: { label: function (v) { return v; }, values: ['Mini', 'Small', 'Medium', 'Large'], test: function (m, v) { return m.size === v; } },
      dig: { label: function (v) { return v; }, values: ['Up to 4 m', '4 to 6.5 m', 'Over 6.5 m'], test: function (m, v) { return v === 'Up to 4 m' ? m.dig <= 4000 : v === '4 to 6.5 m' ? m.dig > 4000 && m.dig <= 6500 : m.dig > 6500; } },
      app: { label: function (v) { return v; }, values: ['Utilities', 'Building', 'Roads', 'Quarrying', 'Demolition', 'Mining', 'Agriculture', 'Landscaping'], test: function (m, v) { return m.apps.indexOf(v) > -1; } },
      avail: { label: function (v) { return v; }, values: ['In stock', 'On order'], test: function (m, v) { return v === 'In stock' ? m.stock && m.stock.s === 'in' : m.stock && m.stock.s === 'order'; } },
      tier: { label: function (v) { return v; }, values: ['Stage V', 'Tier 3'], test: function (m, v) { return m.tier === v; } }
    };
    var legacy = $('#legacy'), sort = $('#sort'), results = $('#results');

    function passes(m, skip) {
      return Object.keys(FACETS).every(function (f) {
        if (f === skip || !state[f].length) return true;
        if (m.legacy) return f === 'size' || f === 'dig' ? state[f].some(function (v) { return FACETS[f].test(m, v); }) : false;
        return state[f].some(function (v) { return FACETS[f].test(m, v); });
      });
    }
    function pool() { return MT.machines.concat(legacy.checked ? MT.legacy : []); }

    function renderFacets() {
      Object.keys(FACETS).forEach(function (f) {
        var fs = $('[data-facet="' + f + '"]');
        $$('.check', fs).forEach(function (x) { x.remove(); });
        FACETS[f].values.forEach(function (v) {
          var n = pool().filter(function (m) { return passes(m, f) && FACETS[f].test(m, v); }).length;
          var id = 'f-' + f + '-' + v.replace(/\W+/g, '');
          var on = state[f].indexOf(v) > -1;
          fs.insertAdjacentHTML('beforeend', '<label class="check' + (n ? '' : ' zero') + '" for="' + id + '"><input type="checkbox" id="' + id + '" data-f="' + f + '" value="' + esc(v) + '"' + (on ? ' checked' : '') + (n || on ? '' : ' disabled') + '><span>' + esc(v) + '</span><span class="count">' + n + '</span></label>');
        });
      });
    }
    function render() {
      var list = pool().filter(function (m) { return passes(m); });
      var order = ['Mini', 'Small', 'Medium', 'Large'];
      list.sort(function (a, b) {
        if (sort.value === 'stock') return (a.stock && a.stock.s === 'in' ? 0 : 1) - (b.stock && b.stock.s === 'in' ? 0 : 1) || a.kg - b.kg;
        if (sort.value === 'price') return (a.from || 9e9) - (b.from || 9e9);
        if (sort.value === 'size-desc') return b.kg - a.kg;
        return a.kg - b.kg;
      });
      results.innerHTML = list.length ? list.map(machineCard).join('') :
        '<div class="empty-state"><p><strong>No excavators match all of these filters.</strong></p><p>Remove a filter, or tell us the job and we\'ll suggest a machine.</p><button type="button" class="btn btn-secondary" data-modal-open-finder>Help me choose</button></div>';
      $$('[data-count], [data-count-inline]').forEach(function (el) { el.textContent = list.length; });
      var chips = [];
      Object.keys(state).forEach(function (f) { state[f].forEach(function (v) { chips.push('<button type="button" class="chip-x" data-unchip="' + f + '|' + esc(v) + '">' + esc(v) + ' ×</button>'); }); });
      $('[data-active-chips]').innerHTML = chips.join('');
      renderFacets();
      MT.set('filters', state);
    }

    $('#filters').addEventListener('change', function (e) {
      var i = e.target.closest('[data-f]'); if (!i) return;
      var f = i.getAttribute('data-f'), arr = state[f], idx = arr.indexOf(i.value);
      if (i.checked && idx < 0) arr.push(i.value); if (!i.checked && idx > -1) arr.splice(idx, 1);
      render();
    });
    document.addEventListener('click', function (e) {
      var u = e.target.closest('[data-unchip]');
      if (u) { var p = u.getAttribute('data-unchip').split('|'); state[p[0]].splice(state[p[0]].indexOf(p[1]), 1); render(); }
      if (e.target.closest('[data-clear-filters]')) { Object.keys(state).forEach(function (f) { state[f] = []; }); render(); }
      if (e.target.closest('[data-open-filters]')) { $('#filters').classList.add('open'); var c = $('#filters [data-close-filters]'); if (c) c.focus(); }
      if (e.target.closest('[data-close-filters]')) { $('#filters').classList.remove('open'); }
      if (e.target.closest('[data-modal-open-finder]')) { openFinder(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#filters').classList.remove('open'); });
    legacy.addEventListener('change', render);
    sort.addEventListener('change', render);
    document.addEventListener('mt:units', render);
    document.addEventListener('mt:compare', render);
    document.addEventListener('mt:gov', render);
    bindMachineActions(results);

    /* Finder (R14) */
    var step = 0, answers = MT.get('finder', {});
    var Q = [['job', 'What will the machine mostly do?'], ['material', 'What are you digging?'], ['site', 'What is the site like?']];
    function openFinder() { $('#finder-modal').classList.add('open'); step = 0; drawFinder(); }
    function suggestions() {
      return MT.machines.map(function (m) {
        var s = 0;
        if (m.apps.indexOf(answers.job) > -1) s += 3;
        if (answers.site === 'tight') s += m.size === 'Mini' ? 3 : m.size === 'Small' ? 2 : 0;
        if (answers.site === 'open') s += m.size === 'Medium' ? 3 : m.size === 'Small' ? 2 : 0;
        if (answers.site === 'big') s += m.size === 'Large' ? 3 : m.size === 'Medium' ? 1 : 0;
        if (answers.material === 'rock') s += m.kg > 20000 ? 2 : 0;
        if (answers.material === 'soft') s += m.kg < 25000 ? 1 : 0;
        if (m.stock.s === 'in') s += 0.5;
        return { m: m, s: s };
      }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).map(function (x) { return x.m; });
    }
    function drawFinder() {
      $$('[data-finder-steps] li').forEach(function (li, i) { li.className = i < step ? 'done' : i === step ? 'current' : ''; if (i === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      var body = $('[data-finder-body]'), next = $('[data-finder-next]'), back = $('[data-finder-back]');
      back.hidden = step === 0;
      if (step < 3) {
        var key = Q[step][0];
        body.innerHTML = '<fieldset><legend>' + Q[step][1] + '</legend><div class="choice-grid">' + MT.finder[key].map(function (o, i) {
          return '<div class="choice"><input type="radio" name="' + key + '" id="q-' + key + i + '" value="' + o.v + '"' + (answers[key] === o.v ? ' checked' : '') + '><label for="q-' + key + i + '">' + o.t + '<small>' + o.d + '</small></label></div>';
        }).join('') + '</div></fieldset><p class="field-error" data-finder-error hidden>Choose one option to continue.</p>';
        next.textContent = step === 2 ? 'Show suggestions' : 'Next'; next.hidden = false;
      } else {
        var s = suggestions();
        MT.set('finder', answers);
        body.innerHTML = '<p>Based on your answers, these are the excavators we\'d start with. A Mantrac specialist can confirm the right size and attachments.</p>' +
          '<ul class="basket-list">' + s.map(function (m) { return '<li class="basket-item"><div class="wf-placeholder">Photo</div><div><strong><a href="' + MT.rel('pages/machine.html') + '?model=' + m.id + '">Cat ' + m.name + '</a></strong><br><small>' + m.size + ' · ' + MT.spec('kg', m.kg) + ' · dig ' + MT.spec('mm', m.dig) + '</small><br>' + MT.badge(m.stock) + '</div><label class="cmp"><input type="checkbox" data-compare="' + m.id + '"' + (MT.compare().indexOf(m.id) > -1 ? ' checked' : '') + '> Compare</label></li>'; }).join('') + '</ul>' +
          '<p style="margin-top:1rem"><a class="btn" href="' + MT.rel('pages/compare.html') + '?ids=' + s.map(function (m) { return m.id; }).join(',') + '">Compare these 3</a> <button type="button" class="btn btn-secondary" data-finder-restart>Start again</button></p>';
        next.hidden = true;
      }
    }
    $('[data-finder-body]').addEventListener('change', function (e) {
      if (e.target.name) { answers[e.target.name] = e.target.value; var er = $('[data-finder-error]'); if (er) er.hidden = true; }
      var c = e.target.closest('[data-compare]'); if (c && !MT.toggleCompare(c.getAttribute('data-compare'))) c.checked = false;
    });
    $('[data-finder-body]').addEventListener('click', function (e) { if (e.target.closest('[data-finder-restart]')) { answers = {}; step = 0; drawFinder(); } });
    $('[data-finder-next]').addEventListener('click', function () {
      if (!answers[Q[step][0]]) { $('[data-finder-error]').hidden = false; return; }
      step++; drawFinder();
    });
    $('[data-finder-back]').addEventListener('click', function () { step = Math.max(0, step - 1); drawFinder(); });
    $$('[data-modal-open="finder-modal"]').forEach(function (b) { b.addEventListener('click', function () { step = 0; drawFinder(); }); });

    render();
    drawFinder();
  }

  /* === 1b Machine page =================================================== */
  function machine() {
    var id = MT.param('model') || '320-gx';
    var m = findMachine(id) || MT.machines[6];
    MT.remember('model', m.id);
    document.title = 'Cat ' + m.name + ' – Mantrac prototypes';
    MT.setDockText('Hello Mantrac, I\'d like a price for the Cat ' + m.name + ' excavator.');
    function draw() {
      $$('[data-m="name"]').forEach(function (el) { el.textContent = 'Cat ' + m.name; });
      $('[data-m="size"]').textContent = m.size + ' excavator';
      $('[data-m="url"]').textContent = 'mantracgroup.com/en-eg/products/new-equipment/excavators/' + m.id;
      $('[data-m="specs"]').innerHTML = '<div><dt>Net power</dt><dd>' + MT.spec('kw', m.kw) + '</dd></div><div><dt>Operating weight</dt><dd>' + MT.spec('kg', m.kg) + '</dd></div><div><dt>Max dig depth</dt><dd>' + MT.spec('mm', m.dig) + '</dd></div><div><dt>Emissions</dt><dd>' + m.tier + '</dd></div>';
      $('[data-m="stock"]').innerHTML = m.legacy ? '<span class="badge s-sold">Previous model · parts and service only</span>' : MT.badge(m.stock);
      $('[data-m="price"]').innerHTML = m.legacy ? '' : 'Indicative from <strong>' + MT.egpM(m.from) + '</strong> <span class="badge sample">sample</span> or from <strong>' + MT.egp(m.from * 0.7 / 36 * 1.33) + '</strong> a month with finance';
      $('[data-m="wa"]').setAttribute('href', MT.wa('Hello Mantrac, please send me today\'s price for the Cat ' + m.name + ' excavator.'));
      $('[data-m="finance"]').setAttribute('href', MT.rel('pages/finance.html') + '?model=' + m.id);
      var near = MT.nearest(), box = $('[data-m="expert"]');
      if (near) {
        box.innerHTML = '<h2>Your local contact</h2><p><strong>' + esc(near.lines.machines) + '</strong><br>' + esc(near.name) + '<br><small>' + esc(near.address) + '</small></p>' +
          '<p class="row"><a class="btn btn-secondary btn-sm" href="' + MT.wa('Hello ' + near.lines.machines + ', I\'m interested in the Cat ' + m.name + '.', near.wa) + '" target="_blank" rel="noopener">WhatsApp this team</a> <a class="btn btn-secondary btn-sm" href="tel:19266">Call 19266</a></p>' +
          '<p><small>Not right? <label for="gov2" class="sr-only">Change governorate</label><select id="gov2" data-gov-select style="width:auto"></select></small></p>';
      } else {
        box.innerHTML = '<h2>Your local contact</h2><p>Tell us where the machine will work and we\'ll show your nearest branch and sales team.</p><label for="gov2">Governorate</label><select id="gov2" data-gov-select></select>';
      }
      initGovSelects();
      var other = MT.machines.filter(function (x) { return x.size === m.size && x.id !== m.id; }).slice(0, 3);
      $('[data-m="similar"]').innerHTML = other.map(machineCard).join('');
    }
    $('[data-m="add"]').addEventListener('click', function () {
      MT.addToBasket({ key: 'new-' + m.id, type: 'New machine', id: m.id, name: 'Cat ' + m.name + ' excavator', detail: m.stock.s === 'in' ? 'In stock at ' + MT.branch(m.stock.branch).city : 'On order' });
    });
    $('[data-m="compare"]').addEventListener('click', function () { if (MT.compare().indexOf(m.id) < 0) MT.toggleCompare(m.id); else MT.toast('Cat ' + esc(m.name) + ' is already in your compare list.'); });
    bindMachineActions($('[data-m="similar"]'));
    document.addEventListener('mt:units', draw);
    document.addEventListener('mt:gov', draw);
    document.addEventListener('mt:compare', function () { $('[data-m="similar"]').innerHTML = MT.machines.filter(function (x) { return x.size === m.size && x.id !== m.id; }).slice(0, 3).map(machineCard).join(''); });
    draw();
  }

  /* === 1c Compare ======================================================== */
  function compare() {
    var ids = (MT.param('ids') || MT.compare().join(',')).split(',').filter(Boolean);
    function draw() {
      var ms = ids.map(findMachine).filter(Boolean);
      var host = $('[data-compare-table]');
      if (ms.length < 2) {
        host.innerHTML = '<div class="empty-state"><p><strong>Choose at least two models to compare.</strong></p><a class="btn" href="' + MT.rel('pages/machines.html') + '">Back to excavators</a></div>';
        return;
      }
      var rows = [
        ['Size', function (m) { return m.size; }],
        ['Net power', function (m) { return MT.spec('kw', m.kw); }],
        ['Operating weight', function (m) { return MT.spec('kg', m.kg); }],
        ['Max dig depth', function (m) { return MT.spec('mm', m.dig); }],
        ['Emissions', function (m) { return m.tier; }],
        ['Good for', function (m) { return m.apps.join(', ') || 'n/a'; }],
        ['Availability', function (m) { return m.legacy ? 'Previous model' : MT.badge(m.stock); }],
        ['Indicative from', function (m) { return m.from ? MT.egpM(m.from) + ' <span class="badge sample">sample</span>' : 'n/a'; }]
      ];
      var only = $('#diff-only').checked;
      host.innerHTML = '<div class="table-wrap"><table class="data"><caption class="sr-only">Comparison of ' + ms.length + ' excavators</caption><thead><tr><th scope="col">Spec</th>' +
        ms.map(function (m) { return '<th scope="col"><a href="' + MT.rel('pages/machine.html') + '?model=' + m.id + '">Cat ' + esc(m.name) + '</a></th>'; }).join('') + '</tr></thead><tbody>' +
        rows.map(function (r) {
          var vals = ms.map(r[1]); var diff = vals.some(function (v) { return v !== vals[0]; });
          if (only && !diff) return '';
          return '<tr' + (diff ? ' class="diff"' : '') + '><th scope="row">' + r[0] + '</th>' + vals.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>';
        }).join('') +
        '<tr><th scope="row"><span class="sr-only">Actions</span></th>' + ms.map(function (m) { return '<td>' + (m.legacy ? '' : '<button type="button" class="btn btn-sm" data-add-machine="' + m.id + '">Add to quote</button>') + '</td>'; }).join('') + '</tr></tbody></table></div>';
    }
    $('#diff-only').addEventListener('change', draw);
    document.addEventListener('mt:units', draw);
    bindMachineActions($('[data-compare-table]'));
    MT.set('compare', ids.slice(0, 3)); MT.renderTray();
    document.addEventListener('mt:compare', function () { ids = MT.compare(); draw(); });
    draw();
  }

  /* === 2a Used listing =================================================== */
  function usedCard(u) {
    var t = MT.tiers[u.tier], b = MT.branch(u.branch);
    var href = MT.rel('pages/used-machine.html') + '?id=' + u.id;
    return '<article class="mcard">' +
      '<div class="wf-placeholder">Photo · ' + u.photos + ' photos</div>' +
      '<div class="mcard-body"><span class="mcard-cat">' + esc(u.fam) + '</span>' +
      '<h3><a href="' + href + '">Cat ' + esc(u.name) + ', ' + u.year + '</a></h3>' +
      '<dl class="specs"><div><dt>Hours</dt><dd>' + MT.num(u.hrs) + '</dd></div><div><dt>Branch</dt><dd>' + esc(b.city) + '</dd></div></dl>' +
      '<div class="row"><a class="badge tier" href="' + MT.rel('pages/used.html') + '#tiers-h">' + t.short + '</a>' + MT.badge({ s: u.s }) + '</div>' +
      '<p class="price-line">EGP ' + u.band[0] + 'm to ' + u.band[1] + 'm <span class="badge sample">sample</span></p></div>' +
      '<div class="mcard-actions"><div class="row"><a class="btn btn-secondary btn-sm" href="' + href + '">View machine</a>' +
      (u.s === 'sold' ? '' : '<button type="button" class="btn btn-sm" data-add-used="' + u.id + '">Add to quote</button>') + '</div></div></article>';
  }
  function addUsed(id) {
    var u = MT.used.filter(function (x) { return x.id === id; })[0];
    MT.addToBasket({ key: 'used-' + u.id, type: 'Used machine', id: u.id, name: 'Used Cat ' + u.name + ' (' + u.year + ', ' + MT.num(u.hrs) + ' hrs)', detail: MT.tiers[u.tier].name + ' · at ' + MT.branch(u.branch).city });
  }
  function used() {
    $('[data-tiers]').innerHTML = ['ccu', 'mcu', 'fair'].map(function (k) {
      var t = MT.tiers[k];
      return '<div class="card"><span class="badge tier" style="align-self:flex-start">' + t.short + '</span><h3 class="card-title">' + t.name + '</h3><p class="card-text">' + t.limits + '</p><p class="card-text"><strong>Cover:</strong> ' + t.cover + '</p></div>';
    }).join('');
    var fams = MT.used.map(function (u) { return u.fam; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    $('#u-fam').innerHTML = '<option value="">All types</option>' + fams.map(function (f) { return '<option>' + f + '</option>'; }).join('');
    $('#u-tier').innerHTML = '<option value="">All tiers</option>' + Object.keys(MT.tiers).map(function (k) { return '<option value="' + k + '">' + MT.tiers[k].name + '</option>'; }).join('');
    var brs = MT.used.map(function (u) { return u.branch; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    $('#u-branch').innerHTML = '<option value="">All branches</option>' + brs.map(function (b) { return '<option value="' + b + '">' + MT.branch(b).city + '</option>'; }).join('');
    var pre = MT.param('tier'); if (pre && MT.tiers[pre]) $('#u-tier').value = pre;
    function draw() {
      var f = $('#u-fam').value, t = $('#u-tier').value, b = $('#u-branch').value, so = $('#u-sort').value, sold = $('#u-sold').checked;
      var list = MT.used.filter(function (u) { return (!f || u.fam === f) && (!t || u.tier === t) && (!b || u.branch === b) && (sold || u.s !== 'sold'); });
      list.sort(function (a, c) { return so === 'hrs' ? a.hrs - c.hrs : so === 'price' ? a.band[0] - c.band[0] : c.year - a.year; });
      $('[data-ucount]').textContent = list.length;
      $('[data-used]').innerHTML = list.length ? list.map(usedCard).join('') : '<div class="empty-state"><p><strong>Nothing matches right now.</strong></p><p>Set an alert below and we\'ll tell you when a machine like this comes in.</p><a class="btn btn-secondary" href="#alert-h">Set an alert</a></div>';
    }
    $$('[data-uf]').forEach(function (el) { el.addEventListener('change', draw); });
    $('[data-used]').addEventListener('click', function (e) { var a = e.target.closest('[data-add-used]'); if (a) addUsed(a.getAttribute('data-add-used')); });
    $('#alert-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(this)) return;
      var d = $('[data-alert-done]'); d.hidden = false;
      d.innerHTML = '<strong>Alert set.</strong> We\'ll send ' + esc($('#a-fam').value.toLowerCase()) + ' that match to ' + esc($('#a-contact').value) + ' by ' + esc($('#a-ch').value) + '. Reply STOP at any time.';
    });
    draw();
  }

  /* === 2b Used machine =================================================== */
  function usedMachine() {
    var id = MT.param('id') || MT.used[0].id;
    var u = MT.used.filter(function (x) { return x.id === id; })[0] || MT.used[0];
    var t = MT.tiers[u.tier], b = MT.branch(u.branch);
    document.title = 'Used Cat ' + u.name + ' ' + u.year + ' – Mantrac prototypes';
    MT.setDockText('Hello Mantrac, I\'m interested in the used Cat ' + u.name + ' (' + u.year + ', ' + MT.num(u.hrs) + ' hours) at ' + b.city + '.');
    var shots = ['Left side', 'Right side', 'Front and bucket', 'Cab interior', 'Hour meter', 'Undercarriage'];
    $('[data-ugallery]').innerHTML = '<div class="carousel-track">' + shots.map(function (s, i) { return '<div class="carousel-item"><div class="wf-placeholder">Photo ' + (i + 1) + ' of ' + u.photos + ' · ' + s + '</div></div>'; }).join('') + '</div>' +
      '<div class="carousel-controls"><button type="button" class="carousel-arrow" data-dir="prev" aria-label="Previous photo">‹</button><button type="button" class="carousel-arrow" data-dir="next" aria-label="Next photo">›</button></div><div class="carousel-indicators" style="padding-top:.75rem"></div>';
    if (window.WF) window.WF.initCarousels();
    $('[data-uthumbs]').innerHTML = shots.map(function (s) { return '<div class="wf-placeholder">' + s + '</div>'; }).join('') + '<div class="wf-placeholder">+' + (u.photos - shots.length) + ' more</div>';
    $('[data-u="fam"]').textContent = 'Used ' + u.fam.toLowerCase().replace(/s$/, '');
    $('[data-u="name"]').textContent = 'Cat ' + u.name + ', ' + u.year;
    $('[data-u="badges"]').innerHTML = '<a class="badge tier" href="' + MT.rel('pages/used.html') + '#tiers-h">' + t.name + '</a>' + MT.badge({ s: u.s, branch: u.s === 'sold' ? null : u.branch });
    $('[data-u="facts"]').innerHTML = '<dt>Year</dt><dd>' + u.year + '</dd><dt>Hours</dt><dd>' + MT.num(u.hrs) + '</dd><dt>Serial</dt><dd>' + u.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-8) + ' <span class="badge sample">sample</span></dd><dt>Branch</dt><dd>' + esc(b.name) + '</dd><dt>Last service</dt><dd>' + MT.num(u.hrs - 120) + ' hours</dd>';
    $('[data-u="price"]').innerHTML = 'Price band <strong>EGP ' + u.band[0] + 'm to ' + u.band[1] + 'm</strong> <span class="badge sample">sample</span>, depending on attachments and warranty.';
    $('[data-u="wa"]').setAttribute('href', MT.wa('Hello Mantrac, I\'m interested in the used Cat ' + u.name + ' (' + u.year + ', ' + MT.num(u.hrs) + ' hours) at ' + b.city + '.'));
    $('[data-u="cover"]').innerHTML = '<h2>What ' + t.name + ' covers</h2><p>' + t.cover + '</p><p class="muted">' + t.limits + '</p><p><a href="' + MT.rel('pages/used.html') + '#tiers-h">Compare the three tiers</a></p>';
    var rows = [['Engine', 'Good', 'Oil sample within limits'], ['Hydraulics', 'Good', 'No leaks found; pump pressures in range'], ['Undercarriage', 'Serviceable', 'Track links at about 55% remaining'], ['Bucket and linkage', 'Serviceable', 'Pins and bushes within tolerance; teeth replaced'], ['Cab and electrics', 'Good', 'AC working; monitor shows no active codes'], ['Structures', 'Good', 'No cracks found in boom or stick']];
    $('[data-u="inspection"]').innerHTML = rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td><strong>' + r[1] + '</strong></td><td>' + r[2] + '</td></tr>'; }).join('');
    $('[data-u="view-where"]').textContent = 'Viewings are at ' + b.name + ', Sunday to Thursday, 8:30 to 16:30.';
    var add = $('[data-u="add"]');
    if (u.s === 'sold') { add.disabled = true; add.textContent = 'Sold'; }
    add.addEventListener('click', function () { addUsed(u.id); });
    $('#view-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(this)) return;
      var d = $('[data-view-done]'); d.hidden = false;
      d.innerHTML = '<strong>Viewing requested, reference ' + MT.ref('VW') + '.</strong> ' + esc(b.name) + ' will confirm a time by WhatsApp before ' + MT.date($('#v-date').value) + '.';
    });
  }

  /* === 2c Rental ========================================================= */
  function rental() {
    var from = $('#r-from'), to = $('#r-to'), fam = $('#r-fam'), free = $('#r-free');
    from.value = MT.get('r-from', '2026-10-05'); to.value = MT.get('r-to', '2026-10-16');
    var fams = MT.rental.map(function (r) { return r.fam; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    fam.innerHTML = '<option value="">All types</option>' + fams.map(function (f) { return '<option>' + f + '</option>'; }).join('');
    function overlaps(r, a, c) { return r.booked.some(function (bk) { return !(c < bk[0] || a > bk[1]); }); }
    function draw() {
      var a = from.value, c = to.value, err = $('[data-rent-error]');
      if (!a || !c || c < a) { err.hidden = false; $('[data-rental]').innerHTML = ''; $('[data-rsummary]').textContent = ''; return; }
      err.hidden = true; MT.set('r-from', a); MT.set('r-to', c);
      var days = Math.round((new Date(c) - new Date(a)) / 864e5) + 1, weeks = Math.floor(days / 7), rest = days % 7;
      var near = MT.nearest();
      var list = MT.rental.filter(function (r) { return (!fam.value || r.fam === fam.value) && (!free.checked || !overlaps(r, a, c)); });
      list.sort(function (x, y) { return (overlaps(x, a, c) ? 1 : 0) - (overlaps(y, a, c) ? 1 : 0) || (near ? (x.branch === near.id ? -1 : 0) - (y.branch === near.id ? -1 : 0) : 0); });
      $('[data-rsummary]').innerHTML = '<strong>' + list.length + '</strong> machines · ' + days + ' days, ' + MT.date(a) + ' to ' + MT.date(c) + (near ? ' · nearest branch ' + esc(near.city) : '');
      $('[data-rental]').innerHTML = list.length ? list.map(function (r) {
        var busy = overlaps(r, a, c), cost = weeks * r.week + Math.min(rest * r.day, r.week), b = MT.branch(r.branch);
        var bk = r.booked.map(function (x) { return MT.date(x[0]).replace(/ 2026/, '') + ' to ' + MT.date(x[1]).replace(/ 2026/, ''); }).join('; ');
        return '<article class="mcard"><div class="wf-placeholder">Photo ' + esc(r.name) + '</div><div class="mcard-body"><span class="mcard-cat">' + esc(r.fam) + ' · built ' + r.year + '</span><h3>Cat ' + esc(r.name) + '</h3>' +
          MT.badge({ s: busy ? 'booked' : 'free' }) + (busy ? '<small>Booked ' + bk + '</small>' : '') +
          '<dl class="specs"><div><dt>Day rate</dt><dd>' + MT.egp(r.day) + '</dd></div><div><dt>Week rate</dt><dd>' + MT.egp(r.week) + '</dd></div><div><dt>Your ' + days + ' days</dt><dd>' + MT.egp(cost) + '</dd></div><div><dt>From</dt><dd>' + esc(b.city) + '</dd></div></dl>' +
          '<span class="badge sample">sample rates, before delivery and VAT</span></div><div class="mcard-actions">' +
          '<button type="button" class="btn btn-sm" data-rent="' + r.id + '"' + (busy ? ' disabled' : '') + '>' + (busy ? 'Not free for these dates' : 'Request booking') + '</button></div></article>';
      }).join('') : '<div class="empty-state"><p><strong>Nothing free for these dates.</strong></p><p>Try other dates, or ask us and we\'ll look across branches and the Cat Rentals fleet.</p></div>';
    }
    [from, to, fam, free].forEach(function (el) { el.addEventListener('change', draw); });
    document.addEventListener('mt:gov', draw);
    $('[data-rental]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rent]'); if (!b) return;
      var r = MT.rental.filter(function (x) { return x.id === b.getAttribute('data-rent'); })[0];
      MT.addToBasket({ key: 'rent-' + r.id + '-' + from.value, type: 'Rental', id: r.id, name: 'Rent Cat ' + r.name, detail: MT.date(from.value) + ' to ' + MT.date(to.value) + ' · from ' + MT.branch(r.branch).city });
    });
    draw();
  }

  /* === 2d Sell =========================================================== */
  function sell() {
    $('#s-photos').addEventListener('change', function () {
      var n = this.files.length;
      $('[data-photo-count]').textContent = n ? n + ' photo' + (n > 1 ? 's' : '') + ' selected' + (n > 10 ? '. Only the first 10 will be sent.' : '.') : 'Up to 10 photos.';
    });
    $('#sell-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(this)) return;
      var near = MT.nearest(), d = $('[data-sell-done]');
      this.hidden = true; d.hidden = false;
      d.innerHTML = '<h2>Thank you, ' + esc($('#s-name').value.split(' ')[0]) + '</h2><p>Your valuation request for the ' + esc($('#s-make').value + ' ' + $('#s-model').value) + ' (' + esc($('#s-year').value) + ', ' + MT.num($('#s-hrs').value) + ' hours) has reference <strong>' + MT.ref('VAL') + '</strong>.</p><p>The used equipment team' + (near ? ' at ' + esc(near.name) : '') + ' will call ' + esc($('#s-mob').value) + ' within two working days.</p><p><a href="' + MT.rel('pages/used.html') + '">Browse used machines</a></p>';
      d.focus();
    });
  }

  /* === 3 Enquiry ========================================================= */
  function enquiry() {
    var list = $('[data-basket]'), need = $('#e-need');
    need.innerHTML = '<option value="">Choose</option>' + MT.needs.map(function (n) { return '<option>' + n + '</option>'; }).join('');
    function team(items) {
      var near = MT.nearest(), types = items.map(function (i) { return i.type; });
      var base = near ? near : null;
      var t = 'Mantrac sales team';
      if (types.length && types.every(function (x) { return x === 'Rental'; })) t = 'Rental desk';
      else if (types.length && types.every(function (x) { return x === 'Used machine'; })) t = 'Used equipment team';
      else if (need.value === 'Service or repair') t = 'Service team';
      else if (need.value === 'Parts') t = 'Parts counter';
      else if (need.value === 'Finance') t = 'Finance team';
      else if (near) t = near.lines.machines;
      return { team: t, branch: base };
    }
    function waText(items) {
      var s = 'Hello Mantrac, please quote for:';
      items.forEach(function (i) { s += '\n- ' + (i.qty > 1 ? i.qty + ' x ' : '') + i.name + (i.detail ? ' (' + i.detail + ')' : ''); });
      if (!items.length) s = 'Hello Mantrac, I\'d like a quote.';
      if (MT.gov()) s += '\nSite: ' + MT.gov();
      return s;
    }
    function autoNeed(items) {
      if (need.value) return;
      var t = items.map(function (i) { return i.type; });
      if (t.indexOf('New machine') > -1) need.value = 'A new machine';
      else if (t.indexOf('Used machine') > -1) need.value = 'A used machine';
      else if (t.indexOf('Rental') > -1) need.value = 'Rental';
    }
    function draw() {
      var items = MT.basket();
      $('[data-basket-empty]').hidden = items.length > 0;
      list.innerHTML = items.map(function (i, n) {
        return '<li class="basket-item"><div class="wf-placeholder">' + esc(i.type) + '</div><div><strong>' + esc(i.name) + '</strong><br><small>' + esc(i.type) + (i.detail ? ' · ' + esc(i.detail) : '') + '</small></div>' +
          '<div class="row" style="flex-wrap:nowrap"><label class="sr-only" for="q' + n + '">Quantity of ' + esc(i.name) + '</label><input class="qty" type="number" min="1" max="20" id="q' + n + '" value="' + (i.qty || 1) + '" data-qty="' + n + '"' + (i.type === 'Used machine' ? ' disabled' : '') + '>' +
          '<button type="button" class="link-btn" data-remove="' + n + '" aria-label="Remove ' + esc(i.name) + '">Remove</button></div></li>';
      }).join('');
      autoNeed(items);
      var r = team(items);
      $('[data-route-hint]').innerHTML = r.branch ? 'We\'ll send this to the <strong>' + esc(r.team) + '</strong> at ' + esc(r.branch.name) + '.' : 'We use this to send your enquiry to the nearest branch.';
      $('[data-wa-basket]').setAttribute('href', MT.wa(waText(items)));
      MT.setDockText(waText(items));
    }
    list.addEventListener('change', function (e) {
      var q = e.target.closest('[data-qty]'); if (!q) return;
      var items = MT.basket(); items[+q.getAttribute('data-qty')].qty = Math.max(1, parseInt(q.value, 10) || 1); MT.saveBasket(items);
    });
    list.addEventListener('click', function (e) {
      var r = e.target.closest('[data-remove]'); if (!r) return;
      var items = MT.basket(), gone = items.splice(+r.getAttribute('data-remove'), 1)[0]; MT.saveBasket(items);
      MT.toast('Removed ' + esc(gone.name) + '.');
    });
    $('[data-extras]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-extra]'); if (!b) return;
      var p = b.getAttribute('data-extra').split('|');
      MT.addToBasket({ key: 'x-' + p[0], type: p[1], name: p[0] });
    });
    need.addEventListener('change', draw);
    document.addEventListener('mt:basket', draw);
    document.addEventListener('mt:gov', draw);
    $('#enq-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(this)) return;
      var items = MT.basket(), r = team(items), ref = MT.ref('MQ');
      var c = $('[data-confirm]');
      $('[data-form-panel]').hidden = true; c.hidden = false;
      c.innerHTML = '<h2>Enquiry sent</h2><p>Reference <strong>' + ref + '</strong></p>' +
        '<p>Your enquiry has gone to the <strong>' + esc(r.team) + '</strong>' + (r.branch ? ' at ' + esc(r.branch.name) : '') + '. They\'ll reply to ' + esc($('#e-mob').value) + ' within four working hours, Sunday to Thursday, 8:30 to 16:30.</p>' +
        (items.length ? '<h3>What you asked about</h3><ul class="review-steps">' + items.map(function (i) { return '<li>' + (i.qty > 1 ? i.qty + ' × ' : '') + esc(i.name) + (i.detail ? ' <small>(' + esc(i.detail) + ')</small>' : '') + '</li>'; }).join('') + '</ul>' : '') +
        '<p class="row" style="margin-top:1rem"><a class="btn btn-secondary" href="' + MT.wa('Hello Mantrac, following up on enquiry ' + ref + '.', r.branch ? r.branch.wa : null) + '" target="_blank" rel="noopener">Follow up on WhatsApp</a><a class="btn btn-secondary" href="' + MT.rel('index.html') + '">Back to overview</a></p>' +
        '<p class="wf-note query" data-note="5" style="margin-top:1rem"><span class="wf-note-label">Open question</span><strong>Q:</strong> What reply time can each team keep? Four working hours is a placeholder (R33).</p>';
      MT.saveBasket([]);
      c.focus();
    });
    draw();
  }

  /* === 4a Offers ========================================================= */
  function offers() {
    var kind = '';
    function daysLeft(o) { return Math.round((new Date(o.end) - new Date(MT.today)) / 864e5); }
    function draw() {
      var showExp = $('#o-expired').checked;
      var list = MT.offers.filter(function (o) { return (!kind || o.kind === kind) && o.start <= MT.today && (showExp || o.end >= MT.today); });
      list.sort(function (a, b) { return a.end < b.end ? -1 : 1; });
      $('[data-offers]').innerHTML = list.length ? list.map(function (o) {
        var d = daysLeft(o), exp = d < 0;
        return '<article class="offer' + (exp ? ' expired' : '') + '"><div class="wf-placeholder">Offer image</div><div class="offer-body"><span class="badge tier" style="justify-self:start">' + o.kind + '</span>' +
          '<h3 class="card-title">' + esc(o.title) + '</h3><p class="offer-dates">' + MT.date(o.start) + ' to ' + MT.date(o.end) + ' · ' + (exp ? 'Ended' : d === 0 ? 'Ends today' : 'Ends in ' + d + ' day' + (d === 1 ? '' : 's')) + '</p>' +
          '<p class="card-text">' + esc(o.detail) + '</p><p class="card-text"><strong>Applies to:</strong> ' + esc(o.applies) + '</p>' +
          '<p class="row" style="margin:0">' + (exp ? '' : '<button type="button" class="btn btn-sm" data-offer="' + o.id + '">Ask about this offer</button>') + '<a href="#">Terms</a></p></div></article>';
      }).join('') : '<div class="empty-state" style="grid-column:1/-1"><p><strong>No ' + (kind ? kind.toLowerCase() + ' ' : '') + 'offers at the moment.</strong></p><p>Sign up below and we\'ll tell you when there are.</p><a class="btn btn-secondary" href="#nl-h">Get offers by email or WhatsApp</a></div>';
    }
    $('[data-offer-kinds]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-kind]'); if (!b) return;
      kind = b.getAttribute('data-kind');
      $$('[data-offer-kinds] button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      draw();
    });
    $('#o-expired').addEventListener('change', draw);
    $('[data-offers]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-offer]'); if (!b) return;
      var o = MT.offers.filter(function (x) { return x.id === b.getAttribute('data-offer'); })[0];
      MT.addToBasket({ key: 'offer-' + o.id, type: 'Offer', name: o.title, detail: 'Until ' + MT.date(o.end) });
    });
    $('#nl-ch').addEventListener('change', function () {
      var wa = this.value === 'WhatsApp', to = $('#nl-to');
      $('[data-nl-label]').textContent = wa ? 'Mobile number' : 'Email address';
      to.type = wa ? 'tel' : 'email'; to.setAttribute('autocomplete', wa ? 'tel' : 'email');
    });
    $('#nl-form').addEventListener('submit', function (e) {
      e.preventDefault(); if (!MT.validate(this)) return;
      var d = $('[data-nl-done]'); d.hidden = false;
      d.innerHTML = '<strong>Signed up.</strong> We\'ll send offers to ' + esc($('#nl-to').value) + ' by ' + esc($('#nl-ch').value) + ', about once a month. ' + ($('#nl-ch').value === 'Email' ? 'Check your inbox to confirm.' : 'Reply STOP to any message to unsubscribe.');
    });
    draw();
  }

  /* === 4b Finance ======================================================== */
  function finance() {
    var sel = $('#f-machine'), price = $('#f-price'), dep = $('#f-dep'), term = 36;
    sel.innerHTML = MT.machines.map(function (m) { return '<option value="' + m.id + '">Cat ' + m.name + ' (' + m.size.toLowerCase() + ' excavator)</option>'; }).join('') + '<option value="">Another machine</option>';
    var pre = MT.param('model'); sel.value = findMachine(pre) && !findMachine(pre).legacy ? pre : '320-gc';
    function setPrice() { var m = findMachine(sel.value); if (m) price.value = m.from; }
    function calc() {
      var p = parseFloat(price.value) || 0, d = parseInt(dep.value, 10), rate = MT.finance.rates[term];
      var loan = p * (1 - d / 100), r = rate / 100 / 12;
      var monthly = r ? loan * r / (1 - Math.pow(1 + r, -term)) : loan / term;
      $('[data-dep-out]').textContent = d + '% (' + MT.egp(p * d / 100) + ')';
      $('[data-fin-monthly]').textContent = MT.egp(monthly) + ' a month';
      $('[data-fin-kv]').innerHTML = '<dt>Deposit</dt><dd>' + MT.egp(p * d / 100) + '</dd><dt>Amount financed</dt><dd>' + MT.egp(loan) + '</dd><dt>Term</dt><dd>' + term + ' months</dd><dt>Rate</dt><dd>' + (rate ? rate + '% a year <span class="badge sample">sample</span>' : '0% (offer)') + '</dd><dt>Total payable</dt><dd>' + MT.egp(p * d / 100 + monthly * term) + '</dd>';
      return { p: p, d: d, monthly: monthly };
    }
    sel.addEventListener('change', function () { setPrice(); calc(); });
    [price, dep].forEach(function (el) { el.addEventListener('input', calc); });
    $('[data-terms]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-term]'); if (!b) return;
      term = parseInt(b.getAttribute('data-term'), 10);
      $$('[data-terms] button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      calc();
    });
    $('[data-fin-send]').addEventListener('click', function () {
      var c = calc(), m = findMachine(sel.value);
      MT.addToBasket({ key: 'fin-' + sel.value + '-' + term + '-' + c.d, type: 'Finance', name: 'Finance for ' + (m ? 'Cat ' + m.name : 'a machine'), detail: c.d + '% deposit, ' + term + ' months, about ' + MT.egp(c.monthly) + ' a month' });
    });
    setPrice(); calc();

    /* Running costs (R40) */
    function run() {
      var h = +$('#c-hrs').value, fuel = +$('#c-fuel').value, burn = +$('#c-burn').value, maint = +$('#c-maint').value, fs = +$('#c-fs').value / 100, ms = +$('#c-ms').value / 100;
      var fSave = h * burn * fs * fuel, mSave = h * maint * ms;
      $('[data-hrs-out]').textContent = MT.num(h);
      $('[data-run-total]').textContent = MT.egp(fSave + mSave);
      $('[data-run-kv]').innerHTML = '<dt>Fuel</dt><dd>' + MT.num(h * burn * fs) + ' litres, ' + MT.egp(fSave) + '</dd><dt>Maintenance</dt><dd>' + MT.egp(mSave) + '</dd><dt>Over five years</dt><dd>' + MT.egp((fSave + mSave) * 5) + '</dd>';
    }
    $$('#run-form input').forEach(function (el) { el.addEventListener('input', run); });
    $('[data-run-ask]').addEventListener('click', function () { MT.addToBasket({ key: 'new-426f2', type: 'New machine', name: 'Cat 426F2 backhoe loader', detail: 'From the running cost calculator' }); });
    run();
  }

  /* === 5a Branches ======================================================= */
  function cairoNow() {
    var d = new Date(Date.now() + 3 * 3600e3); /* Egypt summer time, UTC+3 */
    return { day: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes() };
  }
  function isOpen() { var n = cairoNow(); return n.day >= 0 && n.day <= 4 && n.mins >= 510 && n.mins < 990; }
  function branches() {
    var svcs = [];
    MT.branches.forEach(function (b) { b.services.forEach(function (s) { if (svcs.indexOf(s) < 0) svcs.push(s); }); });
    var svc = $('#b-svc');
    svc.innerHTML = '<option value="">Any service</option>' + svcs.sort().map(function (s) { return '<option>' + s + '</option>'; }).join('');
    var pre = MT.param('service'); if (pre && svcs.indexOf(pre) > -1) svc.value = pre;
    var active = null, map = $('[data-map]');
    MT.branches.forEach(function (b) {
      map.insertAdjacentHTML('beforeend', '<button type="button" class="pin" style="left:' + b.x + '%;top:' + b.y + '%" data-pin="' + b.id + '" aria-label="' + esc(b.name) + '">' + esc(b.city) + '</button>');
    });
    function draw() {
      var near = MT.nearest(), open = isOpen(), onlyOpen = $('#b-open').checked;
      var list = MT.branches.filter(function (b) { return (!svc.value || b.services.indexOf(svc.value) > -1) && (!onlyOpen || open); });
      if (near) list.sort(function (a, b) { return (a.id === near.id ? -1 : 0) - (b.id === near.id ? -1 : 0); });
      $('[data-bcount]').innerHTML = '<strong>' + list.length + '</strong> of ' + MT.branches.length + ' branches' + (svc.value ? ' with ' + esc(svc.value) : '') + (near ? ' · nearest to ' + esc(MT.gov()) + ': ' + esc(near.city) : '');
      var ids = list.map(function (b) { return b.id; });
      $$('[data-pin]', map).forEach(function (p) { var id = p.getAttribute('data-pin'); p.classList.toggle('dim', ids.indexOf(id) < 0); p.classList.toggle('active', id === active); });
      $('[data-blist]').innerHTML = list.length ? list.map(function (b) {
        return '<li class="branch' + (b.id === active ? ' active' : '') + '" id="br-' + b.id + '"><h3>' + esc(b.name) + (near && b.id === near.id ? ' <span class="badge tier">Nearest</span>' : '') + '</h3>' +
          '<p class="muted" style="margin:0">' + esc(b.address) + '</p><div class="svc-tags">' + b.services.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>' +
          '<p style="margin:0 0 .5rem">' + (open ? '<span class="badge s-in">Open now · until 16:30</span>' : '<span class="badge s-reserved">Closed · opens Sunday to Thursday 8:30</span>') + '</p>' +
          '<p class="row" style="margin:0"><a href="tel:' + b.phone.replace(/\s/g, '') + '">' + esc(b.phone) + '</a><a href="' + MT.wa('Hello ' + b.name + ', ', b.wa) + '" target="_blank" rel="noopener">WhatsApp</a><a href="https://www.google.com/maps/search/' + encodeURIComponent(b.name + ' ' + b.city + ' Egypt') + '" target="_blank" rel="noopener">Directions</a><a href="' + MT.rel('pages/book-service.html') + '?branch=' + b.id + '">Book a service here</a></p></li>';
      }).join('') : '<li class="empty-state">No branches match. <button type="button" class="link-btn" data-bclear>Clear filters</button></li>';
    }
    map.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pin]'); if (!p) return;
      active = p.getAttribute('data-pin'); draw();
      var li = document.getElementById('br-' + active); if (li) li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    $('[data-blist]').addEventListener('click', function (e) {
      if (e.target.closest('[data-bclear]')) { svc.value = ''; $('#b-open').checked = false; draw(); return; }
      var li = e.target.closest('.branch'); if (li && !e.target.closest('a')) { active = li.id.slice(3); draw(); }
    });
    [svc, $('#b-open')].forEach(function (el) { el.addEventListener('change', draw); });
    document.addEventListener('mt:gov', draw);
    /* Parts help */
    var counters = MT.branches.filter(function (b) { return b.services.indexOf('Parts counter') > -1; });
    $('[data-counters]').textContent = counters.length + ' branches have a parts counter: ' + counters.map(function (b) { return b.city; }).join(', ') + '.';
    $('[data-parts-wa]').setAttribute('href', MT.wa('Hello Mantrac parts team, I need parts for my machine. Serial number: '));
    $('[data-show-counters]').addEventListener('click', function () {
      svc.value = 'Parts counter'; draw();
      var t = $('[data-tab="t-branches"]'); if (t) t.click();
    });
    $('#parts-form').addEventListener('submit', function (e) {
      e.preventDefault(); if (!MT.validate(this)) return;
      var lines = $('#p-list').value.trim().split(/\n+/).length;
      MT.addToBasket({ key: 'parts-' + Date.now(), type: 'Parts', name: 'Parts list (' + lines + ' line' + (lines > 1 ? 's' : '') + ')', detail: $('#p-serial').value ? 'Serial ' + $('#p-serial').value : 'No serial given' });
      this.reset();
    });
    draw();
  }

  /* === 5b Book a service ================================================= */
  function bookService() {
    var step = 0, steps = $$('[data-bstep]');
    $('#k-models').innerHTML = MT.machines.concat(MT.legacy).map(function (m) { return '<option value="' + m.name + '">'; }).join('') + ['950 GC', '426F2', 'D6R', '140K', '966H'].map(function (n) { return '<option value="' + n + '">'; }).join('');
    var model = MT.param('model'); var fm = model && findMachine(model); if (fm) $('#k-model').value = fm.name;
    var pb = MT.param('branch'); var forced = pb && MT.branch(pb);
    if (forced && !MT.gov()) { var g = Object.keys(MT.governorates).filter(function (k) { return MT.governorates[k] === forced.id; })[0]; if (g) { MT.setGov(g); } }
    var jobs = [['Scheduled service', '250, 500, 1,000 hours…'], ['Breakdown', 'The machine has stopped'], ['Repair', 'Working, but something is wrong'], ['Oil sample (SOS)', 'Collection and lab results'], ['Inspection', 'Before buying, selling or a contract']];
    $('[data-jobs]').innerHTML = jobs.map(function (j, i) { return '<div class="choice"><input type="radio" name="k-job" id="job' + i + '" value="' + j[0] + '"><label for="job' + i + '">' + j[0] + '<small>' + j[1] + '</small></label></div>'; }).join('');
    function branch() { return forced || MT.nearest(); }
    function hint() { var b = branch(); $('[data-k-branch]').textContent = b ? 'Handled by ' + b.name + '.' : 'We\'ll send this to the nearest workshop.'; }
    function show() {
      steps.forEach(function (s, i) { s.hidden = i !== step; });
      $$('[data-bsteps] li').forEach(function (li, i) { li.className = i < step ? 'done' : i === step ? 'current' : ''; });
      $('[data-bback]').hidden = step === 0;
      $('[data-bnext]').textContent = step === 3 ? 'Send booking request' : 'Next';
      if (step === 3) {
        var job = ($('input[name="k-job"]:checked') || {}).value, where = $('input[name="k-where"]:checked').value, b = branch();
        $('[data-review]').innerHTML = '<h3>Check your request</h3><dl class="kv"><dt>Machine</dt><dd>Cat ' + esc($('#k-model').value) + ', ' + MT.num($('#k-hrs').value) + ' hours</dd><dt>Needed</dt><dd>' + esc(job) + '</dd><dt>Where</dt><dd>' + esc(where) + (where === 'On site' && $('#k-site').value ? ', ' + esc($('#k-site').value) : '') + '</dd><dt>When</dt><dd>' + MT.date($('#k-date').value) + ', ' + esc($('#k-time').value.toLowerCase()) + '</dd><dt>Workshop</dt><dd>' + (b ? esc(b.name) : 'Nearest') + '</dd></dl>';
      }
      var first = steps[step].querySelector('input,select,textarea'); if (first && step) first.focus();
    }
    $('[data-jobs]').addEventListener('change', function () {
      var v = ($('input[name="k-job"]:checked') || {}).value;
      $('[data-breakdown]').hidden = v !== 'Breakdown'; $('[data-job-error]').hidden = true;
    });
    $$('input[name="k-where"]').forEach(function (r) { r.addEventListener('change', function () { $('[data-site-field]').hidden = this.value !== 'On site'; }); });
    document.addEventListener('mt:gov', hint);
    $('[data-bback]').addEventListener('click', function () { step--; show(); });
    $('#book-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(steps[step])) return;
      if (step === 1 && !$('input[name="k-job"]:checked')) { $('[data-job-error]').hidden = false; return; }
      if (step < 3) { step++; show(); return; }
      var b = branch(), job = $('input[name="k-job"]:checked').value, ref = MT.ref('SV'), d = $('[data-bdone]');
      this.hidden = true; $('[data-bsteps]').hidden = true; d.hidden = false;
      d.innerHTML = '<h2>Booking request sent</h2><p>Reference <strong>' + ref + '</strong></p><p>' + (b ? esc(b.name) : 'Your nearest workshop') + ' will confirm the ' + esc(job.toLowerCase()) + ' for your Cat ' + esc($('#k-model').value) + ' on ' + MT.date($('#k-date').value) + ' by calling ' + esc($('#k-mob').value) + (job === 'Breakdown' ? ' within the hour during working hours. For anything urgent, call 19266.' : ' within one working day.') + '</p>' +
        '<p class="row"><a class="btn btn-secondary" href="' + MT.wa('Hello Mantrac, about service booking ' + ref + '.', b ? b.wa : null) + '" target="_blank" rel="noopener">WhatsApp the workshop</a><a class="btn btn-secondary" href="' + MT.rel('index.html') + '">Back to overview</a></p>';
      d.focus();
    });
    hint(); show();
  }

  /* --- Router ------------------------------------------------------------- */
  var PAGES = { machines: machines, machine: machine, compare: compare, used: used, 'used-machine': usedMachine, rental: rental, sell: sell, enquiry: enquiry, offers: offers, finance: finance, branches: branches, 'book-service': bookService };
  MT.PAGES = PAGES;
  document.addEventListener('DOMContentLoaded', function () {
    initGovSelects();
    var p = document.body.getAttribute('data-page');
    if (PAGES[p]) PAGES[p]();
  });
})();

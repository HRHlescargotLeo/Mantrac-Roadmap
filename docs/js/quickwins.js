/* ==========================================================================
   quickwins.js — the Quick wins tab (v0.3).

   MT.quickWins lists the small, self-contained changes from the phase 1
   review (every idea sized as small effort). Each has its own demo on
   pages/quick-wins.html (article#qw-<key>) and a card on the landing page's
   Quick wins tab. Titles here must match the article headings.

   No effort, cost or time estimates appear anywhere in this tab, by design.
   ========================================================================== */

(function () {
  'use strict';
  var MT = window.MT = window.MT || {};

  MT.qwThemes = {
    find: 'Finding the right machine',
    stock: 'Used and rental',
    ask: 'Enquiries and contact',
    offers: 'Offers and finance',
    service: 'Branches, service and parts',
    content: 'Facts and content',
    fix: 'Privacy and housekeeping'
  };

  /* [key, theme, title, one line for the landing card, idea number] */
  MT.quickWins = [
    ['range', 'find', 'Current range first', 'Older models move to their own list, so buyers compare machines they can order.', 1],
    ['commas', 'find', 'Commas for thousands', '3,050 kg rather than "3.050 kg", and Arabic numbers in Arabic.', 3],
    ['compare', 'find', 'A compare tray you can see', 'Ticking "Compare" shows what you have picked and how to compare it.', 6],
    ['stock', 'find', 'Stock status that agrees', 'One set of stock words, shown the same way on the card and the product page.', 7],
    ['cart', 'find', 'Add to quote, not add to cart', 'The button says what it does and can collect more than one machine.', 8],
    ['app', 'stock', 'Retire the app panel', 'The app promoted on three pages is no longer in either store.', 12],
    ['cert', 'stock', 'One name for each used tier', 'Certification badges that use one name each and explain themselves.', 14],
    ['rentcat', 'stock', 'Link the Cat Rentals store', 'Mantrac already has a rental storefront. The rental page could point to it.', 15],
    ['claims', 'stock', 'Rental copy that matches the stock', 'An introduction that describes what can be arranged rather than what is on the page.', 17],
    ['form', 'ask', 'A five-field contact form', 'From 11 fields with placeholders as labels to five with visible labels.', 20],
    ['lists', 'ask', 'Clean dropdown lists', 'No duplicates or typos, in the same order in English and Arabic.', 21],
    ['wa', 'ask', 'WhatsApp that knows the page', 'The message arrives already saying which machine or branch it is about.', 25],
    ['dock', 'ask', 'One contact bar on mobile', 'Four floating widgets become one labelled bar at the bottom of the screen.', 26],
    ['tel', 'ask', 'A hotline link that dials', 'Check how 19266 is dialled from Egyptian mobiles and link to that.', 27],
    ['promo', 'offers', 'Promotions only when there are some', 'The page and the footer promise appear when there are offers, and not otherwise.', 28],
    ['finfacts', 'offers', 'A finance page that names the options', 'Each way to pay, who it suits and what to prepare.', 31],
    ['parts', 'service', 'Parts: the right store, fewer groups', 'About eight groups instead of 29 categories, and three plain ways to buy.', 36],
    ['portal', 'service', 'My Mantrac in the header', 'Customer tools one click from every page instead of three levels down.', 37],
    ['names', 'service', 'Branch names spelt correctly', 'Abu Simbel and Marsa Alam, in English and Arabic.', 38],
    ['facts', 'content', 'One set of facts', 'Countries, branches and technicians stored once and used everywhere.', 39],
    ['unatrac', 'content', 'Mantrac Egypt, not Unatrac', 'Copy borrowed from another group company, corrected.', 40],
    ['dates', 'content', 'Real dates on news', 'Every story is dated 09 June 2025 today, so sorting by date does nothing.', 41],
    ['proof', 'content', 'A proofreading pass', 'Spelling, a copyright year that updates itself and titles that are not cut off.', 45],
    ['consent', 'fix', 'Consent before tracking', 'Marketing tags wait until the visitor agrees, in English and Arabic.', 47],
    ['newsletter', 'fix', 'A sign-up that asks permission', 'A labelled field, a consent box and a privacy link.', 48],
    ['hreflang', 'fix', 'Language tags that point somewhere', 'Search engines are told about the Arabic page and nothing that does not exist.', 52],
    ['share', 'fix', 'Pictures when links are shared', 'A preview image, title and description when a page is shared on WhatsApp or LinkedIn.', 54]
  ];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return MT.esc ? MT.esc(s) : String(s); };
  var fmt = function (n, lang, western) {
    var loc = lang === 'ar' ? (western ? 'ar-EG-u-nu-latn' : 'ar-EG') : 'en-GB';
    return Number(n).toLocaleString(loc);
  };

  /* --- Landing page: tab memory and Quick wins cards ---------------------- */
  function landing() {
    var host = $('[data-qw-cards]');
    if (host) {
      var html = '';
      Object.keys(MT.qwThemes).forEach(function (t) {
        var items = MT.quickWins.filter(function (q) { return q[1] === t; });
        html += '<section class="qw-group" aria-labelledby="qwg-' + t + '"><h3 id="qwg-' + t + '">' + esc(MT.qwThemes[t]) + '</h3><ul class="qw-cards">';
        items.forEach(function (q) {
          var n = MT.quickWins.indexOf(q) + 1;
          html += '<li><a class="qw-card" href="' + MT.rel('pages/quick-wins.html') + '?item=' + q[0] + '"><span class="qw-n">' + n + '</span><strong>' + esc(q[2]) + '</strong><span>' + esc(q[3]) + '</span></a></li>';
        });
        html += '</ul></section>';
      });
      host.innerHTML = html;
    }
    var tabs = $$('.tabs[data-landing-tabs] .tab');
    if (!tabs.length) return;
    var want = null;
    try { want = new URLSearchParams(window.location.search).get('tab'); } catch (e) { want = null; }
    if (!want && window.location.hash === '#quick-wins') want = 'quick-wins';
    want = want || MT.get('landing-tab', null);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { MT.set('landing-tab', t.getAttribute('data-name')); });
      if (want && t.getAttribute('data-name') === want) t.click();
    });
  }

  /* --- Quick wins page: one at a time or all ------------------------------ */
  function page() {
    var arts = $$('article.qw');
    if (!arts.length) return;
    var keys = MT.quickWins.map(function (q) { return q[0]; });
    arts.forEach(function (a) {
      var key = a.id.replace('qw-', '');
      if (keys.indexOf(key) < 0 && window.console) console.warn('Quick win without data:', key);
    });
    var jump = $('#qw-jump');
    jump.innerHTML = Object.keys(MT.qwThemes).map(function (t) {
      return '<optgroup label="' + esc(MT.qwThemes[t]) + '">' + MT.quickWins.filter(function (q) { return q[1] === t; }).map(function (q) {
        return '<option value="' + q[0] + '">' + (MT.quickWins.indexOf(q) + 1) + '. ' + esc(q[2]) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');

    /* Number and label each article from the data, add prev/next. */
    arts.forEach(function (a) {
      var key = a.id.replace('qw-', ''), i = keys.indexOf(key), q = MT.quickWins[i];
      var kick = $('.qw-kicker', a);
      if (kick && q) kick.innerHTML = '<span class="qw-n">' + (i + 1) + '</span>' + esc(MT.qwThemes[q[1]]) + ' <span class="muted">· ' + (i + 1) + ' of ' + keys.length + '</span>';
      var step = document.createElement('nav');
      step.className = 'qw-step';
      step.setAttribute('aria-label', 'Previous and next quick win');
      var pv = MT.quickWins[i - 1], nx = MT.quickWins[i + 1];
      step.innerHTML = (pv ? '<a class="btn btn-secondary btn-sm" href="?item=' + pv[0] + '" data-go="' + pv[0] + '">← ' + esc(pv[2]) + '</a>' : '<span></span>') +
        (nx ? '<a class="btn btn-sm" href="?item=' + nx[0] + '" data-go="' + nx[0] + '">' + esc(nx[2]) + ' →</a>' : '<a class="btn btn-sm" href="' + MT.rel('index.html') + '?tab=quick-wins">Back to all quick wins</a>');
      a.appendChild(step);
    });

    var mode = MT.get('qw-mode', 'one');
    var current = MT.param('item');
    if (keys.indexOf(current) < 0) current = keys[0];

    function show(key, scroll) {
      current = key;
      MT.remember('item', key);
      jump.value = key;
      var i = keys.indexOf(key);
      $('[data-qw-pos]').textContent = (i + 1) + ' of ' + keys.length;
      arts.forEach(function (a) { a.classList.toggle('is-current', a.id === 'qw-' + key); });
      if (mode === 'all' && scroll) {
        var el = document.getElementById('qw-' + key);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (scroll) {
        $('.qw-bar').scrollIntoView({ block: 'start' });
      }
      try { history.replaceState(null, '', '?item=' + key); } catch (e) { /* file:// */ }
    }
    function setMode(m) {
      mode = m; MT.set('qw-mode', m);
      document.body.classList.toggle('qw-all', m === 'all');
      $$('[data-qw-mode] button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
    }
    $$('[data-qw-mode] button').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); show(current, true); }); });
    jump.addEventListener('change', function () { show(jump.value, true); });
    $('[data-qw-prev]').addEventListener('click', function () { var i = keys.indexOf(current); if (i > 0) show(keys[i - 1], true); });
    $('[data-qw-next]').addEventListener('click', function () { var i = keys.indexOf(current); if (i < keys.length - 1) show(keys[i + 1], true); });
    document.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) { e.preventDefault(); show(go.getAttribute('data-go'), true); }
    });
    document.addEventListener('keydown', function (e) {
      if (mode !== 'one' || /INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) return;
      if (e.key === 'ArrowRight') $('[data-qw-next]').click();
      if (e.key === 'ArrowLeft') $('[data-qw-prev]').click();
    });

    /* Today / Proposed switch, used below 1024px. */
    arts.forEach(function (a) {
      a.setAttribute('data-show', 'proposed');
      $$('.qw-switch button', a).forEach(function (b) {
        b.addEventListener('click', function () {
          a.setAttribute('data-show', b.getAttribute('data-v'));
          $$('.qw-switch button', a).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        });
      });
    });

    setMode(mode);
    show(current, false);
    demos();
  }

  /* --- The individual demos ----------------------------------------------- */
  function demos() {
    /* 1 Current range first */
    var prevBtn = $('[data-range-toggle]');
    if (prevBtn) prevBtn.addEventListener('click', function () {
      var list = $('[data-range-prev]'), open = list.hidden;
      list.hidden = !open;
      prevBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* 2 Commas for thousands */
    var spec = $('[data-commas]');
    if (spec) {
      var st = { lang: 'en', units: 'metric', western: false };
      var L = {
        en: { w: 'Operating weight', d: 'Maximum digging depth', p: 'Net power', kg: 'kg', lb: 'lb', mm: 'mm', kw: 'kW', hp: 'hp' },
        ar: { w: 'الوزن التشغيلي', d: 'أقصى عمق للحفر', p: 'القدرة الصافية', kg: 'كجم', lb: 'رطل', mm: 'مم', kw: 'كيلوواط', hp: 'حصان' }
      };
      var draw = function () {
        var l = L[st.lang], us = st.units === 'us', f = function (n) { return fmt(n, st.lang, st.western); };
        var w = us ? f(6725) + ' ' + l.lb : f(3050) + ' ' + l.kg;
        var inches = 2710 / 25.4;
        var d = us ? (st.lang === 'ar' ? f(Math.floor(inches / 12)) + ' قدم ' + f(Math.round(inches % 12)) + ' بوصة' : Math.floor(inches / 12) + ' ft ' + Math.round(inches % 12) + ' in') : f(2710) + ' ' + l.mm;
        var p = us ? f(Math.round(17.6 * 1.341 * 10) / 10) + ' ' + l.hp : f(17.6) + ' ' + l.kw;
        var out = $('[data-commas-out]');
        out.setAttribute('dir', st.lang === 'ar' ? 'rtl' : 'ltr');
        out.setAttribute('lang', st.lang === 'ar' ? 'ar' : 'en');
        out.innerHTML = '<div><dt>' + l.p + '</dt><dd>' + p + '</dd></div><div><dt>' + l.w + '</dt><dd>' + w + '</dd></div><div><dt>' + l.d + '</dt><dd>' + d + '</dd></div>';
        $('[data-commas-digits]').hidden = st.lang !== 'ar';
      };
      $$('[data-commas] [data-set]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-set'), v = b.getAttribute('data-value');
          st[k] = v;
          $$('[data-commas] [data-set="' + k + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          draw();
        });
      });
      $('#cm-western').addEventListener('change', function () { st.western = this.checked; draw(); });
      draw();
    }

    /* 3 Compare tray */
    var cmp = $('[data-cmp]');
    if (cmp) {
      var tray = $('[data-cmp-tray]');
      var upd = function () {
        var picked = $$('input:checked', cmp).map(function (i) { return { id: i.value, name: i.getAttribute('data-name') }; });
        tray.hidden = !picked.length;
        $('[data-cmp-list]').innerHTML = picked.map(function (p) { return '<li>' + esc(p.name) + '</li>'; }).join('');
        var go = $('[data-cmp-go]');
        go.textContent = 'Compare ' + picked.length + ' model' + (picked.length === 1 ? '' : 's');
        go.setAttribute('href', MT.rel('pages/compare.html') + '?ids=' + picked.map(function (p) { return p.id; }).join(','));
        go.classList.toggle('is-off', picked.length < 2);
        $('[data-cmp-hint]').hidden = picked.length !== 1;
      };
      cmp.addEventListener('change', function (e) {
        if ($$('input:checked', cmp).length > 3) { e.target.checked = false; MT.toast('You can compare up to 3 models. Remove one first.'); }
        upd();
      });
      $('[data-cmp-clear]').addEventListener('click', function () { $$('input', cmp).forEach(function (i) { i.checked = false; }); upd(); });
    }

    /* 4 Stock status */
    var stk = $('[data-stock]');
    if (stk) {
      var drawStock = function (s) {
        var badge = MT.badge({ s: s, branch: s === 'in' || s === 'reserved' ? 'abu-rawash' : null, lead: '6 to 8 weeks' });
        $$('[data-stock-badge]').forEach(function (el) { el.innerHTML = badge; });
      };
      $$('[data-stock] button').forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-stock] button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          drawStock(b.getAttribute('data-s'));
        });
      });
      drawStock('in');
    }

    /* 5 Add to quote */
    $$('[data-qw-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-qw-add');
        var m = (MT.machines || []).filter(function (x) { return x.id === id; })[0];
        MT.addToBasket({ key: 'new-' + id, type: 'New machine', id: id, name: 'Cat ' + b.getAttribute('data-name') + ' excavator', detail: m && m.stock.s === 'in' ? 'In stock at ' + MT.branch(m.stock.branch).city : 'On order' });
        b.textContent = 'Added to quote';
      });
    });
    $$('[data-today-cart]').forEach(function (b) {
      b.addEventListener('click', function () { $('[data-today-cart-msg]').hidden = false; });
    });

    /* 6 App panel */
    $$('[data-store]').forEach(function (b) {
      b.addEventListener('click', function () { $('[data-store-msg]').hidden = false; $('[data-store-msg]').querySelector('strong').textContent = b.getAttribute('data-store'); });
    });

    /* 7 Certification badges */
    var certs = $('[data-certs]');
    if (certs) {
      $$('button', certs).forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-cert');
          $$('button', certs).forEach(function (x) { x.setAttribute('aria-expanded', x === b ? 'true' : 'false'); });
          $$('[data-cert-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-cert-panel') !== id; });
        });
      });
    }

    /* 10 Five-field form */
    var cf = $('#qw-cf');
    if (cf) cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(cf)) return;
      var ref = MT.ref('ME');
      cf.hidden = true;
      var done = $('[data-cf-done]');
      done.hidden = false;
      done.innerHTML = '<h3>Thank you, ' + esc($('#cf-name').value.split(' ')[0]) + '</h3><p>Your reference is <strong>' + ref + '</strong>. The ' + esc($('#cf-need').value.toLowerCase()) + ' team will reply on ' + esc($('#cf-mob').value) + ' within one working day.</p><p><button type="button" class="link-btn" data-cf-again>Send another</button></p>';
      done.focus();
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cf-again]')) { cf.reset(); cf.hidden = false; $('[data-cf-done]').hidden = true; }
    });

    /* 12 WhatsApp */
    var wa = $('#wa-page');
    if (wa) {
      var drawWa = function () {
        var o = wa.options[wa.selectedIndex];
        var text = o.getAttribute('data-text');
        $('[data-wa-msg]').textContent = text;
        $('[data-wa-open]').setAttribute('href', MT.wa(text, o.getAttribute('data-num') || null));
        $('[data-wa-to]').textContent = o.getAttribute('data-to');
      };
      wa.addEventListener('change', drawWa);
      drawWa();
    }

    /* 15 Promotions only when there are some */
    var pr = $('[data-promo]');
    if (pr) {
      var drawPromo = function (on) {
        $$('[data-promo-on]').forEach(function (el) { el.hidden = !on; });
        $$('[data-promo-off]').forEach(function (el) { el.hidden = on; });
      };
      $$('button', pr).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', pr).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          drawPromo(b.getAttribute('data-v') === 'on');
        });
      });
      var live = (MT.offers || []).filter(function (o) { return o.end >= '2026-10-01' && o.start <= '2026-10-01'; }).slice(0, 3);
      $('[data-promo-list]').innerHTML = live.map(function (o) {
        return '<li><strong>' + esc(o.title) + '</strong><span>Ends ' + MT.date(o.end) + '</span></li>';
      }).join('');
      drawPromo(true);
    }

    /* 18 My Mantrac menu */
    var mm = $('[data-mm]');
    if (mm) {
      var menu = $('#mm-menu');
      mm.addEventListener('click', function () {
        var open = mm.getAttribute('aria-expanded') !== 'true';
        mm.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.hidden = !open;
        if (open) { var f = $('a', menu); if (f) f.focus(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) { menu.hidden = true; mm.setAttribute('aria-expanded', 'false'); mm.focus(); }
      });
      document.addEventListener('click', function (e) {
        if (!menu.hidden && !e.target.closest('[data-mm]') && !e.target.closest('#mm-menu')) { menu.hidden = true; mm.setAttribute('aria-expanded', 'false'); }
      });
    }

    /* 20 One set of facts */
    var facts = $('[data-facts]');
    if (facts) {
      var arCountries = function (n) {
        var w = (n >= 3 && n <= 10) ? 'دول' : 'دولة';
        return fmt(n, 'ar') + ' ' + w;
      };
      var drawFacts = function () {
        var v = {};
        $$('input', facts).forEach(function (i) { v[i.name] = Math.max(0, parseInt(i.value, 10) || 0); });
        $$('[data-fact]').forEach(function (el) {
          var k = el.getAttribute('data-fact'), lang = el.getAttribute('data-lang');
          if (lang === 'ar' && k === 'countries') el.textContent = arCountries(v.countries);
          else el.textContent = fmt(v[k], lang || 'en');
        });
      };
      facts.addEventListener('input', drawFacts);
      drawFacts();
    }

    /* 22 Real dates on news */
    var news = $('[data-news]');
    if (news) {
      var sortNews = function () {
        var dir = $('#news-sort').value;
        var items = $$('li', news);
        items.sort(function (a, b) {
          var x = a.getAttribute('data-date'), y = b.getAttribute('data-date');
          return dir === 'new' ? (x < y ? 1 : -1) : (x > y ? 1 : -1);
        });
        items.forEach(function (li) { news.appendChild(li); });
      };
      $('#news-sort').addEventListener('change', sortNews);
      sortNews();
    }

    /* 23 Proofreading */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    var pf = $('#pf-show');
    if (pf) pf.addEventListener('change', function () { $('[data-proof]').classList.toggle('show-marks', pf.checked); });

    /* 24 Consent */
    var ck = $('[data-consent]');
    if (ck) {
      var cat = { marketing: false, surveys: false };
      var drawTags = function (decided) {
        $$('[data-tag]').forEach(function (li) {
          var c = li.getAttribute('data-tag'), on = cat[c];
          var s = li.querySelector('.tag-state');
          s.textContent = on ? 'Loaded' : (decided ? 'Blocked' : 'Waiting for consent');
          li.classList.toggle('on', on);
        });
      };
      var decide = function (msg) {
        $('[data-ck-banner]').hidden = true;
        $('[data-ck-reopen]').hidden = false;
        $('[data-ck-status]').textContent = msg;
        drawTags(true);
      };
      $$('[data-ck]').forEach(function (b) {
        b.addEventListener('click', function () {
          var a = b.getAttribute('data-ck');
          if (a === 'all') { cat.marketing = true; cat.surveys = true; decide('Accepted all cookies.'); }
          if (a === 'none') { cat.marketing = false; cat.surveys = false; decide('Necessary cookies only.'); }
          if (a === 'choose') { $('[data-ck-choices]').hidden = false; $('#ck-marketing').focus(); }
          if (a === 'save') {
            cat.marketing = $('#ck-marketing').checked; cat.surveys = $('#ck-surveys').checked;
            decide('Saved your choices.');
          }
        });
      });
      $('[data-ck-reopen]').addEventListener('click', function () {
        $('[data-ck-banner]').hidden = false; this.hidden = true; $('[data-ck-status]').textContent = '';
      });
      $$('[data-ck-lang] button').forEach(function (b) {
        b.addEventListener('click', function () {
          var l = b.getAttribute('data-lang');
          $$('[data-ck-lang] button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          $$('[data-ck-text]').forEach(function (el) { el.hidden = el.getAttribute('data-ck-text') !== l; });
        });
      });
      drawTags(false);
    }

    /* 25 Newsletter */
    var nl = $('#qw-nl');
    if (nl) nl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!MT.validate(nl)) return;
      var d = $('[data-nl-ok]');
      d.hidden = false;
      d.textContent = 'Thank you. We have sent a message to ' + $('#qnl-email').value + ' to confirm your sign-up.';
    });

    /* 27 Share previews */
    var sh = $('#share-page');
    if (sh) sh.addEventListener('change', function () {
      $$('[data-share]').forEach(function (el) { el.hidden = el.getAttribute('data-share') !== sh.value; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var p = document.body.getAttribute('data-page');
    if (p === 'index') landing();
    if (p === 'quick-wins') page();
  });
})();

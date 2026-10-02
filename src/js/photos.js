/* ==========================================================================
   photos.js — Mantrac photography for the designed prototypes (phase 3).

   Hotlinks images from mantracgroup.com (Mantrac's own photography) and
   Caterpillar product shots as served on mantracgroup.com. Each image is
   applied only after it has loaded; until then, or if it fails, the
   illustrated brand placeholder from theme.css stays in place.

   Runs only when theme.css is loaded (it sets --mt-theme: 1), so deleting
   theme.css returns the greyscale prototypes with grey placeholders.
   Photography © Mantrac Group. Product images © Caterpillar Inc.
   ========================================================================== */

(function () {
  'use strict';

  var MEDIA = 'https://www.mantracgroup.com/media/';
  var CAT = 'https://s7d2.scene7.com/is/image/Caterpillar/';

  function m(path, w) { return MEDIA + path + '?width=' + (w || 1600); }
  function c(id) { return CAT + id + '?wid=900&hei=640'; }

  var PHOTOS = {
    hero: {
      home: m('e0yd31cd/homepage-banner-4_v3.jpg'),
      'new': m('xjwbhlwr/mantrac_newequipment_hero_v1.jpg'),
      used: m('n1lddhdw/mantrac_usedequipment_hero_v1.jpg'),
      rental: m('vvwnpjov/mantrac_rentalproducts_hero_v2.jpg'),
      enquiry: m('caybv1cr/mantrac_contact_hero_v4.jpg'),
      offers: m('pgani2xs/mantrac_promotions_hero_v5.jpg'),
      finance: m('c1da5bg4/mantrac_finance_hero_v2.jpg'),
      branches: m('1bfdq24i/mantrac_repairs_workshops_hero_v2.jpg'),
      service: m('sv2hvjqd/mantrac_services_repairs_hero_v1.jpg'),
      sell: m('v0qehwsv/mantrac_construction_endoflifecycle_thumbnail_v1.jpg', 1400)
    },
    model: {
      '302-7-cr': c('CM20210310-32703-0df1b'),
      '303-cr': c('CM20210311-f43b1-5fd9f'),
      '305-cr': c('CM20210820-3412e-f7d93'),
      '305-5e2-cr': c('C732628'),
      '320-gc': c('CM20170417-45965-15360'),
      '320-gx': c('CM20221017-6c266-82640'),
      '320': c('CM20170418-52085-33213'),
      '323-gx': c('CM20221019-5475f-09c72'),
      '330-gc': c('CM20180515-33984-11299'),
      '336-gc': c('CM20180212-37556-05525'),
      '345-gc': c('CM20180803-37492-47939'),
      '320c-l': c('C045991'),
      '365c-l': c('C212634'),
      '385c-l': c('C185121'),
      '426f2': c('CM20170613-51122-33638')
    },
    used: {
      'u-323gx-21': c('CM20221019-5475f-09c72'),
      'u-330gc-21': c('CM20180515-33984-11299'),
      'u-336gc-19': c('CM20180212-37556-05525'),
      'u-336-19': c('CM20180212-41328-33143'),
      'u-950gc-20': c('CM20250916-202ea-e8102'),
      'u-426f2-19': c('CM20170613-51122-33638'),
      'u-d6r-15': c('CM20150731-46844-07633'),
      'u-140k-17': c('CM20181129-40179-51275')
    },
    rent: {
      'r-320gc': c('CM20170417-45965-15360'),
      'r-302-7': c('CM20210310-32703-0df1b'),
      'r-cb2-7': c('CM20210301-d520e-b8aa6'),
      'r-th357': c('CM20170413-53098-58668'),
      'r-216b3': c('CM20190805-777f3-2690b')
    },
    offer: {
      'o-gc-finance': m('fpidslaw/mantrac_finance_card_v1.jpg', 900),
      'o-backhoe-service': m('rpqlxhoj/mantrac_services_maintenance_hero_v1.jpg', 900),
      'o-get': m('onyl43cj/mantrac_parts_hero_v1.jpg', 900),
      'o-epp': m('jdqfd0h0/mantrac_maintenance_epp_hero_v1.jpg', 900),
      'o-ramadan': m('es4nqvaq/mantrac_promotions_featuredimages_v3.jpg', 900)
    },
    scene: {
      '320gx': m('iw2lrc02/320gx-015.jpg', 1200),
      'Excavators': m('ljenskmh/mantrac_construction_machines_excavators_thumbnail_v2.jpg', 1200),
      'Wheel loaders': m('tpbbjn5n/mantrac_construction_machines_wheelloader_thumbnail_v2.jpg', 1200),
      'Backhoe loaders': m('jyudhofy/mantrac_construction_machines_backhoeloader_thumbnail_v2.jpg', 1200),
      'Dozers': m('vphpavri/mantrac_construction_machines_dozers_thumbnail_v1.jpg', 1200),
      'Motor graders': m('qaodnx2l/mantrac_construction_machines_motorgrader_thumbnail_v2.jpg', 1200)
    }
  };
  /* Product shots sit on white and are shown whole; scenes fill the frame. */
  var PRODUCT = { model: 1, used: 1, rent: 1 };

  function themed() {
    return getComputedStyle(document.documentElement).getPropertyValue('--mt-theme').trim() === '1';
  }

  function resolve(key) {
    var i = key.indexOf(':');
    var group = key.slice(0, i), id = key.slice(i + 1);
    return { url: PHOTOS[group] && PHOTOS[group][id], product: !!PRODUCT[group] };
  }

  function apply(el) {
    if (el.hasAttribute('data-photo-done')) return;
    el.setAttribute('data-photo-done', '');
    var r = resolve(el.getAttribute('data-photo'));
    if (!r.url) return;
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      if (el.classList.contains('page-head')) {
        el.style.setProperty('--photo', 'url("' + r.url + '")');
        el.classList.add('has-photo');
        return;
      }
      img.alt = '';
      img.className = 'photo' + (r.product ? ' photo--product' : '');
      el.insertBefore(img, el.firstChild);
      el.classList.add('has-photo');
      if (r.product) el.classList.add('is-product');
    };
    img.src = r.url;
  }

  function scan(root) {
    (root || document).querySelectorAll('[data-photo]:not([data-photo-done])').forEach(apply);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!themed()) return;
    document.documentElement.classList.add('mt-photos');
    scan();
    /* Cards are re-rendered by pages.js when filters change. */
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; scan(); });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();

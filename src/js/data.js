/* ==========================================================================
   data.js — sample data for the Mantrac prototypes.
   Model names, branch names and the first few spec values come from
   mantracgroup.com/en-eg (1 October 2026). Everything else (stock, prices,
   rates, dates, hours, people) is SAMPLE data for discussion only.
   ========================================================================== */

window.MT = window.MT || {};

/* Branches (R42, R47). Names corrected: Abu Simbel, Marsa Alam. ----------- */
MT.branches = [
  { id: 'amreya', name: 'Mantrac Amerya – Alexandria', city: 'Alexandria', gov: 'Alexandria', x: 33, y: 13, phone: '+20 3 448 1043', wa: '201103917720',
    services: ['Sales', 'Parts counter', 'Workshop', 'Component rebuild', 'Field service', 'SOS lab', 'Hose shop', 'Power systems'],
    address: 'Km 28 Alex–Cairo Desert Road, Amreya, Alexandria', lines: { machines: 'Construction sales team', power: 'Power systems team' } },
  { id: 'abu-rawash', name: 'Mantrac Abu Rawash', city: 'Giza', gov: 'Giza', x: 47, y: 22, phone: '19266', wa: '201103917720',
    services: ['Sales', 'Parts counter', 'Workshop', 'Field service', 'Rental', 'Used equipment'],
    address: 'Abu Rawash Industrial Zone, Giza', lines: { machines: 'Greater Cairo sales team', power: 'Power systems team' } },
  { id: '10th-ramadan', name: 'Mantrac House – 10th of Ramadan', city: '10th of Ramadan', gov: 'Sharqia', x: 55, y: 20, phone: '19266', wa: '201103917720',
    services: ['Sales', 'Parts counter', 'Workshop', 'Component rebuild', 'SOS lab', 'Training'],
    address: '10th of Ramadan City, Sharqia', lines: { machines: 'Delta and Canal sales team', power: 'Power systems team' } },
  { id: 'tanta', name: 'Mantrac Tanta', city: 'Tanta', gov: 'Gharbia', x: 43, y: 16, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service'], address: 'Tanta, Gharbia', lines: { machines: 'Delta and Canal sales team', power: 'Power systems team' } },
  { id: 'mansoura', name: 'Mantrac Mansoura', city: 'Mansoura', gov: 'Dakahlia', x: 50, y: 13, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service'], address: 'Mansoura, Dakahlia', lines: { machines: 'Delta and Canal sales team', power: 'Power systems team' } },
  { id: 'suez', name: 'Mantrac Suez', city: 'Suez', gov: 'Suez', x: 62, y: 23, phone: '19266', wa: '201103917720',
    services: ['Sales', 'Parts counter', 'Workshop', 'Field service', 'Marine'], address: 'Suez', lines: { machines: 'Delta and Canal sales team', power: 'Marine and power team' } },
  { id: 'sharm', name: 'Mantrac Sharm El Sheikh', city: 'Sharm El Sheikh', gov: 'South Sinai', x: 74, y: 43, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service', 'Power systems'], address: 'Sharm El Sheikh, South Sinai', lines: { machines: 'Red Sea and Sinai team', power: 'Power systems team' } },
  { id: 'hurghada', name: 'Mantrac Hurghada', city: 'Hurghada', gov: 'Red Sea', x: 66, y: 46, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service', 'Power systems'], address: 'Hurghada, Red Sea', lines: { machines: 'Red Sea and Sinai team', power: 'Power systems team' } },
  { id: 'marsa-alam', name: 'Mantrac Marsa Alam', city: 'Marsa Alam', gov: 'Red Sea', x: 74, y: 62, phone: '19266', wa: '201103917720',
    services: ['Field service', 'Power systems'], address: 'Marsa Alam, Red Sea', lines: { machines: 'Red Sea and Sinai team', power: 'Power systems team' } },
  { id: 'sohag', name: 'Mantrac Sohag', city: 'Sohag', gov: 'Sohag', x: 50, y: 55, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service'], address: 'Sohag', lines: { machines: 'Upper Egypt team', power: 'Power systems team' } },
  { id: 'luxor', name: 'Mantrac Luxor', city: 'Luxor', gov: 'Luxor', x: 56, y: 64, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Field service'], address: 'Luxor', lines: { machines: 'Upper Egypt team', power: 'Power systems team' } },
  { id: 'aswan', name: 'Mantrac Aswan', city: 'Aswan', gov: 'Aswan', x: 58, y: 77, phone: '19266', wa: '201103917720',
    services: ['Parts counter', 'Workshop', 'Field service'], address: 'Aswan', lines: { machines: 'Upper Egypt team', power: 'Power systems team' } },
  { id: 'abu-simbel', name: 'Mantrac Abu Simbel', city: 'Abu Simbel', gov: 'Aswan', x: 49, y: 91, phone: '19266', wa: '201103917720',
    services: ['Field service', 'Power systems'], address: 'Abu Simbel, Aswan', lines: { machines: 'Upper Egypt team', power: 'Power systems team' } }
];

/* Governorates → nearest branch (R10) ------------------------------------- */
MT.governorates = {
  'Alexandria': 'amreya', 'Beheira': 'amreya', 'Matrouh': 'amreya', 'Kafr El Sheikh': 'tanta',
  'Cairo': 'abu-rawash', 'Giza': 'abu-rawash', 'Qalyubia': 'abu-rawash', 'Faiyum': 'abu-rawash', 'Beni Suef': 'abu-rawash', 'New Valley': 'abu-rawash',
  'Sharqia': '10th-ramadan', 'Ismailia': '10th-ramadan', 'Port Said': '10th-ramadan',
  'Gharbia': 'tanta', 'Monufia': 'tanta', 'Dakahlia': 'mansoura', 'Damietta': 'mansoura',
  'Suez': 'suez', 'North Sinai': 'suez', 'South Sinai': 'sharm', 'Red Sea': 'hurghada',
  'Minya': 'sohag', 'Asyut': 'sohag', 'Sohag': 'sohag', 'Qena': 'luxor', 'Luxor': 'luxor', 'Aswan': 'aswan'
};

/* New equipment — excavators (R11–R19).
   First three rows: specs as shown on the live listing. Others: sample values. */
MT.machines = [
  { id: '302-7-cr', name: '302.7 CR', size: 'Mini', kw: 17.6, kg: 3050, dig: 2710, apps: ['Utilities', 'Landscaping', 'Building'], tier: 'Stage V', stock: { s: 'in', branch: 'amreya', qty: 3 }, from: 2350000 },
  { id: '303-cr', name: '303 CR', size: 'Mini', kw: 17.6, kg: 3545, dig: 2950, apps: ['Utilities', 'Landscaping', 'Building'], tier: 'Stage V', stock: { s: 'in', branch: 'abu-rawash', qty: 2 }, from: 2600000 },
  { id: '305-cr', name: '305 CR', size: 'Mini', kw: 27.2, kg: 5695, dig: 3670, apps: ['Utilities', 'Building', 'Agriculture'], tier: 'Tier 3', stock: { s: 'order', lead: '8–10 weeks' }, from: 3400000 },
  { id: '305-5e2-cr', name: '305.5E2 CR', size: 'Mini', kw: 32.9, kg: 5423, dig: 3870, apps: ['Utilities', 'Building'], tier: 'Tier 3', stock: { s: 'in', branch: '10th-ramadan', qty: 1 }, from: 3550000 },
  { id: '313-gc', name: '313 GC', size: 'Small', kw: 74, kg: 13500, dig: 5960, apps: ['Utilities', 'Building', 'Roads'], tier: 'Tier 3', stock: { s: 'order', lead: '10–12 weeks' }, from: 6900000 },
  { id: '320-gc', name: '320 GC', size: 'Medium', kw: 107, kg: 20400, dig: 6630, apps: ['Roads', 'Building', 'Quarrying'], tier: 'Tier 3', stock: { s: 'in', branch: 'abu-rawash', qty: 4 }, from: 9800000 },
  { id: '320-gx', name: '320 GX', size: 'Medium', kw: 103.6, kg: 20500, dig: 6430, apps: ['Roads', 'Building', 'Agriculture'], tier: 'Tier 3', stock: { s: 'in', branch: 'amreya', qty: 5 }, from: 9200000 },
  { id: '320', name: '320', size: 'Medium', kw: 117, kg: 21300, dig: 6720, apps: ['Roads', 'Building', 'Quarrying', 'Demolition'], tier: 'Tier 3', stock: { s: 'order', lead: '12–14 weeks' }, from: 11400000 },
  { id: '323-gx', name: '323 GX', size: 'Medium', kw: 110, kg: 23000, dig: 6800, apps: ['Roads', 'Quarrying'], tier: 'Tier 3', stock: { s: 'in', branch: '10th-ramadan', qty: 2 }, from: 10300000 },
  { id: '330-gc', name: '330 GC', size: 'Large', kw: 151, kg: 29500, dig: 7200, apps: ['Quarrying', 'Roads', 'Mining'], tier: 'Tier 3', stock: { s: 'in', branch: 'suez', qty: 1 }, from: 13900000 },
  { id: '336-gc', name: '336 GC', size: 'Large', kw: 202, kg: 36000, dig: 7430, apps: ['Quarrying', 'Mining', 'Demolition'], tier: 'Tier 3', stock: { s: 'reserved', branch: 'amreya' }, from: 17200000 },
  { id: '345-gc', name: '345 GC', size: 'Large', kw: 232, kg: 45400, dig: 7750, apps: ['Quarrying', 'Mining'], tier: 'Tier 3', stock: { s: 'order', lead: '14–16 weeks' }, from: 21500000 }
];
MT.legacy = [
  { id: '320c-l', name: '320C L', size: 'Medium', kw: 103, kg: 21000, dig: 6720, apps: [], tier: '—', legacy: true },
  { id: '365c-l', name: '365C L', size: 'Large', kw: 302, kg: 66000, dig: 8370, apps: [], tier: '—', legacy: true },
  { id: '385c-l', name: '385C L', size: 'Large', kw: 382, kg: 84000, dig: 8420, apps: [], tier: '—', legacy: true }
];

/* Finder questions (R14) -------------------------------------------------- */
MT.finder = {
  job: [
    { v: 'Utilities', t: 'Trenching and pipes', d: 'Water, sewer, cables' },
    { v: 'Building', t: 'Building sites', d: 'Foundations, basements, site prep' },
    { v: 'Roads', t: 'Roads and earthworks', d: 'Cut and fill, ditching, loading trucks' },
    { v: 'Quarrying', t: 'Quarry and aggregates', d: 'Face work, loading, rock' },
    { v: 'Demolition', t: 'Demolition', d: 'Breaking, sorting, clearing' }
  ],
  material: [
    { v: 'soft', t: 'Sand and soil', d: 'Delta, desert sand' },
    { v: 'mixed', t: 'Clay and gravel', d: 'Mixed ground' },
    { v: 'rock', t: 'Rock and blasted stone', d: 'Limestone, granite' }
  ],
  site: [
    { v: 'tight', t: 'Tight or urban', d: 'Under 3 m swing room' },
    { v: 'open', t: 'Open site', d: 'Normal access' },
    { v: 'big', t: 'Large production site', d: 'Loading 30 t+ trucks all day' }
  ]
};

/* Used (R20–R22). First four from the live used list; others sample. ------- */
MT.used = [
  { id: 'u-323gx-21', name: '323 GX', fam: 'Excavators', year: 2021, hrs: 3796, tier: 'ccu', branch: 'abu-rawash', band: [6.8, 7.4], photos: 24, s: 'in' },
  { id: 'u-330gc-21', name: '330 GC', fam: 'Excavators', year: 2021, hrs: 885, tier: 'ccu', branch: 'amreya', band: [10.9, 11.6], photos: 31, s: 'in' },
  { id: 'u-336gc-19', name: '336 GC', fam: 'Excavators', year: 2019, hrs: 3400, tier: 'fair', branch: 'suez', band: [8.1, 8.9], photos: 12, s: 'reserved' },
  { id: 'u-336-19', name: '336', fam: 'Excavators', year: 2019, hrs: 5905, tier: 'ccu', branch: '10th-ramadan', band: [9.4, 10.2], photos: 18, s: 'in' },
  { id: 'u-950gc-20', name: '950 GC', fam: 'Wheel loaders', year: 2020, hrs: 6210, tier: 'mcu', branch: 'abu-rawash', band: [7.2, 7.9], photos: 20, s: 'in' },
  { id: 'u-426f2-19', name: '426F2', fam: 'Backhoe loaders', year: 2019, hrs: 4105, tier: 'mcu', branch: 'tanta', band: [2.9, 3.3], photos: 16, s: 'in' },
  { id: 'u-d6r-15', name: 'D6R', fam: 'Dozers', year: 2015, hrs: 9820, tier: 'fair', branch: 'aswan', band: [5.1, 5.8], photos: 9, s: 'in' },
  { id: 'u-140k-17', name: '140K', fam: 'Motor graders', year: 2017, hrs: 7480, tier: 'mcu', branch: 'sohag', band: [5.6, 6.2], photos: 14, s: 'sold' }
];
MT.tiers = {
  ccu: { name: 'Cat Certified Used', short: 'Cat Certified', cover: 'Equipment Protection Plan (EPP) on power train and hydraulics: 6 months or 1,500 hours, whichever comes first.', limits: 'Up to 5 years old. Up to 3,500 hours (building construction) or 7,500 hours (construction and infrastructure).' },
  mcu: { name: 'Mantrac Certified Used', short: 'Mantrac Certified', cover: 'Equipment Protection Plan (EPP) on power train and hydraulics: 6 months or 1,500 hours, whichever comes first.', limits: '5 to 10 years old. Up to 6,000 hours (building construction) or 10,000 hours (construction and infrastructure).' },
  fair: { name: 'Fair Value Used', short: 'Fair Value', cover: 'Sold as seen without warranty. A protection plan may be offered after inspection.', limits: '10 to 12 years old. Up to 6,000 or 10,000 hours.' }
};

/* Rental (R23). First two from the live rental list; others sample. -------- */
MT.rental = [
  { id: 'r-966h', name: '966H wheel loader', fam: 'Wheel loaders', year: 2015, day: 14500, week: 82000, branch: 'abu-rawash', booked: [['2026-10-04', '2026-10-15']] },
  { id: 'r-988f', name: '988F wheel loader', fam: 'Wheel loaders', year: 2000, day: 19800, week: 112000, branch: 'amreya', booked: [] },
  { id: 'r-320gc', name: '320 GC excavator', fam: 'Excavators', year: 2023, day: 12800, week: 72000, branch: 'abu-rawash', booked: [['2026-10-01', '2026-10-09']] },
  { id: 'r-302-7', name: '302.7 CR mini excavator', fam: 'Excavators', year: 2024, day: 4200, week: 23500, branch: 'amreya', booked: [] },
  { id: 'r-cb2-7', name: 'CB2.7 tandem roller', fam: 'Compactors', year: 2022, day: 3600, week: 20000, branch: '10th-ramadan', booked: [['2026-10-12', '2026-10-30']] },
  { id: 'r-th357', name: 'TH357D telehandler', fam: 'Telehandlers', year: 2021, day: 6900, week: 38500, branch: 'abu-rawash', booked: [] },
  { id: 'r-xq230', name: 'XQ230 mobile generator set', fam: 'Generators', year: 2023, day: 5200, week: 29000, branch: 'hurghada', booked: [['2026-10-02', '2026-10-06']] },
  { id: 'r-216b3', name: '216B3 skid steer loader', fam: 'Skid steers', year: 2020, day: 3900, week: 21500, branch: 'tanta', booked: [] }
];

/* Offers (R36, R37). All sample. "today" is the prototype date. ------------ */
MT.today = '2026-10-01';
MT.offers = [
  { id: 'o-gc-finance', title: '0% finance for 12 months on GC excavators', kind: 'Finance', applies: '313 GC, 320 GC, 330 GC, 336 GC, 345 GC', start: '2026-09-15', end: '2026-12-31', detail: 'With a 30% deposit, for business customers in Egypt. Subject to approval.' },
  { id: 'o-backhoe-service', title: 'First 500-hour service included on a new 426F2 backhoe', kind: 'Service', applies: '426F2 backhoe loader', start: '2026-10-01', end: '2026-11-30', detail: 'Parts and labour for the 500-hour service at any Mantrac workshop.' },
  { id: 'o-get', title: '15% off Cat ground engaging tools', kind: 'Parts', applies: 'Bucket tips, adapters and cutting edges', start: '2026-09-01', end: '2026-10-31', detail: 'At parts counters and on the Cat parts store. While stocks last.' },
  { id: 'o-epp', title: 'EPP extension at 2025 prices', kind: 'Service', applies: 'Machines under 3 years old', start: '2026-08-01', end: '2026-10-15', detail: 'Extend your Equipment Protection Plan before the price review.' },
  { id: 'o-ramadan', title: 'Spring fleet check, free inspection', kind: 'Service', applies: 'All Cat machines', start: '2026-03-01', end: '2026-04-30', detail: 'Expired example: shown only when "Show expired" is on.' }
];

/* Finance (R38). Sample rates for the estimator. ---------------------------- */
MT.finance = { rates: { 12: 0, 24: 18.5, 36: 19.5, 48: 20.5 }, minDeposit: 20 };

/* Enquiry picklists (R31). Deduplicated, from the live Contact form. -------- */
MT.needs = ['A new machine', 'A used machine', 'Rental', 'Parts', 'Service or repair', 'Power systems', 'Finance', 'Something else'];

// Qasr Al Halaweyat — prototype data. Menu & photos from the live QR menu (sebahi.services), prices in USD.
window.QASR = (function () {
  const branches = [
    { id: 'malla', name: { en: 'Malla · Beirut', ar: 'الملا · بيروت' }, area: { en: 'Algeria St, Sanayeh / Aisha Bakkar', ar: 'شارع الجزائر، الصنائع / عائشة بكار' },
      phone: '01 745 752', wa: '9613215616', hours: { en: 'Mon–Sat 5:30 AM – 9 PM · Sun until 1 PM', ar: 'الإثنين–السبت ٥:٣٠ ص – ٩ م · الأحد حتى ١ م' },
      open: true, paused: false, deliveryFee: 1.67, minOrder: 5, eta: '25–35 min', lat: 33.8906, lng: 35.4893, main: true,
      zones: ['Hamra', 'Sanayeh', 'Verdun', 'Ras Beirut', 'Ain El Mreisseh', 'Mazraa', 'Tallet El Khayat', 'Koraytem', 'Manara'] },
    { id: 'mazraa', name: { en: 'Corniche El Mazraa', ar: 'كورنيش المزرعة' }, area: { en: 'Corniche El Mazraa, Beirut', ar: 'كورنيش المزرعة، بيروت' },
      phone: '01 818 161', wa: '9613215616', hours: { en: 'Daily 6 AM – 10 PM', ar: 'يومياً ٦ ص – ١٠ م' },
      open: true, paused: false, deliveryFee: 2.0, minOrder: 5, eta: '30–40 min', lat: 33.8778, lng: 35.4960,
      zones: ['Mazraa', 'Barbir', 'Tarik El Jdideh', 'Bachoura', 'Mar Elias', 'Dahye (Ghobeiry)', 'Chiyah'] },
    { id: 'aramoun', name: { en: 'Aramoun · Choueifat', ar: 'عرمون · الشويفات' }, area: { en: 'Aramoun main road, Choueifat', ar: 'طريق عرمون العام، الشويفات' },
      phone: '05 810 404', wa: '9613215616', hours: { en: 'Daily 7 AM – 10 PM', ar: 'يومياً ٧ ص – ١٠ م' },
      open: true, paused: false, deliveryFee: 2.5, minOrder: 8, eta: '35–45 min', lat: 33.7885, lng: 35.4826,
      zones: ['Aramoun', 'Choueifat', 'Bchamoun', 'Khalde', 'Dawhet Aramoun', 'Doha', 'Naameh'] },
  ];

  // International: dry sweets only (maamoul, baklawa, boxes). DHL express, priced per kg band.
  const intl = {
    carrier: 'DHL Express', minOrderUsd: 40, freeOver: 250, packagingNote: { en: 'Vacuum-sealed tins, 3–6 business days', ar: 'علب محكمة الإغلاق، ٣–٦ أيام عمل' },
    countries: [
      { code: 'AE', name: { en: 'United Arab Emirates', ar: 'الإمارات' }, flag: '🇦🇪', ratePerKg: 14, base: 18, days: '2–3', enabled: true },
      { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية' }, flag: '🇸🇦', ratePerKg: 15, base: 19, days: '3–4', enabled: true },
      { code: 'KW', name: { en: 'Kuwait', ar: 'الكويت' }, flag: '🇰🇼', ratePerKg: 15, base: 19, days: '3–4', enabled: true },
      { code: 'QA', name: { en: 'Qatar', ar: 'قطر' }, flag: '🇶🇦', ratePerKg: 15, base: 19, days: '3–4', enabled: true },
      { code: 'FR', name: { en: 'France', ar: 'فرنسا' }, flag: '🇫🇷', ratePerKg: 18, base: 24, days: '3–5', enabled: true },
      { code: 'DE', name: { en: 'Germany', ar: 'ألمانيا' }, flag: '🇩🇪', ratePerKg: 18, base: 24, days: '3–5', enabled: true },
      { code: 'GB', name: { en: 'United Kingdom', ar: 'بريطانيا' }, flag: '🇬🇧', ratePerKg: 19, base: 25, days: '3–5', enabled: true },
      { code: 'SE', name: { en: 'Sweden', ar: 'السويد' }, flag: '🇸🇪', ratePerKg: 19, base: 26, days: '4–6', enabled: true },
      { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة' }, flag: '🇺🇸', ratePerKg: 24, base: 32, days: '4–6', enabled: true },
      { code: 'CA', name: { en: 'Canada', ar: 'كندا' }, flag: '🇨🇦', ratePerKg: 24, base: 32, days: '4–6', enabled: true },
      { code: 'AU', name: { en: 'Australia', ar: 'أستراليا' }, flag: '🇦🇺', ratePerKg: 28, base: 36, days: '5–7', enabled: true },
      { code: 'BR', name: { en: 'Brazil', ar: 'البرازيل' }, flag: '🇧🇷', ratePerKg: 30, base: 38, days: '6–9', enabled: false },
    ],
  };

  const categories = [
    { id: 'knefeh', name: { en: 'Qasr Knefeh Specials', ar: 'كنافة القصر' }, intl: false, emoji: '🧀' },
    { id: 'platters', name: { en: 'Platters', ar: 'صحون' }, intl: false, emoji: '🍽️' },
    { id: 'piece', name: { en: 'Trabulsiyeh by Piece', ar: 'حلويات طرابلسية بالقطعة' }, intl: false, emoji: '🍥' },
    { id: 'kilo', name: { en: 'Trabulsiyeh by Kilo', ar: 'حلويات طرابلسية بالكيلو' }, intl: false, emoji: '⚖️' },
    { id: 'maamoul', name: { en: 'Maamoul & Mad', ar: 'معمول ومد' }, intl: true, emoji: '🌙' },
    { id: 'baklawa', name: { en: 'Baklawa', ar: 'بقلاوة' }, intl: true, emoji: '💛' },
    { id: 'boxes', name: { en: 'Boxes & Nuts', ar: 'علب ومكسرات' }, intl: true, emoji: '🎁' },
  ];

  const sandwichOrPlate = [
    { id: 'serve', name: { en: 'Serving', ar: 'التقديم' }, min: 1, max: 1, choices: [
      { id: 'sandwich', name: { en: 'Sandwich (kaake)', ar: 'سندويش (كعكة)' }, price: 0 },
      { id: 'plate', name: { en: 'Plate', ar: 'صحن' }, price: 1.6 } ] },
    { id: 'extras', name: { en: 'Extras', ar: 'إضافات' }, min: 0, max: 2, choices: [
      { id: 'pist', name: { en: 'Pistachio', ar: 'فستق' }, price: 1.1 },
      { id: 'diet', name: { en: 'Diet (sugar-free syrup)', ar: 'دايت (قطر بدون سكر)' }, price: 0 } ] },
  ];
  const kiloSize = [
    { id: 'size', name: { en: 'Size', ar: 'الحجم' }, min: 1, max: 1, choices: [
      { id: 'half', name: { en: '½ kg', ar: 'نصف كيلو' }, price: 0 },
      { id: 'kg', name: { en: '1 kg', ar: 'كيلو' }, mult: 2 } ] },
  ];
  const tinBox = [
    { id: 'pack', name: { en: 'Packaging', ar: 'التغليف' }, min: 1, max: 1, choices: [
      { id: 'std', name: { en: 'Standard box', ar: 'علبة عادية' }, price: 0 },
      { id: 'gift', name: { en: 'Gift tin + ribbon', ar: 'علبة هدية معدنية + شريطة' }, price: 3 } ] },
  ];

  const I = (id, cat, en, ar, price, img, opt = {}) => ({ id, cat, name: { en, ar }, price, img: img ? `img/item_${id}.webp` : null, available: true, popular: false, desc: { en: '', ar: '' }, weightKg: 0.5, ...opt });

  const items = [
    // Knefeh specials
    I(1327, 'knefeh', 'Kaake Cheese', 'كعكة جبنة', 3.33, true, { popular: true, addons: sandwichOrPlate, desc: { en: 'Knefeh bil jibn in a sesame kaake, syrup on the side', ar: 'كنافة بجبنة بالكعكة مع القطر' } }),
    I(1328, 'knefeh', 'Kaake Ashta', 'كعكة قشطة', 3.33, false, { addons: sandwichOrPlate }),
    I(1329, 'knefeh', 'Kaake Cocktail', 'كعكة كوكتيل', 3.33, false, { addons: sandwichOrPlate, desc: { en: 'Half cheese, half ashta', ar: 'نص جبنة نص قشطة' } }),
    I(1330, 'knefeh', 'Lahmeh B Aajin', 'لحمة بعجين', 2.22, true, { popular: true, desc: { en: 'With mint and pomegranate molasses', ar: 'مع نعنع ودبس الرمان' } }),
    I(1332, 'knefeh', 'Knefeh Cheese Tray 2 kg', 'صينية كنافة جبنة ٢ كلغ', 40, true, { desc: { en: 'With syrup and 12 kaake', ar: 'مع قطر و١٢ كعكة' }, weightKg: 2.5 }),
    I(1403, 'knefeh', 'Knefeh ½ kg', 'كنافة نص كيلو', 10, false, { desc: { en: 'Cheese', ar: 'جبنة' } }),
    I(1334, 'knefeh', 'Combo Ashta Kilo', 'كومبو قشطة كيلو', 20, true, { popular: true, desc: { en: 'Mafroukeh samra & khadra, othmaliyeh, halawet el jibn', ar: 'تشكيلة من المفروكة السمرا والخضرا، عثملية، حلاوة' }, weightKg: 1 }),
    // Platters
    I(1336, 'platters', 'Halawet El Rez', 'حلاوة الرز', 4.44, true),
    I(1337, 'platters', 'Halawet El Jibn Rolls', 'حلاوة الجبن لفايف', 5.5, true, { popular: true }),
    I(1338, 'platters', 'Halawet El Jibn Slices', 'حلاوة الجبن شرحات', 5.5, false),
    I(1339, 'platters', 'Mad Ashta', 'مد قشطة', 4.44, true),
    I(1340, 'platters', 'Mad Mix', 'مد مشكل', 4.4, false),
    I(1341, 'platters', 'Mafroukeh Samra', 'مفروكة سمرا', 4.44, true),
    I(1342, 'platters', 'Mafroukeh Khadra', 'مفروكة خضرا', 5.56, true, { popular: true }),
    I(1343, 'platters', 'Othmaliyeh', 'عثملية', 4.44, true),
    I(1344, 'platters', 'Karabij with Natef', 'كرابيج مع ناطف', 5.56, true),
    I(1345, 'platters', 'Baklawa Plate', 'صحن بقلاوة', 5.56, true),
    I(1346, 'platters', 'Moufataka', 'مفتقة', 2.7, true),
    I(2798, 'platters', 'Hadaf Ramadan', 'هدف رمضان', 5.5, false),
    // By piece
    I(1351, 'piece', 'Shoabeyat Ashta', 'شعيبيات قشطة', 1.5, true, { desc: { en: 'Filled with fresh ashta', ar: 'محشوة بالقشطة الطازجة' } }),
    I(1352, 'piece', 'Shoabeyat bil Halib', 'شعيبيات بالحليب', 0.85, true, { desc: { en: 'Filled with cooked milk', ar: 'محشوة بالحليب المطبوخ' } }),
    I(1353, 'piece', 'Katayef Asafiri 12 pcs', 'قطايف عصافيري ١٢ حبة', 8.3, true, { popular: true }),
    I(1354, 'piece', 'Pistachio Cup', 'كاسة فستق', 2.78, true),
    I(2799, 'piece', 'Halawet El Jibn Roll', 'لفة حلاوة جبن', 1.39, false),
    // By kilo (price shown is ½ kg)
    I(1355, 'kilo', 'Karbouj Pistachio', 'كربوج فستق', 11.11, false, { addons: kiloSize }),
    I(1356, 'kilo', 'Karbouj Walnuts', 'كربوج جوز', 9.15, false, { addons: kiloSize }),
    I(1357, 'kilo', 'Karabij with Natef', 'كرابيج مع ناطف', 11.11, true, { addons: kiloSize }),
    I(1358, 'kilo', 'Mafroukeh Samra', 'مفروكة سمرا', 8.89, true, { addons: kiloSize }),
    I(1359, 'kilo', 'Mafroukeh Khadra', 'مفروكة خضرا', 11.11, true, { addons: kiloSize, popular: true }),
    I(1360, 'kilo', 'Halawet El Jibn Slices', 'حلاوة الجبن شرحات', 8.89, false, { addons: kiloSize }),
    I(1361, 'kilo', 'Othmaliyeh', 'عثملية', 8.89, true, { addons: kiloSize }),
    I(1362, 'kilo', 'Maakaroun', 'معكرون', 5.5, true, { addons: kiloSize }),
    I(1363, 'kilo', 'Halawet El Rez', 'حلاوة الرز', 7.78, true, { addons: kiloSize }),
    I(1364, 'kilo', 'Ashta Trabulsiyeh', 'قشطة طرابلسية', 7.78, false, { addons: kiloSize }),
    I(1365, 'kilo', 'Moufataka', 'مفتقة', 5.55, true, { addons: kiloSize }),
    // Maamoul & Mad (per kg unless noted)
    I(1373, 'maamoul', 'Sfouf', 'صفوف', 11.11, true, { weightKg: 1, addons: tinBox }),
    I(1374, 'maamoul', 'Namoura', 'نمورة', 11.11, true, { weightKg: 1, addons: tinBox }),
    I(1375, 'maamoul', 'Mad Ashta', 'مد قشطة', 15.56, true, { weightKg: 1, addons: tinBox }),
    I(1376, 'maamoul', 'Mad Dates', 'مد تمر', 11.11, true, { weightKg: 1, addons: tinBox }),
    I(1377, 'maamoul', 'Mad Walnuts', 'مد جوز', 17.8, true, { weightKg: 1, addons: tinBox }),
    I(1378, 'maamoul', 'Mad Pistachio', 'مد فستق', 20, true, { weightKg: 1, addons: tinBox, popular: true }),
    I(1379, 'maamoul', 'Mad Mix', 'مد مشكل', 14.44, true, { weightKg: 1, addons: tinBox, desc: { en: 'Ashta, walnut, dates, pistachio, namoura, sfouf', ar: 'مكون من مد: قشطة / جوز / تمر / فستق / نمورة / صفوف' } }),
    I(1404, 'maamoul', 'Maamoul Soirée Dates', 'معمول سواريه تمر', 15.56, true, { weightKg: 1, addons: tinBox, desc: { en: '28 pieces per kg', ar: 'الكيلو ٢٨ حبة' } }),
    I(1405, 'maamoul', 'Maamoul Soirée Walnuts', 'معمول سواريه جوز', 20, true, { weightKg: 1, addons: tinBox, desc: { en: '28 pieces per kg', ar: 'الكيلو ٢٨ حبة' } }),
    I(1406, 'maamoul', 'Maamoul Soirée Pistachio', 'معمول سواريه فستق', 22.22, true, { weightKg: 1, addons: tinBox, popular: true, desc: { en: '28 pieces per kg', ar: 'الكيلو ٢٨ حبة' } }),
    I(1407, 'maamoul', 'Maamoul Soirée Mix', 'معمول سواريه مشكل', 20, true, { weightKg: 1, addons: tinBox, popular: true, desc: { en: '28 pieces per kg', ar: 'الكيلو ٢٨ حبة' } }),
    I(2790, 'maamoul', 'Maamoul Mix 6 pcs', 'معمول مشكل ٦ حبات', 7.5, false, { weightKg: 0.3, desc: { en: '2 dates, 2 walnut, 2 pistachio', ar: 'حبتين تمر، حبتين جوز، حبتين فستق' } }),
    // Baklawa (500 g)
    I(1380, 'baklawa', 'Baklawa Mix', 'بقلاوة مشكل', 11.11, true, { addons: [...kiloSize, ...tinBox], popular: true }),
    I(1381, 'baklawa', 'Hadaf Ramadan', 'هدف رمضان', 11.11, true, { addons: [...kiloSize, ...tinBox] }),
    I(1382, 'baklawa', 'Fingers Cashew', 'أصابع كاجو', 11.11, true, { addons: [...kiloSize, ...tinBox] }),
    I(1383, 'baklawa', 'Borma Pistachio', 'برما فستق', 20, true, { addons: [...kiloSize, ...tinBox], popular: true }),
    I(1384, 'baklawa', 'Kol W Shkor Cashew', 'كل واشكر كاجو', 11.11, true, { addons: [...kiloSize, ...tinBox] }),
    I(1385, 'baklawa', 'Nabulsiyeh Cashew', 'نابلسية كاجو', 11.11, true, { addons: [...kiloSize, ...tinBox] }),
    I(1386, 'baklawa', 'Basma', 'بسمة', 8.89, false, { addons: [...kiloSize, ...tinBox] }),
    // Boxes & nuts
    I(1387, 'boxes', 'Mixed Nuts Small', 'مكسرات مشكلة صغير', 5, false, { weightKg: 0.3 }),
    I(1388, 'boxes', 'Mixed Nuts Medium', 'مكسرات مشكلة وسط', 10, false, { weightKg: 0.6 }),
    I(1389, 'boxes', 'Mixed Nuts Large', 'مكسرات مشكلة كبير', 16.67, false, { weightKg: 1 }),
    I(1390, 'boxes', 'Mixed Nuts Diet', 'مكسرات دايت', 12, false, { weightKg: 0.6 }),
    I(1391, 'boxes', 'Mixed Nuts Krokan', 'مكسرات كروكان', 10, false, { weightKg: 0.6 }),
    I(1392, 'boxes', 'Sesame Slices', 'سمسمية', 2.5, false, { weightKg: 0.2 }),
    I(1393, 'boxes', 'Sesame & Pistachio Slices', 'سمسمية بالفستق', 3, false, { weightKg: 0.2 }),
    I(1398, 'boxes', 'Belgian Chocolate Box', 'علبة شوكولا بلجيكي', 40, false, { weightKg: 1, popular: true }),
    I(1399, 'boxes', 'Lozania', 'لوزينة', 5.56, false, { weightKg: 0.3 }),
    I(1400, 'boxes', 'Maamoul with Chocolate', 'معمول مغطس بالشوكولا', 16.67, false, { weightKg: 0.8 }),
    I(1401, 'boxes', 'Medjool Dates ½ kg', 'تمر مجدول نص كيلو', 8.33, false, { desc: { en: 'Jordanian Medjool', ar: 'تمر مجدول أردني' } }),
    I(1402, 'boxes', 'Barazek & Ghraybeh', 'برازق وغريبة', 8.33, false),
    I(2795, 'boxes', 'Petit Four', 'بيتي فور', 16, false, { weightKg: 0.8 }),
    I(1394, 'boxes', 'Cotton Candy Cup', 'غزل بنات كاسة', 1.11, false, { intlOnly: false, noIntl: true, weightKg: 0.1 }),
  ];

  const banners = [
    { id: 'b1', img: 'img/gallery3.webp', title: { en: 'Baklawa by the tray', ar: 'بقلاوة بالصينية' }, sub: { en: 'Mixed trays from $11.11 / ½ kg', ar: 'صواني مشكلة من ١١.١١$ / نص كيلو' }, active: true, link: 'baklawa' },
    { id: 'b2', img: 'img/gallery2.webp', title: { en: 'Halawet El Jibn, fresh every morning', ar: 'حلاوة الجبن طازجة كل صباح' }, sub: { en: 'From 5:30 AM at Malla', ar: 'من ٥:٣٠ صباحاً في الملا' }, active: true, link: 'platters' },
    { id: 'b3', img: 'img/gallery1.webp', title: { en: '10% off delivery orders', ar: 'خصم ١٠٪ على طلبات التوصيل' }, sub: { en: 'Applied automatically at checkout', ar: 'يُطبّق تلقائياً عند الدفع' }, active: true, link: 'knefeh' },
  ];

  const promos = [
    { code: 'QASR10', type: 'percent', value: 10, minOrder: 15, uses: 142, max: 500, active: true, note: { en: 'Launch offer', ar: 'عرض الإطلاق' } },
    { code: 'WELCOME', type: 'fixed', value: 3, minOrder: 10, uses: 61, max: 1000, firstOnly: true, active: true, note: { en: 'First order', ar: 'أول طلب' } },
    { code: 'EID25', type: 'percent', value: 25, minOrder: 50, uses: 0, max: 200, active: false, note: { en: 'Eid maamoul pre-orders', ar: 'طلبات معمول العيد' } },
  ];

  const rewards = [
    { id: 'r1', name: { en: 'Free Kaake Cheese', ar: 'كعكة جبنة مجاناً' }, points: 300, itemId: 1327 },
    { id: 'r2', name: { en: 'Free delivery', ar: 'توصيل مجاني' }, points: 150, type: 'delivery' },
    { id: 'r3', name: { en: '½ kg Baklawa Mix', ar: 'نص كيلو بقلاوة مشكل' }, points: 1100, itemId: 1380 },
  ];

  const settings = { pointsPerUsd: 10, cashbackPct: 5, welcomeBonus: 100, currency: 'USD', lbpRate: 89500, minBuild: 13, unverifiedLimit: 2 };

  // ---- Shared order store (localStorage, shared by app + admin on the same device) ----
  const KEY = 'qasr_orders_v1';
  function load(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  const seedOrders = () => {
    const now = Date.now();
    const mk = (n, min, status, branch, type, lines, cust, extra = {}) => ({
      id: 'Q' + (2300 + n), ts: now - min * 60000, status, branch, type, lines, customer: cust, ...extra,
    });
    return [
      mk(41, 4, 'received', 'malla', 'delivery', [{ id: 1327, qty: 3, opts: 'Sandwich · Pistachio', price: 4.43 }, { id: 1337, qty: 1, opts: '', price: 5.5 }], { name: 'Rima Haddad', phone: '03 612 334', verified: true, address: 'Hamra, Makdessi St, Bldg Sabbagh, 3rd fl' }, { subtotal: 18.79, delivery: 1.67, discount: 1.88, total: 18.58, pay: 'cash' }),
      mk(40, 9, 'received', 'mazraa', 'pickup', [{ id: 1332, qty: 1, opts: '', price: 40 }], { name: 'Ahmad Itani', phone: '70 455 212', verified: false, address: '' }, { subtotal: 40, delivery: 0, discount: 0, total: 40, pay: 'cash' }),
      mk(39, 14, 'accepted', 'malla', 'delivery', [{ id: 1342, qty: 2, opts: '', price: 5.56 }, { id: 1353, qty: 1, opts: '', price: 8.3 }], { name: 'Nour Khoury', phone: '71 980 115', verified: true, address: 'Verdun, Rashid Karameh St, Dunes bldg' }, { subtotal: 19.42, delivery: 1.67, discount: 1.94, total: 19.15, pay: 'card', prep: 20 }),
      mk(38, 22, 'preparing', 'aramoun', 'delivery', [{ id: 1380, qty: 1, opts: '1 kg · Gift tin', price: 25.22 }], { name: 'Hassan Fakih', phone: '76 221 908', verified: true, address: 'Bchamoun, near Al Rahma mosque' }, { subtotal: 25.22, delivery: 2.5, discount: 2.52, total: 25.2, pay: 'cash', prep: 25 }),
      mk(37, 31, 'onTheWay', 'malla', 'delivery', [{ id: 1334, qty: 1, opts: '', price: 20 }, { id: 1330, qty: 4, opts: '', price: 2.22 }], { name: 'Lea Saad', phone: '03 118 762', verified: true, address: 'Koraytem, Bliss St, Ghandour bldg' }, { subtotal: 28.88, delivery: 1.67, discount: 2.89, total: 27.66, pay: 'cash', driver: 'Khaled', prep: 20 }),
      mk(36, 48, 'onTheWay', 'mazraa', 'delivery', [{ id: 1336, qty: 2, opts: '', price: 4.44 }], { name: 'Omar Sinno', phone: '70 300 544', verified: true, address: 'Barbir, main road, above Byblos Bank' }, { subtotal: 8.88, delivery: 2, discount: 0.89, total: 9.99, pay: 'cash', driver: 'Mahmoud', prep: 15 }),
      mk(35, 95, 'delivered', 'malla', 'delivery', [{ id: 1327, qty: 2, opts: 'Plate', price: 4.93 }], { name: 'Dana Abou Jaoude', phone: '03 740 221', verified: true, address: 'Sanayeh, Spears St' }, { subtotal: 9.86, delivery: 1.67, discount: 0.99, total: 10.54, pay: 'cash', driver: 'Khaled' }),
      mk(34, 130, 'delivered', 'aramoun', 'pickup', [{ id: 1406, qty: 1, opts: 'Gift tin', price: 25.22 }], { name: 'Maya Zeid', phone: '71 004 918', verified: true, address: '' }, { subtotal: 25.22, delivery: 0, discount: 0, total: 25.22, pay: 'card' }),
      mk(33, 210, 'cancelled', 'mazraa', 'delivery', [{ id: 1343, qty: 1, opts: '', price: 4.44 }], { name: 'Unknown caller', phone: '81 555 019', verified: false, address: 'Chiyah' }, { subtotal: 4.44, delivery: 2, discount: 0, total: 6.44, pay: 'cash', cancelReason: 'No answer on confirmation call' }),
      mk(32, 60 * 26, 'delivered', 'intl', 'intl', [{ id: 1407, qty: 2, opts: 'Gift tin', price: 23 }, { id: 1383, qty: 1, opts: '1 kg · Gift tin', price: 43 }], { name: 'Samir El Masri', phone: '+971 50 221 4432', verified: true, address: 'Dubai Marina, Marina Gate 2, Apt 1804, UAE' }, { subtotal: 89, delivery: 74, discount: 0, total: 163, pay: 'card', country: 'AE', tracking: 'DHL 4471 2290 115', weight: 4 }),
      mk(31, 60 * 50, 'onTheWay', 'intl', 'intl', [{ id: 1378, qty: 1, opts: 'Gift tin', price: 23 }, { id: 1380, qty: 2, opts: '1 kg', price: 22.22 }], { name: 'Joanna Tannous', phone: '+1 514 882 0190', verified: true, address: '3450 Rue Drummond, Montréal, QC, Canada' }, { subtotal: 67.44, delivery: 104, discount: 0, total: 171.44, pay: 'card', country: 'CA', tracking: 'DHL 4471 2311 870', weight: 3 }),
    ];
  };

  function getOrders() { let o = load(KEY, null); if (!o) { o = seedOrders(); save(KEY, o); } return o; }
  function setOrders(o) { save(KEY, o); }
  function addOrder(order) { const o = getOrders(); o.unshift(order); setOrders(o); return order; }
  function updateOrder(id, patch) { const o = getOrders().map(x => x.id === id ? { ...x, ...patch } : x); setOrders(o); return o; }

  const MENU_KEY = 'qasr_menu_overrides_v1';
  function menuOverrides() { return load(MENU_KEY, {}); }
  function setMenuOverride(id, patch) { const m = menuOverrides(); m[id] = { ...(m[id] || {}), ...patch }; save(MENU_KEY, m); }
  function liveItems() { const m = menuOverrides(); return items.map(it => ({ ...it, ...(m[it.id] || {}) })); }

  const BR_KEY = 'qasr_branch_overrides_v1';
  function branchOverrides() { return load(BR_KEY, {}); }
  function setBranchOverride(id, patch) { const m = branchOverrides(); m[id] = { ...(m[id] || {}), ...patch }; save(BR_KEY, m); }
  function liveBranches() { const m = branchOverrides(); return branches.map(b => ({ ...b, ...(m[b.id] || {}) })); }

  const STATUS = {
    received: { en: 'New', ar: 'جديد' }, accepted: { en: 'Accepted', ar: 'مقبول' }, preparing: { en: 'Preparing', ar: 'قيد التحضير' },
    ready: { en: 'Ready', ar: 'جاهز' }, onTheWay: { en: 'On the way', ar: 'بالطريق' }, delivered: { en: 'Delivered', ar: 'تم التوصيل' }, cancelled: { en: 'Cancelled', ar: 'ملغى' },
  };
  const isOpen = s => !['delivered', 'cancelled'].includes(s);

  const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);

  return { branches, intl, categories, items, banners, promos, rewards, settings, STATUS, isOpen, money,
    getOrders, setOrders, addOrder, updateOrder, liveItems, setMenuOverride, menuOverrides, liveBranches, setBranchOverride, load, save };
})();

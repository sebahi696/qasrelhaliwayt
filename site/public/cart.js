// Qasr website cart — international shop only. Shares the order store key with the app/staff panel on the same device.
function qcartInit() {
  const { lang, base } = window.QS; const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const T = {
    en: { empty: 'Your cart is empty.', subtotal: 'Subtotal', shipping: 'DHL shipping', total: 'Total', checkout: 'Checkout', free: 'Free', min: 'Minimum international order', addMore: 'Add', forFree: 'more for free shipping', freeOn: 'Free DHL shipping unlocked', added: 'Added to cart', shipTo: 'Ship to', kg: 'kg', dozen: 'dozen', remove: 'Remove' },
    ar: { empty: 'سلتك فارغة.', subtotal: 'المجموع', shipping: 'شحن DHL', total: 'الإجمالي', checkout: 'إتمام الطلب', free: 'مجاني', min: 'الحد الأدنى للطلب الدولي', addMore: 'أضف', forFree: 'للحصول على شحن مجاني', freeOn: 'شحن DHL مجاني', added: 'أُضيف إلى السلة', shipTo: 'الشحن إلى', kg: 'كغ', dozen: 'دزينة', remove: 'إزالة' },
  }; const t = k => T[lang][k];
  const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2); const L = o => o && typeof o === 'object' ? (o[lang] || o.en) : o;
  const load = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let DATA = null, LIVE = false;
  const cfgReq = (() => { const C = window.QASR_CONFIG; if (!C || !C.url) return Promise.resolve(); return fetch(`${C.url}/rest/v1/config?kind=eq.settings&key=eq.global&select=data`, { headers: { apikey: C.anonKey } }).then(r => r.json()).then(rows => { LIVE = !!(rows && rows[0] && rows[0].data && rows[0].data.intlLive); }).catch(() => {}); })();
  const ready = Promise.all([fetch(`${base}/shop-data.json`).then(r => r.json()), cfgReq]).then(([d]) => { DATA = d; render(); });
  const OFF = { en: 'International ordering is being upgraded (online payment & DHL). Send us your order on WhatsApp and we confirm the shipping cost.', ar: 'الطلب الدولي قيد التطوير (الدفع الإلكتروني وDHL). أرسل طلبك عبر واتساب وسنؤكد كلفة الشحن.' };
  const waLink = () => { const L2 = o => o[lang] || o.en; const lines = cart().map(l => { const p = prod(l.handle); return p ? `${l.qty}× ${L2(p.name)}` : ''; }).filter(Boolean).join('\n'); const c = DATA && DATA.intl.countries.find(x => x.code === country()); const msg = (lang === 'ar' ? 'مرحباً قصر الحلويات، أود طلباً للشحن الدولي إلى ' : 'Hello Qasr Al Halaweyat, I would like to order for international shipping to ') + (c ? L2(c.name) : '') + ':\n' + lines; return 'https://wa.me/' + (document.body.dataset.wa || '9613215616') + '?text=' + encodeURIComponent(msg); };
  const cart = () => load('qasr_site_cart', []); const setCart = c => { save('qasr_site_cart', c); render(); };
  const country = () => load('qasr_site_country', 'AE'); const setCountry = c => { save('qasr_site_country', c); render(); };
  const prod = h => DATA && DATA.products.find(p => p.handle === h);
  const count = () => cart().reduce((a, l) => a + l.qty, 0);
  const sub = () => cart().reduce((a, l) => { const p = prod(l.handle); return a + (p ? p.price * l.qty : 0); }, 0);
  const weight = () => cart().reduce((a, l) => { const p = prod(l.handle); return a + (p ? p.weightKg * l.qty : 0); }, 0);
  function fees() { const s = sub(); if (!DATA) return { sub: s, ship: 0, total: s, w: 0, c: null }; const c = DATA.intl.countries.find(x => x.code === country()) || DATA.intl.countries[0]; const w = Math.max(1, Math.ceil(weight())); const ship = s === 0 ? 0 : s >= DATA.intl.freeOver ? 0 : c.base + (w - 1) * c.ratePerKg; return { sub: s, ship, total: s + ship, w, c }; }
  window.QCart = {
    add(handle, qty = 1) { const c = cart(); const l = c.find(x => x.handle === handle); if (l) l.qty += qty; else c.push({ handle, qty }); setCart(c); toast(t('added')); open(); try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} },
    set(handle, qty) { let c = cart(); const l = c.find(x => x.handle === handle); if (!l) return; l.qty = qty; c = c.filter(x => x.qty > 0); setCart(c); },
    clear() { setCart([]); }, fees, cart, country, setCountry, ready, data: () => DATA, open, money, live: () => LIVE, waLink,
  };
  let toastT; function toast(m) { const e = $('#toast'); e.textContent = m; e.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('show'), 1800); }
  function open() { $('#drawer').classList.add('on'); $('#drawerBg').classList.add('on'); } function close() { $('#drawer').classList.remove('on'); $('#drawerBg').classList.remove('on'); }
  $('#cartBtn').onclick = open; $('#drawerX').onclick = close; $('#drawerBg').onclick = close;
  function render() {
    const n = count(); const b = $('#cartN'); b.hidden = !n; b.textContent = n;
    const list = $('#cartList'), foot = $('#cartFoot'); if (!DATA) return;
    if (!n) { list.innerHTML = `<p class="muted" style="text-align:center;padding:40px 0">🍯<br>${t('empty')}</p>`; foot.innerHTML = ''; }
    else {
      list.innerHTML = cart().map(l => { const p = prod(l.handle); if (!p) return ''; return `<div class="cl">${p.img ? `<img src="${base}${p.img}" alt="">` : '<div class="e"></div>'}<div style="flex:1;min-width:0"><div class="n">${L(p.name)}</div><div class="s">${money(p.price)} / ${p.unit === 'dozen' ? t('dozen') : t('kg')} · ${(p.weightKg * l.qty).toFixed(1)} ${t('kg')}</div></div><div class="q"><button data-h="${l.handle}" data-d="-1">−</button><span>${l.qty}</span><button data-h="${l.handle}" data-d="1">+</button></div></div>`; }).join('');
      list.querySelectorAll('.q button').forEach(bt => bt.onclick = () => { const l = cart().find(x => x.handle === bt.dataset.h); QCart.set(bt.dataset.h, l.qty + +bt.dataset.d); });
      const f = fees(); const min = DATA.intl.minOrderUsd, free = DATA.intl.freeOver; const ok = f.sub >= min; const pct = Math.min(100, f.sub / free * 100);
      foot.innerHTML = `<div class="field" style="margin-bottom:10px"><label>${t('shipTo')}</label><select id="cartCountry">${DATA.intl.countries.filter(c => c.enabled).map(c => `<option value="${c.code}" ${c.code === f.c.code ? 'selected' : ''}>${c.flag} ${L(c.name)}</option>`).join('')}</select></div>
        <div class="minbar ${ok ? '' : 'warn'}"><div>${ok ? (f.sub < free ? `🚚 ${t('addMore')} <b class="money">${money(free - f.sub)}</b> ${t('forFree')}` : `✓ ${t('freeOn')}`) : `⚖️ ${t('min')} <b class="money">${money(min)}</b> · ${t('addMore')} <b class="money">${money(min - f.sub)}</b>`}</div><div class="tr"><i style="width:${pct}%"></i></div></div>
        <div class="sum"><span>${t('subtotal')}</span><span class="money">${money(f.sub)}</span></div><div class="sum"><span>${t('shipping')} · ${f.w} ${t('kg')} · ${f.c.flag}</span><span class="money">${f.ship ? money(f.ship) : '<span style="color:var(--ok)">' + t('free') + '</span>'}</span></div><div class="sum tot"><span>${t('total')}</span><span class="money">${money(f.total)}</span></div>
        ${LIVE ? `<a class="btn g" href="${base}/${lang}/shop/checkout/" style="width:100%;margin-top:12px;${ok ? '' : 'opacity:.5;pointer-events:none'}">${t('checkout')} →</a>` : `<div class="muted" style="font-size:12.5px;line-height:1.5;margin-top:10px">⚠️ ${OFF[lang]}</div><a class="btn g" href="${waLink()}" target="_blank" rel="noopener" style="width:100%;margin-top:10px">${lang === 'ar' ? 'أرسل الطلب عبر واتساب' : 'Send order on WhatsApp'} →</a>`}`;
      $('#cartCountry').onchange = e => setCountry(e.target.value);
    }
    document.dispatchEvent(new CustomEvent('qcart', { detail: { n } }));
  }
  render();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', qcartInit); else qcartInit();

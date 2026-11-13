// Cloudflare Pages Function: POST /api/dhl-rates
// Body: { country: "AE", city: "Dubai", postal: "", weightKg: 2.4 }
// Returns { source: "dhl"|"table", products: [{ code, name, price, currency, deliveryDate }] }
// Env (Pages → Settings → Variables): DHL_API_KEY, DHL_API_SECRET, DHL_ACCOUNT (e.g. 467108567), DHL_ENV ("test" | "prod")

const ORIGIN = { country: 'LB', city: 'Beirut', postal: '' };
const BOX = { length: 30, width: 25, height: 15 }; // cm, typical tin box

export async function onRequestPost({ request, env }) {
  let body; try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
  const country = String(body.country || '').toUpperCase().slice(0, 2);
  const weight = Math.max(0.5, Math.min(70, +body.weightKg || 1));
  if (!/^[A-Z]{2}$/.test(country)) return json({ error: 'country' }, 400);

  if (!env.DHL_API_KEY || !env.DHL_API_SECRET || !env.DHL_ACCOUNT) return json({ source: 'table', products: [] });

  const base = env.DHL_ENV === 'prod' ? 'https://express.api.dhl.com/mydhlapi' : 'https://express.api.dhl.com/mydhlapi/test';
  const date = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const q = new URLSearchParams({
    accountNumber: env.DHL_ACCOUNT, originCountryCode: ORIGIN.country, originCityName: ORIGIN.city,
    destinationCountryCode: country, destinationCityName: String(body.city || '').slice(0, 45) || '-',
    weight: String(weight), length: String(BOX.length), width: String(BOX.width), height: String(BOX.height),
    plannedShippingDate: date, isCustomsDeclarable: 'true', unitOfMeasurement: 'metric', nextBusinessDay: 'true',
  });
  if (body.postal) q.set('destinationPostalCode', String(body.postal).slice(0, 12));
  const r = await fetch(`${base}/rates?${q}`, { headers: { Authorization: 'Basic ' + btoa(`${env.DHL_API_KEY}:${env.DHL_API_SECRET}`), Accept: 'application/json' } });
  if (!r.ok) return json({ source: 'table', products: [], dhlStatus: r.status }, 200);
  const d = await r.json();
  const products = (d.products || []).map(p => {
    const tp = (p.totalPrice || []).find(x => x.currencyType === 'BILLC') || (p.totalPrice || [])[0] || {};
    return { code: p.productCode, name: p.productName, price: tp.price, currency: tp.priceCurrency, deliveryDate: p.deliveryCapabilities && p.deliveryCapabilities.estimatedDeliveryDateAndTime };
  }).filter(p => p.price);
  return json({ source: 'dhl', products }, 200, { 'Cache-Control': 'public, max-age=600' });
}

export const onRequestOptions = () => new Response(null, { headers: cors() });
const cors = () => ({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
const json = (o, status = 200, extra = {}) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...cors(), ...extra } });

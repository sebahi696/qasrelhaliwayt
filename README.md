# Qasr Al Halaweyat — ordering app prototype (PWA)

Customer app: `index.html` · Staff panel: `admin.html` · Driver page: `admin.html#d-<orderid>`

Static site, no build. Installable PWA (manifest + service worker, works offline after first load).
Both pages share `data.js`; orders placed in the app appear on the staff board on the same device (localStorage).
Menu, prices and photos come from the live QR menu (`menu-source.json`), 3 Lebanon branches + DHL international.

Local run: `python -m http.server 8080` → http://localhost:8080/
GitHub Pages: Settings → Pages → Deploy from branch `main` / root.

Demo: order a Kaake Cheese with pistachio, apply code `QASR10`, pay cash → open `admin.html` and accept it.

/* ===========================================================
   NIGHTDROP — app.js
   late-night delivery — high-converting WhatsApp shop
   =========================================================== */
(() => {
  'use strict';

  // -------------------------------------------------------
  // 1. CONFIG  (change these to match your business)
  // -------------------------------------------------------
  const CONFIG = {
    whatsapp:       '31612345678',          // ← jouw WhatsApp nummer (zonder +)
    minOrder:       20,
    deliveryFee:    5,
    freeFrom:       50,
    aovTarget:      35,                      // gemiddeld doel
    openHour:       22,                      // 22:00
    closeHour:      4,                       // 04:00 (next day)
    city:           'Nijmegen',
    currency:       '€',
    storageKey:     'nightdrop_cart_v1',
  };

  // -------------------------------------------------------
  // 2. PRODUCTS
  // -------------------------------------------------------
  const BUNDLES = [
    {
      id: 'b-party-xl',
      name: 'Party Pack XL',
      emoji: '🎉',
      desc: 'De avond gemaakt — alles wat je nodig hebt voor 4–6 man.',
      includes: ['Krat bier (24st)', '2× Sterke drank 70cl', 'Chips & nootjes', 'Mixers + ijs'],
      price: 49,
      oldPrice: 69,
      badge: 'best',           // gold
      flag: 'Meeste gekozen',
      stock: 6,
    },
    {
      id: 'b-bier-snack',
      name: 'Bier + Snack Combo',
      emoji: '🍺',
      desc: 'Klassieker. Genoeg drank en snack om de nacht door te komen.',
      includes: ['Krat bier (24st)', '3× zak chips', '1× nootjes', 'Snoepmix'],
      price: 34,
      oldPrice: 45,
      badge: 'hot',            // red
      flag: 'Beste deal 🔥',
      stock: 8,
    },
    {
      id: 'b-premium',
      name: 'Premium Drank Combo',
      emoji: '🥃',
      desc: 'Sterke drank avond. Goeie spullen + alles erbij.',
      includes: ['2× Premium 70cl', 'Cola + Tonic + Red Bull', 'IJsblokjes', '2× snack'],
      price: 44,
      oldPrice: 58,
      badge: 'popular',        // purple
      flag: '€14 voordeel',
      stock: 5,
    },
    {
      id: 'b-snack-fest',
      name: 'Snack Festijn',
      emoji: '🍕',
      desc: 'Geen drank — maar wel veel snacks. Munchies fixed.',
      includes: ['6× zak chips', '4× chocolade', 'Snoepmix', 'Nootjes'],
      price: 27,
      oldPrice: 36,
      badge: null,
      flag: 'Late-night fav',
      stock: 9,
    },
  ];

  const QUICK = [
    { id: 'q-krat-chips', name: 'Krat + Chips', emoji: '🍺', desc: '24× bier + 3 zakken chips', price: 27 },
    { id: 'q-six-snack',  name: '2× Sixpack + Snacks', emoji: '🍻', desc: '12 blikjes + nootjes', price: 25 },
    { id: 'q-wijn-snack', name: 'Wijn + Snacks', emoji: '🍷', desc: '2 flessen + chips + chocolade', price: 29 },
    { id: 'q-mix-pack',   name: 'Mixer Pack', emoji: '🥤', desc: 'Cola + Red Bull + tonic + ijs', price: 12 },
    { id: 'q-vodka-mix',  name: 'Vodka + Mixers', emoji: '🥃', desc: 'Smirnoff 70cl + 4× cola/red bull', price: 28 },
    { id: 'q-late-fix',   name: 'Late-Night Fix', emoji: '🌙', desc: 'Sixpack + chocolade + Red Bull', price: 18 },
  ];

  const DRANK = [
    { id: 'd-heineken',  name: 'Krat Heineken',     emoji: '🍺', meta: '24×30cl', price: 24, oldPrice: 28, stock: 7, flag: 'hot' },
    { id: 'd-hertog',    name: 'Krat Hertog Jan',   emoji: '🍺', meta: '24×30cl', price: 22, oldPrice: 26, stock: 9 },
    { id: 'd-amstel',    name: 'Krat Amstel',       emoji: '🍺', meta: '24×30cl', price: 21, oldPrice: 25, stock: 11 },
    { id: 'd-corona',    name: 'Sixpack Corona',    emoji: '🍻', meta: '6×33cl',  price: 12, oldPrice: 15, stock: 6, flag: 'deal' },
    { id: 'd-bacardi',   name: 'Bacardi Wit',       emoji: '🥃', meta: '70cl',    price: 22, oldPrice: 27, stock: 5 },
    { id: 'd-vodka',     name: 'Smirnoff Vodka',    emoji: '🥃', meta: '70cl',    price: 21, oldPrice: 26, stock: 8 },
    { id: 'd-jd',        name: 'Jack Daniels',      emoji: '🥃', meta: '70cl',    price: 28, oldPrice: 33, stock: 4, flag: 'hot' },
    { id: 'd-malibu',    name: 'Malibu',            emoji: '🥥', meta: '70cl',    price: 19, stock: 7 },
    { id: 'd-rose',      name: 'Wijn Rosé',         emoji: '🍷', meta: '75cl',    price: 11, stock: 10 },
    { id: 'd-rood',      name: 'Wijn Rood',         emoji: '🍷', meta: '75cl',    price: 11, stock: 10 },
  ];

  const SNACKS = [
    { id: 's-lays',     name: 'Lays Naturel',     emoji: '🥔', meta: '200g',  price: 2.50, stock: 14 },
    { id: 's-doritos',  name: 'Doritos Nacho',    emoji: '🌽', meta: '185g',  price: 2.95, stock: 12 },
    { id: 's-tonys',    name: "Tony's Chocolade", emoji: '🍫', meta: '180g',  price: 3.00, stock: 9, flag: 'new' },
    { id: 's-nuts',     name: 'Mix Nootjes',      emoji: '🥜', meta: '300g',  price: 3.50, stock: 8 },
    { id: 's-snoep',    name: 'Snoep Mix',        emoji: '🍬', meta: '400g',  price: 2.50, stock: 11 },
    { id: 's-redbull',  name: 'Red Bull',         emoji: '🪫', meta: '250ml', price: 3.00, stock: 14 },
    { id: 's-cola',     name: 'Coca Cola',        emoji: '🥤', meta: '1.5L',  price: 3.50, stock: 10 },
    { id: 's-tonic',    name: 'Tonic',            emoji: '🥤', meta: '1L',    price: 2.50, stock: 8 },
    { id: 's-ice',      name: 'IJsblokjes',       emoji: '🧊', meta: '1kg',   price: 2.00, stock: 6, flag: 'deal' },
    { id: 's-aansteker',name: 'Aansteker',        emoji: '🔥', meta: '1st',   price: 1.50, stock: 20 },
  ];

  // catalog lookup (everything that's purchasable)
  const CATALOG = new Map();
  [...BUNDLES, ...QUICK, ...DRANK, ...SNACKS].forEach(p => CATALOG.set(p.id, p));

  const REVIEWS = [
    { stars: 5, text: 'Binnen 22 minuten voor de deur. Krat koud, chips erbij. Top service, doe het bijna elk weekend.', name: 'Lisa', area: 'Lent', when: 'eergisteren' },
    { stars: 5, text: 'Party Pack XL gehaald voor verjaardag, was perfect. Ruim genoeg voor 5 man en gewoon cash betalen aan de deur.', name: 'Mark', area: 'Centrum', when: 'vorige week' },
    { stars: 4, text: 'Snel geleverd, alles compleet. Eerst getwijfeld of het legit was — totaal niet. Gewoon legit late-night service.', name: 'Joey', area: 'Dukenburg', when: '3 dagen geleden' },
    { stars: 5, text: 'Het is 02:30 en je krijgt nog gewoon koud bier. Wat wil je nog meer?', name: 'Sam', area: 'Oost', when: 'gisteren' },
    { stars: 5, text: 'Bestelling kwam in 18 min binnen. WhatsApp werkt super soepel, geen gedoe met accounts.', name: 'Daan', area: 'Centrum', when: 'vannacht' },
    { stars: 5, text: 'Beste midnight delivery van Nijmegen. Punt.', name: 'Anouk', area: 'Lent', when: 'vorige week' },
  ];

  // -------------------------------------------------------
  // 3. UTILITIES
  // -------------------------------------------------------
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const fmt = (v) => `${CONFIG.currency}${v.toFixed(2).replace('.', ',')}`;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // -------------------------------------------------------
  // 4. CART
  // -------------------------------------------------------
  const Cart = {
    items: new Map(),

    load() {
      try {
        const raw = localStorage.getItem(CONFIG.storageKey);
        if (!raw) return;
        const arr = JSON.parse(raw);
        arr.forEach(({ id, qty }) => { if (CATALOG.has(id)) this.items.set(id, qty); });
      } catch { /* ignore */ }
    },
    save() {
      const arr = Array.from(this.items, ([id, qty]) => ({ id, qty }));
      try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(arr)); } catch { /* ignore */ }
    },
    add(id, n = 1) {
      if (!CATALOG.has(id)) return;
      this.items.set(id, (this.items.get(id) || 0) + n);
      this.save();
    },
    remove(id) {
      this.items.delete(id);
      this.save();
    },
    setQty(id, n) {
      if (n <= 0) this.items.delete(id);
      else this.items.set(id, n);
      this.save();
    },
    count() {
      let c = 0; this.items.forEach(q => c += q); return c;
    },
    subtotal() {
      let s = 0;
      this.items.forEach((qty, id) => {
        const p = CATALOG.get(id);
        if (p) s += p.price * qty;
      });
      return s;
    },
    delivery() {
      const sub = this.subtotal();
      if (sub === 0) return 0;
      return sub >= CONFIG.freeFrom ? 0 : CONFIG.deliveryFee;
    },
    total() { return this.subtotal() + this.delivery(); },
    savings() {
      let s = 0;
      this.items.forEach((qty, id) => {
        const p = CATALOG.get(id);
        if (p && p.oldPrice) s += (p.oldPrice - p.price) * qty;
      });
      if (this.subtotal() >= CONFIG.freeFrom) s += CONFIG.deliveryFee;
      return s;
    },
    toLines() {
      const lines = [];
      this.items.forEach((qty, id) => {
        const p = CATALOG.get(id);
        if (!p) return;
        lines.push(`${qty}× ${p.name} — ${fmt(p.price * qty)}`);
      });
      return lines;
    },
  };

  // -------------------------------------------------------
  // 5. RENDERERS
  // -------------------------------------------------------
  function renderBundles() {
    const grid = $('#bundleGrid');
    grid.innerHTML = BUNDLES.map(b => {
      const badgeMap = {
        best:    { cls: 'badge-best',    label: '⭐ MEEST GEKOZEN' },
        hot:     { cls: 'badge-hot',     label: '🔥 BESTE DEAL' },
        popular: { cls: 'badge-popular', label: '💜 POPULAIR' },
      };
      const badge = b.badge ? badgeMap[b.badge] : null;
      const featuredCls = b.badge === 'best' ? 'featured' : b.badge === 'hot' ? 'hot' : '';
      const save = b.oldPrice ? Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100) : 0;
      const includes = b.includes.map(i => `<span class="bundle-tag">✓ ${i}</span>`).join('');
      return `
        <article class="bundle-card ${featuredCls}" data-id="${b.id}">
          <div class="bundle-badges">
            ${badge ? `<span class="badge ${badge.cls}">${badge.label}</span>` : '<span></span>'}
            ${save ? `<span class="badge badge-save">−${save}%</span>` : ''}
          </div>
          <div class="bundle-emoji">${b.emoji}</div>
          <div class="bundle-body">
            <h3 class="bundle-name">${b.name}</h3>
            <p class="bundle-desc">${b.desc}</p>
            <div class="bundle-includes">${includes}</div>
            <div class="bundle-meta">
              <div class="price-row">
                ${b.oldPrice ? `<span class="price-old">${fmt(b.oldPrice)}</span>` : ''}
                <span class="price-now">${fmt(b.price)}</span>
                ${b.oldPrice ? `<span class="price-save">−${fmt(b.oldPrice - b.price)}</span>` : ''}
              </div>
              <div class="bundle-stock" data-stock="${b.id}">Nog ${b.stock}</div>
            </div>
            <div class="bundle-actions">
              <button class="cta cta-whatsapp cta-glow" data-action="quickbuy" data-id="${b.id}">
                <span>⚡</span><span>Bestel direct via WhatsApp</span>
              </button>
              <button class="add-mini" data-action="add" data-id="${b.id}" aria-label="Toevoegen">+</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderQuick() {
    const grid = $('#quickGrid');
    grid.innerHTML = QUICK.map(q => `
      <button class="quick-card" data-action="quickbuy" data-id="${q.id}">
        <div class="quick-emoji">${q.emoji}</div>
        <div class="quick-name">${q.name}</div>
        <div class="quick-desc">${q.desc}</div>
        <div class="quick-foot">
          <div class="quick-price">${fmt(q.price)}</div>
          <span class="quick-go">→</span>
        </div>
      </button>
    `).join('');
  }

  function renderProducts(items, gridSel) {
    const grid = $(gridSel);
    grid.innerHTML = items.map(p => {
      const flagMap = { hot: 'BESTSELLER', deal: 'DEAL', new: 'NIEUW' };
      const flagCls = p.flag ? `product-flag ${p.flag}` : '';
      const flag = p.flag ? `<span class="${flagCls}">${flagMap[p.flag] || p.flag}</span>` : '';
      const stock = (typeof p.stock === 'number' && p.stock <= 8)
        ? `<span class="stock-pill" data-stock="${p.id}">Nog ${p.stock}</span>`
        : '';
      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-img-wrap">
            ${flag}
            ${stock}
            <span aria-hidden="true">${p.emoji}</span>
          </div>
          <div class="product-body">
            <h4 class="product-name">${p.name}</h4>
            ${p.meta ? `<p class="product-meta">${p.meta}</p>` : ''}
            <div class="product-foot">
              <div class="product-price">
                <span class="product-price-now">${fmt(p.price)}</span>
                ${p.oldPrice ? `<span class="product-price-old">${fmt(p.oldPrice)}</span>` : ''}
              </div>
              <button class="add-btn" data-action="add" data-id="${p.id}" aria-label="Toevoegen">+</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderReviews() {
    const grid = $('#reviewGrid');
    grid.innerHTML = REVIEWS.map(r => `
      <article class="review-card">
        <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="review-meta">
          <span class="review-author">
            <span class="review-avatar">${r.name[0]}</span>
            ${r.name} · ${r.area}
          </span>
          <span>${r.when}</span>
        </div>
      </article>
    `).join('');
  }

  // -------------------------------------------------------
  // 6. CART BAR (sticky)
  // -------------------------------------------------------
  function updateCartBar() {
    const sub = Cart.subtotal();
    const count = Cart.count();
    const total = Cart.total();

    $('#cartCount').textContent = count;
    $('#cartTotal').textContent = fmt(total);

    // progress bar
    const progressFill = $('#progressFill');
    const progressText = $('#progressText');
    const target = CONFIG.freeFrom;
    const pct = clamp((sub / target) * 100, 0, 100);
    progressFill.style.width = pct + '%';

    if (sub === 0) {
      progressText.innerHTML = `🛒 Min. bestelling <strong>${fmt(CONFIG.minOrder)}</strong> · gratis bezorging vanaf <strong>${fmt(CONFIG.freeFrom)}</strong>`;
      progressText.classList.remove('complete');
    } else if (sub < CONFIG.minOrder) {
      const need = CONFIG.minOrder - sub;
      progressText.innerHTML = `Voeg <strong>${fmt(need)}</strong> toe — min. bestelling is ${fmt(CONFIG.minOrder)}`;
      progressText.classList.remove('complete');
    } else if (sub < target) {
      const need = target - sub;
      progressText.innerHTML = `🚀 Nog <strong>${fmt(need)}</strong> voor <strong>GRATIS bezorging</strong>`;
      progressText.classList.remove('complete');
    } else {
      progressText.innerHTML = `🎉 <strong>GRATIS bezorging unlocked!</strong> Je bespaart ${fmt(CONFIG.deliveryFee)}`;
      progressText.classList.add('complete');
    }

    // checkout button state — empty cart routes to Builder so it's always actionable
    const btn = $('#checkoutBtn');
    const lbl = btn.querySelector('span:last-child');
    if (sub === 0) {
      btn.disabled = false;
      lbl.textContent = 'Bestel in 30 sec';
    } else if (sub >= CONFIG.minOrder) {
      btn.disabled = false;
      lbl.textContent = `Bestel · ${fmt(total)}`;
    } else {
      btn.disabled = true;
      lbl.textContent = `Min. ${fmt(CONFIG.minOrder)}`;
    }
  }

  function bumpCart() {
    const el = $('#cartCount');
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  // -------------------------------------------------------
  // 7. DRAWER
  // -------------------------------------------------------
  function openDrawer() {
    $('#drawer').classList.add('open');
    $('#drawerOverlay').classList.add('open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderDrawer();
  }
  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawerOverlay').classList.remove('open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function renderDrawer() {
    const body = $('#drawerBody');
    const foot = $('#drawerFoot');

    if (Cart.items.size === 0) {
      body.innerHTML = `
        <div class="drawer-empty">
          <div class="emoji">🛒</div>
          <strong>Je mandje is leeg</strong>
          <p>Pak een bundel — meeste mensen besparen tot €20.</p>
          <button class="cta cta-primary" data-action="closedrawer">Bekijk bundels</button>
        </div>`;
      foot.innerHTML = '';
      return;
    }

    const itemsHtml = Array.from(Cart.items, ([id, qty]) => {
      const p = CATALOG.get(id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <div class="cart-item-emoji">${p.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${qty}× ${fmt(p.price)} = <strong>${fmt(p.price * qty)}</strong></div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Min">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Plus">+</button>
          </div>
        </div>`;
    }).join('');

    // upsell logic
    let upsellHtml = '';
    const sub = Cart.subtotal();
    const upsellSuggestions = getUpsellSuggestions();
    if (upsellSuggestions.length > 0 && sub < CONFIG.freeFrom) {
      const needed = CONFIG.freeFrom - sub;
      const head = needed > 0
        ? `💡 Voeg <strong>${fmt(needed)}</strong> toe en bezorging is <strong>gratis</strong>:`
        : `💡 Voeg toe voor extra waarde:`;
      const chips = upsellSuggestions.map(p =>
        `<button class="upsell-chip" data-action="add" data-id="${p.id}">${p.emoji} ${p.name} +${fmt(p.price)}</button>`
      ).join('');
      upsellHtml = `<div class="upsell"><div>${head}</div><div class="upsell-row">${chips}</div></div>`;
    }

    body.innerHTML = itemsHtml + upsellHtml;

    const delivery = Cart.delivery();
    const savings = Cart.savings();
    foot.innerHTML = `
      <div class="totals">
        <div class="totals-row"><span>Subtotaal</span><span>${fmt(sub)}</span></div>
        <div class="totals-row ${delivery === 0 ? 'discount' : 'muted'}">
          <span>Bezorging</span>
          <span>${delivery === 0 ? 'GRATIS' : fmt(delivery)}</span>
        </div>
        ${savings > 0 ? `<div class="totals-row discount"><span>Jouw besparing</span><span>−${fmt(savings)}</span></div>` : ''}
        <div class="totals-row grand"><span>Totaal</span><span>${fmt(Cart.total())}</span></div>
      </div>
      <button class="cta cta-whatsapp cta-glow" data-action="checkout" ${sub < CONFIG.minOrder ? 'disabled' : ''}>
        <span>⚡</span>
        <span>${sub < CONFIG.minOrder ? `Min. ${fmt(CONFIG.minOrder)} — voeg toe` : `Bestel via WhatsApp · ${fmt(Cart.total())}`}</span>
      </button>
      <p style="font-size:11.5px;color:var(--text-mute);text-align:center;">
        Cash bij levering · Geen account · 18+
      </p>
    `;
  }

  function getUpsellSuggestions() {
    // suggest cheap snacks/extras not yet in cart
    const inCart = new Set(Cart.items.keys());
    return [...SNACKS, ...DRANK]
      .filter(p => !inCart.has(p.id) && p.price >= 2 && p.price <= 4)
      .slice(0, 4);
  }

  // -------------------------------------------------------
  // 8. WHATSAPP CHECKOUT
  // -------------------------------------------------------
  function buildWhatsAppMessage(extra = '') {
    const lines = Cart.toLines();
    const sub = Cart.subtotal();
    const del = Cart.delivery();
    const savings = Cart.savings();
    const parts = [
      `🌙 *NIGHTDROP bestelling*`,
      ``,
      ...lines.map(l => `• ${l}`),
      ``,
      `Subtotaal: ${fmt(sub)}`,
      `Bezorging: ${del === 0 ? 'GRATIS 🎉' : fmt(del)}`,
      savings > 0 ? `Besparing: ${fmt(savings)} 💸` : '',
      `*Totaal: ${fmt(Cart.total())}*`,
      ``,
      `📍 Bezorgadres: `,
      `🕐 Bezorgtijd: zsm`,
      `💸 Cash bij levering`,
      extra ? `\n${extra}` : '',
    ].filter(Boolean);
    return parts.join('\n');
  }

  function buildQuickBuyMessage(productId) {
    const p = CATALOG.get(productId);
    if (!p) return '';
    const lines = [
      `🌙 *NIGHTDROP bestelling*`,
      ``,
      `• 1× ${p.name} — ${fmt(p.price)}`,
      ...(p.includes ? p.includes.map(i => `   ↳ ${i}`) : []),
      ``,
      `Subtotaal: ${fmt(p.price)}`,
      `Bezorging: ${p.price >= CONFIG.freeFrom ? 'GRATIS 🎉' : fmt(CONFIG.deliveryFee)}`,
      `*Totaal: ${fmt(p.price + (p.price >= CONFIG.freeFrom ? 0 : CONFIG.deliveryFee))}*`,
      ``,
      `📍 Bezorgadres: `,
      `🕐 Bezorgtijd: zsm`,
      `💸 Cash bij levering`,
    ];
    return lines.join('\n');
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  function checkout() {
    // Empty cart → guide user through the 30-sec builder
    if (Cart.items.size === 0) { Builder.open(); return; }
    if (Cart.subtotal() < CONFIG.minOrder) {
      toast(`Minimum bestelling is ${fmt(CONFIG.minOrder)}. Voeg nog wat toe!`);
      return;
    }
    openWhatsApp(buildWhatsAppMessage());
  }

  function quickbuy(id) {
    const p = CATALOG.get(id);
    if (!p) return;
    if (p.price < CONFIG.minOrder) {
      // single item below min — just add to cart
      Cart.add(id);
      updateCartBar();
      toast(`${p.emoji} ${p.name} toegevoegd · voeg meer toe (min ${fmt(CONFIG.minOrder)})`);
      return;
    }
    openWhatsApp(buildQuickBuyMessage(id));
  }

  // -------------------------------------------------------
  // 9. TOAST
  // -------------------------------------------------------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // -------------------------------------------------------
  // 10. COUNTDOWN
  // -------------------------------------------------------
  function getCloseTime() {
    const now = new Date();
    const close = new Date(now);
    close.setHours(CONFIG.closeHour, 0, 0, 0);
    if (close <= now) close.setDate(close.getDate() + 1);
    return close;
  }
  function getOpenTime() {
    const now = new Date();
    const open = new Date(now);
    open.setHours(CONFIG.openHour, 0, 0, 0);
    if (open <= now) open.setDate(open.getDate() + 1);
    return open;
  }
  function isOpen() {
    const h = new Date().getHours();
    // open from openHour to closeHour (across midnight)
    if (CONFIG.openHour > CONFIG.closeHour) {
      return h >= CONFIG.openHour || h < CONFIG.closeHour;
    }
    return h >= CONFIG.openHour && h < CONFIG.closeHour;
  }

  function updateCountdown() {
    const open = isOpen();
    const target = open ? getCloseTime() : getOpenTime();
    const diff = target - new Date();
    const totalMin = Math.max(0, Math.floor(diff / 60000));
    const hh = Math.floor(totalMin / 60);
    const mm = totalMin % 60;
    const display = hh > 0 ? `${hh}u ${String(mm).padStart(2, '0')}m` : `${mm} min`;

    const urgencyText = document.querySelector('.urgency-text');
    const pill = $('#statusPill');
    const pillText = $('#statusText');

    let html;
    if (open && totalMin <= 60) {
      pill.classList.remove('closed');
      pillText.textContent = `OPEN · ~30 min`;
      html = `<strong>⚠️ Sluit over <span id="countdown">${display}</span></strong> · laatste kans vannacht — straks dicht = geen levering`;
    } else if (open) {
      pill.classList.remove('closed');
      pillText.textContent = `OPEN · ~30 min`;
      html = `<strong>Sluit over <span id="countdown">${display}</span></strong> · laatste bezorgronde — straks dicht = geen levering`;
    } else {
      pill.classList.add('closed');
      pillText.textContent = `DICHT · open over ${display}`;
      html = `<strong>💤 Nu dicht</strong> · open vanaf 22:00 — opent over <span id="countdown">${display}</span>`;
    }
    if (urgencyText && urgencyText.innerHTML.trim() !== html.trim()) {
      urgencyText.innerHTML = html;
    }
  }

  // -------------------------------------------------------
  // 11. LIVE TICKER
  // -------------------------------------------------------
  const TICKER_NAMES = ['Lisa', 'Mark', 'Joey', 'Sam', 'Daan', 'Anouk', 'Kevin', 'Sara', 'Tom', 'Eva', 'Jasper', 'Yara', 'Niek', 'Roos'];
  const TICKER_AREAS = ['Lent', 'Centrum', 'Dukenburg', 'Oost', 'West', 'Hatert', 'Bottendaal'];
  const TICKER_PRODUCTS = ['Party Pack XL', 'Krat Heineken', 'Bier + Snack Combo', 'Premium Drank Combo', 'Krat Hertog Jan', 'Vodka + Mixers', '2× Sixpack + Snacks'];

  function buildTickerMessages() {
    const out = [];
    for (let i = 0; i < 10; i++) {
      const name = pick(TICKER_NAMES);
      const area = pick(TICKER_AREAS);
      const prod = pick(TICKER_PRODUCTS);
      const min = rand(1, 14);
      out.push(`<strong>${name}</strong> uit ${area} bestelde <strong>${prod}</strong> · ${min} min geleden`);
    }
    out.push(`🔥 <strong>Party Pack XL</strong> = meest gekozen om 02:00`);
    out.push(`✅ Vanavond al <strong>89 bezorgingen</strong> voltooid in ${CONFIG.city}`);
    out.push(`⚡ Gemiddelde levertijd vannacht: <strong>27 minuten</strong>`);
    out.push(`💸 Klanten besparen gemiddeld <strong>€11</strong> met een bundel`);
    return out;
  }

  function renderTicker() {
    const track = $('#tickerTrack');
    const msgs = buildTickerMessages();
    // duplicate so the loop is seamless
    track.innerHTML = [...msgs, ...msgs].map(m => `<span>${m}</span>`).join('');
  }

  // -------------------------------------------------------
  // 12. LIVE ORDERS PULSE COUNTER
  // -------------------------------------------------------
  let liveOrders = rand(9, 16);
  function bumpLiveOrders() {
    const delta = rand(-2, 3);
    liveOrders = clamp(liveOrders + delta, 7, 22);
    const el = $('#liveOrders');
    if (el) el.textContent = liveOrders;
  }

  // -------------------------------------------------------
  // 13. SCARCITY (stock decreases over time)
  // -------------------------------------------------------
  function decreaseStock() {
    const all = [...BUNDLES, ...DRANK, ...SNACKS].filter(p => typeof p.stock === 'number');
    const target = pick(all);
    if (!target) return;
    if (target.stock > 2 && Math.random() < 0.5) {
      target.stock -= 1;
      const stockEl = document.querySelector(`[data-stock="${target.id}"]`);
      if (stockEl) stockEl.textContent = `Nog ${target.stock}`;
    }
  }

  // -------------------------------------------------------
  // 14. EVENT DELEGATION
  // -------------------------------------------------------
  function handleClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    switch (action) {
      case 'add': {
        if (!id) return;
        Cart.add(id);
        updateCartBar();
        bumpCart();
        const card = btn.closest('.product-card, .bundle-card, .quick-card');
        if (card) {
          card.classList.remove('pop');
          void card.offsetWidth;
          card.classList.add('pop');
        }
        if (btn.classList.contains('add-btn')) {
          btn.classList.add('added');
          btn.textContent = '✓';
          setTimeout(() => { btn.classList.remove('added'); btn.textContent = '+'; }, 900);
        }
        const p = CATALOG.get(id);
        toast(`${p.emoji} ${p.name} toegevoegd · ${fmt(Cart.subtotal())}`);
        if (Cart.items.size > 0 && $('#drawer').classList.contains('open')) renderDrawer();
        e.stopPropagation();
        break;
      }
      case 'quickbuy': {
        if (!id) return;
        quickbuy(id);
        e.stopPropagation();
        break;
      }
      case 'inc': { Cart.setQty(id, (Cart.items.get(id) || 0) + 1); updateCartBar(); renderDrawer(); break; }
      case 'dec': { Cart.setQty(id, (Cart.items.get(id) || 0) - 1); updateCartBar(); renderDrawer(); break; }
      case 'checkout': { checkout(); break; }
      case 'closedrawer': { closeDrawer(); break; }
    }
  }

  // -------------------------------------------------------
  // 15. TAB SCROLL HIGHLIGHT
  // -------------------------------------------------------
  function setupTabHighlight() {
    const tabs = $$('.tab');
    const sections = tabs.map(t => $(t.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        tabs.forEach(t => t.classList.toggle('tab-active', t.dataset.tab === id));
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => io.observe(s));
  }

  // -------------------------------------------------------
  // 15b. ORDER BUILDER (guided 2-click flow)
  // -------------------------------------------------------
  const Builder = (() => {
    const BUNDLES = [
      { id: 'qf', name: 'Quick Fix',      price: 29, emoji: '⚡', desc: 'Snel & simpel — voor 1–2 man' },
      { id: 'ps', name: 'Party Starter',  price: 49, emoji: '🔥', desc: 'Voor 3–5 man · ideaal voor de start van de avond', featured: true, flag: '🔥 MEEST GEKOZEN' },
      { id: 'ap', name: 'Afterparty Box', price: 69, emoji: '🌙', desc: 'Big night — voor 5+ man, alles erop en eraan' },
    ];
    const EXTRAS = [
      { id: 'chips', name: 'Chips', price: 4.95, emoji: '🍿', desc: 'Lays / Doritos mix bag', popular: true },
      { id: 'fris',  name: 'Fris',  price: 3.95, emoji: '🥤', desc: 'Cola of Fanta 1.5L' },
      { id: 'bier',  name: 'Bier',  price: 5.95, emoji: '🍺', desc: 'Sixpack erbij',     popular: true },
    ];
    const POPULAR = ['chips', 'bier'];

    const state = { bundle: 'ps', extras: { chips: 0, fris: 0, bier: 0 }, testMode: false };
    let logoTaps = 0; let logoTimer = null;

    const getBundle = () => BUNDLES.find(b => b.id === state.bundle);
    const total = () => {
      const b = getBundle();
      let t = b ? b.price : 0;
      EXTRAS.forEach(e => { t += e.price * (state.extras[e.id] || 0); });
      return t;
    };
    const selected = () => EXTRAS.filter(e => (state.extras[e.id] || 0) > 0);

    function renderBundles() {
      $('#builderBundles').innerHTML = BUNDLES.map(b => `
        <button type="button"
          class="builder-bundle ${b.featured ? 'featured' : ''} ${state.bundle === b.id ? 'selected' : ''}"
          data-action="b-select" data-bundle="${b.id}"
          aria-pressed="${state.bundle === b.id}">
          <div class="builder-radio"></div>
          <div class="builder-bundle-icon">${b.emoji}</div>
          <div class="builder-bundle-info">
            <div class="builder-bundle-row"><strong>${b.name}</strong></div>
            <span class="builder-bundle-desc">${b.desc}</span>
            ${b.flag ? `<span class="builder-bundle-flag">${b.flag}</span>` : ''}
          </div>
          <span class="builder-bundle-price">${fmt(b.price)}</span>
        </button>
      `).join('');
    }

    function renderExtras() {
      $('#builderExtras').innerHTML = EXTRAS.map(e => {
        const q = state.extras[e.id] || 0;
        return `
          <div class="builder-extra ${q > 0 ? 'has' : ''}">
            <div class="builder-extra-icon">${e.emoji}</div>
            <div class="builder-extra-info">
              <div class="builder-extra-row">
                <strong>${e.name}</strong>
                <span class="builder-extra-price">+${fmt(e.price)}</span>
              </div>
              <span class="builder-extra-desc">${e.desc}${e.popular ? ' · 🔥 vaak samen' : ''}</span>
            </div>
            <div class="builder-qty">
              <button type="button" class="qty-btn dec" data-action="b-dec" data-extra="${e.id}" aria-label="Minder ${e.name}" ${q === 0 ? 'disabled' : ''}>−</button>
              <span class="qty-num" id="bqty-${e.id}">${q}</span>
              <button type="button" class="qty-btn" data-action="b-inc" data-extra="${e.id}" aria-label="Meer ${e.name}">+</button>
            </div>
          </div>`;
      }).join('');
    }

    function refreshBundles() {
      $$('#builderBundles .builder-bundle').forEach(el => {
        const sel = el.dataset.bundle === state.bundle;
        el.classList.toggle('selected', sel);
        el.setAttribute('aria-pressed', sel);
      });
    }
    function refreshExtra(id) {
      const q = state.extras[id] || 0;
      const num = document.getElementById(`bqty-${id}`);
      if (num) num.textContent = q;
      const wrap = num && num.closest('.builder-extra');
      if (wrap) wrap.classList.toggle('has', q > 0);
      const dec = wrap && wrap.querySelector('.qty-btn.dec');
      if (dec) dec.disabled = q === 0;
    }
    function refreshTotal() {
      const el = $('#builderTotal');
      if (!el) return;
      el.textContent = fmt(total());
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }

    function open() {
      renderBundles();
      renderExtras();
      refreshTotal();
      $('#builderSheet').classList.add('open');
      $('#builderOverlay').classList.add('open');
      $('#builderSheet').setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      $('#builderSheet').classList.remove('open');
      $('#builderOverlay').classList.remove('open');
      $('#builderSheet').setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function setBundle(id) {
      if (!BUNDLES.some(b => b.id === id)) return;
      state.bundle = id;
      refreshBundles(); refreshTotal();
    }
    function change(id, delta) {
      const cur = state.extras[id] || 0;
      state.extras[id] = clamp(cur + delta, 0, 9);
      refreshExtra(id); refreshTotal();
    }
    function takePopular() {
      state.bundle = 'ps';
      EXTRAS.forEach(e => { state.extras[e.id] = POPULAR.includes(e.id) ? 1 : 0; });
      refreshBundles();
      EXTRAS.forEach(e => refreshExtra(e.id));
      refreshTotal();
      const pp = $('#popularPick');
      if (pp) { pp.classList.remove('pop'); void pp.offsetWidth; pp.classList.add('pop'); }
    }

    function buildMessage() {
      const b = getBundle();
      const extras = selected();
      const lines = [];
      if (state.testMode) lines.push('🧪 TEST BESTELLING', '');
      lines.push('Hey NightDrop! Ik wil bestellen:', '');
      lines.push(`📦 Bundle: ${b.name} (${fmt(b.price)})`, '');
      lines.push(`➕ Extra's:`);
      if (extras.length === 0) {
        lines.push('- geen');
      } else {
        extras.forEach(e => {
          const q = state.extras[e.id];
          lines.push(`- ${q}× ${e.name} (${fmt(e.price * q)})`);
        });
      }
      lines.push('', `💰 Totaal: ${fmt(total())}`, '');
      lines.push(`📍 Adres: ${state.testMode ? 'Teststraat 123, Nijmegen' : ''}`);
      lines.push(`💳 Betaaloptie: Tikkie / contant`);
      lines.push('');
      lines.push('Kunnen jullie dit binnen 30 min leveren?');
      return lines.join('\n');
    }

    function go() {
      const msg = buildMessage();
      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');
      setTimeout(close, 250);
    }

    function setTestMode(on, silent) {
      state.testMode = !!on;
      const badge = $('#testBadge');
      if (badge) badge.hidden = !state.testMode;
      const lbl = $('#builderGoLabel');
      if (lbl) lbl.textContent = state.testMode ? 'Verstuur TEST naar WhatsApp' : 'Ga door naar WhatsApp';
      if (!silent) toast(state.testMode ? '🧪 Testmodus AAN — bericht wordt als test verstuurd' : 'Testmodus uit');
    }

    function onLogoTap(e) {
      e.preventDefault();
      logoTaps++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoTaps = 0; }, 1800);
      if (logoTaps >= 5) { logoTaps = 0; setTestMode(!state.testMode); }
    }

    function onSheetClick(e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const a = btn.dataset.action;
      if      (a === 'b-select') setBundle(btn.dataset.bundle);
      else if (a === 'b-inc')    change(btn.dataset.extra, +1);
      else if (a === 'b-dec')    change(btn.dataset.extra, -1);
    }

    function mount() {
      if (new URLSearchParams(location.search).has('test')) setTestMode(true, true);

      const logo = document.querySelector('.logo');
      if (logo) logo.addEventListener('click', onLogoTap);

      $('#heroBuilder')?.addEventListener('click', open);
      $('#builderClose')?.addEventListener('click', close);
      $('#builderOverlay')?.addEventListener('click', close);
      $('#popularPick')?.addEventListener('click', takePopular);
      $('#builderGo')?.addEventListener('click', go);
      $('#builderSheet')?.addEventListener('click', onSheetClick);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && $('#builderSheet').classList.contains('open')) close();
      });

      // initial render so the panel is ready when opened
      renderBundles(); renderExtras(); refreshTotal();
    }

    return { mount, open, close, setTestMode };
  })();

  // -------------------------------------------------------
  // 16. INIT
  // -------------------------------------------------------
  function init() {
    Cart.load();

    renderBundles();
    renderQuick();
    renderProducts(DRANK,  '#drankGrid');
    renderProducts(SNACKS, '#snackGrid');
    renderReviews();
    renderTicker();

    updateCartBar();
    updateCountdown();
    bumpLiveOrders();

    // Sticky cart-bar interactions
    $('#cartSummary').addEventListener('click', openDrawer);
    $('#checkoutBtn').addEventListener('click', checkout);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawerOverlay').addEventListener('click', closeDrawer);

    // Global delegated clicks
    document.addEventListener('click', handleClick);

    // Smooth tab scrolling
    $$('.tab').forEach(t => {
      t.addEventListener('click', (e) => {
        const target = $(t.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    setupTabHighlight();
    Builder.mount();

    // Loops
    setInterval(updateCountdown, 30 * 1000);
    const loop = (fn, min, max) => {
      const tick = () => { fn(); setTimeout(tick, rand(min, max)); };
      setTimeout(tick, rand(min, max));
    };
    loop(bumpLiveOrders, 7000, 12000);
    loop(decreaseStock, 15000, 30000);

    // Aov nudge once after 25s if cart is small
    setTimeout(() => {
      const sub = Cart.subtotal();
      if (sub > 0 && sub < CONFIG.aovTarget) {
        toast(`💡 Tip: pak een bundel — bespaar tot €20 én gratis bezorging`);
      } else if (sub === 0) {
        toast(`🔥 Party Pack XL is meest gekozen vanavond`);
      }
    }, 25000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* NachtDrop - Order app
 * Static cart + WhatsApp checkout + tab navigation
 */
(function(){
'use strict';

var WA_NUMBER = '31612345678';
var MIN_ORDER = 30;
var FREE_SHIP = 50;
var SHIP_COST = 5;

/* Closing hours: weekday 04:00, weekend (Fri/Sat) 05:30 */
function getCloseTime(now){
  var d = new Date(now.getTime());
  var day = d.getDay(); /* 0 Sun .. 6 Sat */
  var hour = d.getHours();
  /* Default close: 04:00 next day */
  var closeH = 4, closeM = 0;
  /* Friday night (Fri 20:00 to Sat 05:30) and Saturday night (Sat 20:00 to Sun 05:30) */
  if(day === 5 || day === 6){ closeH = 5; closeM = 30; }
  /* If it's before 6 AM, close time is today */
  var close = new Date(d);
  if(hour < 6){
    close.setHours(closeH, closeM, 0, 0);
  } else {
    /* After 6 AM - close time is next day */
    close.setDate(close.getDate() + 1);
    /* Determine next day's close based on next day */
    var nextDay = (day + 1) % 7;
    if(nextDay === 6 || nextDay === 0){ /* tomorrow is Sat or Sun (after Fri/Sat night) */
      closeH = 5; closeM = 30;
    } else {
      closeH = 4; closeM = 0;
    }
    close.setHours(closeH, closeM, 0, 0);
  }
  return close;
}

function isOpenNow(now){
  var hour = now.getHours();
  /* Open: 20:00 - 04:00 (or 05:30 weekend) */
  if(hour >= 20) return true;
  if(hour < 6){
    var close = getCloseTime(now);
    return now < close;
  }
  return false;
}

/* ------------------- PRODUCT DATA ------------------- */
var BUNDLES = [
  {id:'bdl-quick',  name:'Quick Fix',       desc:'6 biertjes + grote zak chips. Klaar in 30 min.', price:29, oldPrice:35, save:6,  emoji:'\uD83C\uDF7A\uD83C\uDF5F',                  tag:'POPULAIR',   tagClass:'btag-g',    cardClass:'bc-g'},
  {id:'bdl-party',  name:'Party Starter',   desc:'Krat Heineken + 3 snacks naar keuze.',           price:49, oldPrice:58, save:9,  emoji:'\uD83C\uDF7B\uD83C\uDF55\uD83C\uDF7F',     tag:'BESTSELLER', tagClass:'btag-gold', cardClass:'bc-gold'},
  {id:'bdl-after',  name:'Afterparty Box',  desc:'Bier + wijn + shots + snacks mix voor de groep.',price:69, oldPrice:82, save:13, emoji:'\uD83E\uDD43\uD83C\uDF77\uD83C\uDF7F',     tag:'PREMIUM',    tagClass:'btag-p',    cardClass:'bc-p'},
  {id:'bdl-wijn',   name:'Wijn Avond',      desc:'2 flessen wijn + kaasjes + crackers.',           price:39, oldPrice:46, save:7,  emoji:'\uD83C\uDF77\uD83E\uDDC0',                  tag:'COZY',       tagClass:'btag-r',    cardClass:'bc-r'},
  {id:'bdl-movie',  name:'Movie Night',     desc:'Cola + chips + popcorn + chocolade.',            price:34, oldPrice:40, save:6,  emoji:'\uD83E\uDD64\uD83C\uDF7F\uD83C\uDF6B',     tag:'CHILL',      tagClass:'btag-hot',  cardClass:'bc-o'}
];

var BIER = [
  {id:'bi-hei-los', brand:'Heineken',   name:'Pils 33cl',      size:'Los',     price:2.50, emoji:'\uD83C\uDF7A', tag:'18+', tagClass:'ptag-18'},
  {id:'bi-hei-6',   brand:'Heineken',   name:'6-pack 33cl',    size:'6 stuks', price:13.00, emoji:'\uD83C\uDF7A', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'bi-hei-krat',brand:'Heineken',   name:'Krat 24x33cl',   size:'Krat',    price:22.00, emoji:'\uD83C\uDF7B', tag:'KRAT', tagClass:'ptag-pack'},
  {id:'bi-hj-los',  brand:'Hertog Jan', name:'Pils 33cl',      size:'Los',     price:2.50, emoji:'\uD83C\uDF7A', tag:'18+', tagClass:'ptag-18'},
  {id:'bi-hj-krat', brand:'Hertog Jan', name:'Krat 24x30cl',   size:'Krat',    price:22.00, emoji:'\uD83C\uDF7B', tag:'KRAT', tagClass:'ptag-pack'},
  {id:'bi-cor-los', brand:'Corona',     name:'Extra 33cl',     size:'Los',     price:3.00, emoji:'\uD83C\uDF7A', tag:'NIEUW', tagClass:'ptag-new'},
  {id:'bi-cor-6',   brand:'Corona',     name:'6-pack 33cl',    size:'6 stuks', price:15.00, emoji:'\uD83C\uDF7A', tag:'18+', tagClass:'ptag-18'},
  {id:'bi-des',     brand:'Desperados', name:'Tequila 33cl',   size:'Los',     price:3.50, emoji:'\uD83C\uDF7A', tag:'HOT', tagClass:'ptag-hot'},
  {id:'bi-grol',    brand:'Grolsch',    name:'Pils 33cl',      size:'Los',     price:2.50, emoji:'\uD83C\uDF7A', tag:'18+', tagClass:'ptag-18'},
  {id:'bi-amst',    brand:'Amstel',     name:'Krat 24x30cl',   size:'Krat',    price:20.00, emoji:'\uD83C\uDF7B', tag:'KRAT', tagClass:'ptag-pack'},
  {id:'bi-brand',   brand:'Brand',      name:'Pils 30cl',      size:'Los',     price:2.30, emoji:'\uD83C\uDF7A', tag:'18+', tagClass:'ptag-18'},
  {id:'bi-bav-krat',brand:'Bavaria',    name:'Krat 24x30cl',   size:'Krat',    price:18.00, emoji:'\uD83C\uDF7B', tag:'BUDGET', tagClass:'ptag-pack'}
];

var WIJN = [
  {id:'wj-rood',  brand:'Cabernet',  name:'Rode wijn 75cl',  size:'Fles',  price:12.00, emoji:'\uD83C\uDF77', tag:'18+', tagClass:'ptag-18'},
  {id:'wj-wit',   brand:'Chardonnay',name:'Witte wijn 75cl', size:'Fles',  price:12.00, emoji:'\uD83C\uDF77', tag:'18+', tagClass:'ptag-18'},
  {id:'wj-rose',  brand:'Provence',  name:'Rose 75cl',       size:'Fles',  price:11.00, emoji:'\uD83C\uDF77', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'wj-pros',  brand:'Prosecco',  name:'Mousserend 75cl', size:'Fles',  price:15.00, emoji:'\uD83C\uDF7E', tag:'HOT', tagClass:'ptag-hot'},
  {id:'wj-cava',  brand:'Cava',      name:'Brut 75cl',       size:'Fles',  price:13.00, emoji:'\uD83C\uDF7E', tag:'18+', tagClass:'ptag-18'}
];

var SHOTS = [
  {id:'sh-vodka', brand:'Smirnoff',     name:'Vodka 70cl',      size:'Fles',  price:22.00, emoji:'\uD83E\uDD43', tag:'18+', tagClass:'ptag-18'},
  {id:'sh-rum',   brand:'Bacardi',      name:'White Rum 70cl',  size:'Fles',  price:24.00, emoji:'\uD83E\uDD43', tag:'18+', tagClass:'ptag-18'},
  {id:'sh-jack',  brand:'Jack Daniels', name:'Whiskey 70cl',    size:'Fles',  price:28.00, emoji:'\uD83E\uDD43', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'sh-jager', brand:'Jagermeister', name:'Likeur 70cl',     size:'Fles',  price:23.00, emoji:'\uD83E\uDD43', tag:'HOT', tagClass:'ptag-hot'},
  {id:'sh-teq',   brand:'Olmeca',       name:'Tequila Gold 70cl',size:'Fles', price:25.00, emoji:'\uD83E\uDD43', tag:'18+', tagClass:'ptag-18'},
  {id:'sh-gin',   brand:'Bombay',       name:'Sapphire Gin 70cl',size:'Fles', price:26.00, emoji:'\uD83E\uDD43', tag:'18+', tagClass:'ptag-18'},
  {id:'sh-lic',   brand:'Licor 43',     name:'Likeur 70cl',     size:'Fles',  price:22.00, emoji:'\uD83E\uDD43', tag:'NIEUW', tagClass:'ptag-new'}
];

var FRIS = [
  {id:'fr-cola',  brand:'Coca Cola',  name:'Original 1.5L',  size:'Fles',   price:3.00, emoji:'\uD83E\uDD64', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'fr-cola0', brand:'Coca Cola',  name:'Zero 1.5L',      size:'Fles',   price:3.00, emoji:'\uD83E\uDD64', tag:'', tagClass:''},
  {id:'fr-fanta', brand:'Fanta',      name:'Orange 1.5L',    size:'Fles',   price:3.00, emoji:'\uD83C\uDF4A', tag:'', tagClass:''},
  {id:'fr-spr',   brand:'Sprite',     name:'1.5L',           size:'Fles',   price:3.00, emoji:'\uD83E\uDD64', tag:'', tagClass:''},
  {id:'fr-icetea',brand:'Lipton',     name:'Ice Tea 1.5L',   size:'Fles',   price:3.00, emoji:'\uD83C\uDF79', tag:'NIEUW', tagClass:'ptag-new'},
  {id:'fr-spa',   brand:'Spa',        name:'Blauw 1.5L',     size:'Water',  price:2.00, emoji:'\uD83D\uDCA7', tag:'', tagClass:''},
  {id:'fr-spa-r', brand:'Spa',        name:'Rood Bruisend 1.5L', size:'Water',price:2.50, emoji:'\uD83D\uDCA7', tag:'', tagClass:''},
  {id:'fr-cap',   brand:'Capri-Sun',  name:'4-pack',         size:'Pakjes', price:3.50, emoji:'\uD83E\uDDC3', tag:'', tagClass:''}
];

var ENERGY = [
  {id:'en-rb',    brand:'Red Bull', name:'Original 25cl',   size:'Blik', price:3.00, emoji:'\u26A1', tag:'HOT', tagClass:'ptag-hot'},
  {id:'en-rb-sf', brand:'Red Bull', name:'Sugar Free 25cl', size:'Blik', price:3.00, emoji:'\u26A1', tag:'', tagClass:''},
  {id:'en-mon',   brand:'Monster',  name:'Energy 50cl',     size:'Blik', price:3.00, emoji:'\u26A1', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'en-mon-u', brand:'Monster',  name:'Ultra 50cl',      size:'Blik', price:3.00, emoji:'\u26A1', tag:'', tagClass:''}
];

var CHIPS = [
  {id:'ch-lay-pap', brand:'Lays',      name:'Paprika',         size:'200g',  price:3.00, emoji:'\uD83C\uDF5F', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'ch-lay-nat', brand:'Lays',      name:'Naturel Zout',    size:'200g',  price:3.00, emoji:'\uD83C\uDF5F', tag:'', tagClass:''},
  {id:'ch-dor-nac', brand:'Doritos',   name:'Nacho Cheese',    size:'185g',  price:3.50, emoji:'\uD83C\uDF2E', tag:'HOT', tagClass:'ptag-hot'},
  {id:'ch-dor-coo', brand:'Doritos',   name:'Cool Original',   size:'185g',  price:3.50, emoji:'\uD83C\uDF2E', tag:'', tagClass:''},
  {id:'ch-pri-or',  brand:'Pringles',  name:'Original',        size:'165g',  price:3.50, emoji:'\uD83C\uDF5F', tag:'', tagClass:''},
  {id:'ch-pri-pap', brand:'Pringles',  name:'Paprika',         size:'165g',  price:3.50, emoji:'\uD83C\uDF5F', tag:'', tagClass:''},
  {id:'ch-bif',     brand:'Bifi',      name:'Worstjes 5-pack', size:'Pack',  price:3.00, emoji:'\uD83C\uDF56', tag:'NIEUW', tagClass:'ptag-new'},
  {id:'ch-pist',    brand:'Pistache',  name:'Gezouten 200g',   size:'200g',  price:4.50, emoji:'\uD83E\uDD5C', tag:'', tagClass:''}
];

var SNOEP = [
  {id:'sn-mm',    brand:'M&M',         name:'Peanut 200g',       size:'200g', price:3.00, emoji:'\uD83C\uDF6B', tag:'', tagClass:''},
  {id:'sn-snic',  brand:'Snickers',    name:'Reep',              size:'50g',  price:1.50, emoji:'\uD83C\uDF6B', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'sn-mars',  brand:'Mars',        name:'Reep',              size:'51g',  price:1.50, emoji:'\uD83C\uDF6B', tag:'', tagClass:''},
  {id:'sn-tony',  brand:'Tony Choco',  name:'Melk Chocolade',    size:'180g', price:3.50, emoji:'\uD83C\uDF6B', tag:'NIEUW', tagClass:'ptag-new'},
  {id:'sn-haribo',brand:'Haribo',      name:'Goudberen',         size:'200g', price:2.50, emoji:'\uD83C\uDF6C', tag:'', tagClass:''},
  {id:'sn-toko',  brand:'Tic Tac',     name:'Mint',              size:'18g',  price:1.50, emoji:'\uD83C\uDF6C', tag:'', tagClass:''}
];

var IJS = [
  {id:'ij-mag-cl', brand:'Magnum',      name:'Classic',         size:'Stuk', price:2.50, emoji:'\uD83C\uDF66', tag:'POPULAIR', tagClass:'ptag-pop'},
  {id:'ij-mag-al', brand:'Magnum',      name:'Almond',          size:'Stuk', price:2.50, emoji:'\uD83C\uDF66', tag:'', tagClass:''},
  {id:'ij-haag',   brand:'Haagen-Dazs', name:'Vanilla 500ml',   size:'Beker',price:6.00, emoji:'\uD83C\uDF68', tag:'PREMIUM', tagClass:'ptag-pop'},
  {id:'ij-cor',    brand:'Cornetto',    name:'Classic',         size:'Stuk', price:2.00, emoji:'\uD83C\uDF66', tag:'', tagClass:''}
];

var ACC = [
  {id:'ac-ijs',   brand:'IJsblokjes',  name:'Zak 2kg',           size:'Zak',     price:4.00, emoji:'\uD83E\uDDCA', tag:'HANDIG', tagClass:'ptag-pack'},
  {id:'ac-cond',  brand:'Durex',       name:'Condooms 6-pack',   size:'Pack',    price:5.00, emoji:'\uD83D\uDC8A', tag:'', tagClass:''},
  {id:'ac-aans',  brand:'Bic',         name:'Aansteker',         size:'Stuk',    price:1.50, emoji:'\uD83D\uDD25', tag:'', tagClass:''},
  {id:'ac-vloei', brand:'Rizla',       name:'Vloei + Tips',      size:'Pack',    price:2.00, emoji:'\uD83D\uDCC4', tag:'', tagClass:''}
];

var ALL_PRODUCTS = {};
function indexProducts(arr){ for(var i=0;i<arr.length;i++){ ALL_PRODUCTS[arr[i].id] = arr[i]; } }
indexProducts(BUNDLES); indexProducts(BIER); indexProducts(WIJN); indexProducts(SHOTS);
indexProducts(FRIS); indexProducts(ENERGY); indexProducts(CHIPS); indexProducts(SNOEP);
indexProducts(IJS); indexProducts(ACC);

/* ------------------- HELPERS ------------------- */
function $(sel){ return document.querySelector(sel); }
function $$(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
function fmtEUR(n){ return '\u20AC' + n.toFixed(2).replace('.', ','); }
function pad(n){ return n < 10 ? '0' + n : '' + n; }
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

/* ------------------- CART ------------------- */
var CART_KEY = 'nachtdrop_cart_v1';
var cart = {};
try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}') || {}; } catch(e){ cart = {}; }

function saveCart(){ try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){} }

function cartItemsArr(){
  var out = [];
  for(var id in cart){
    if(cart[id] > 0 && ALL_PRODUCTS[id]){
      out.push({ product: ALL_PRODUCTS[id], qty: cart[id] });
    }
  }
  return out;
}

function cartCount(){ var n = 0; for(var id in cart){ n += cart[id]; } return n; }

function cartSubtotal(){
  var s = 0;
  for(var id in cart){
    var p = ALL_PRODUCTS[id];
    if(p) s += p.price * cart[id];
  }
  return s;
}

function cartShipping(){
  var sub = cartSubtotal();
  if(sub === 0) return 0;
  if(sub >= FREE_SHIP) return 0;
  return SHIP_COST;
}

function cartTotal(){ return cartSubtotal() + cartShipping(); }

function addToCart(id, qty){
  qty = qty || 1;
  if(!ALL_PRODUCTS[id]) return;
  cart[id] = (cart[id] || 0) + qty;
  saveCart();
  refreshCartUI();
  showToast(ALL_PRODUCTS[id].name + ' toegevoegd');
}

function setQty(id, qty){
  if(qty <= 0){ delete cart[id]; }
  else { cart[id] = qty; }
  saveCart();
  refreshCartUI();
  renderCartItems();
}

function clearCart(){
  cart = {};
  saveCart();
  refreshCartUI();
  renderCartItems();
}

/* ------------------- UI: TOAST ------------------- */
var toastTimer = null;
function showToast(msg){
  var t = $('#toast');
  var tx = $('#toastText');
  if(!t || !tx) return;
  tx.textContent = msg;
  t.classList.add('show');
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 1800);
}

/* ------------------- UI: CART BAR + MODAL ------------------- */
function refreshCartUI(){
  var n = cartCount();
  var sub = cartSubtotal();
  var bar = $('#cartBar');
  var sticky = $('#stickyCta');

  $('#cartCount').textContent = n;
  $('#cartLine1').textContent = n + ' item' + (n === 1 ? '' : 's') + ' \u00B7 ' + fmtEUR(sub);

  if(sub < MIN_ORDER && sub > 0){
    $('#cartLine2').textContent = '+' + fmtEUR(MIN_ORDER - sub) + ' voor min. order';
  } else if(sub >= MIN_ORDER && sub < FREE_SHIP){
    $('#cartLine2').textContent = '+' + fmtEUR(FREE_SHIP - sub) + ' voor gratis bezorging';
  } else if(sub >= FREE_SHIP){
    $('#cartLine2').textContent = 'Gratis bezorging \u2713';
  } else {
    $('#cartLine2').textContent = 'Tik om te bekijken & bestellen';
  }

  if(n > 0){
    bar.classList.add('show');
    document.body.classList.add('has-cart');
    bar.classList.add('bump');
    setTimeout(function(){ bar.classList.remove('bump'); }, 360);
  } else {
    bar.classList.remove('show');
    document.body.classList.remove('has-cart');
  }

  /* Update progress bar on home */
  var pf = $('#psFill');
  if(pf){
    var pct = Math.min(100, (sub / FREE_SHIP) * 100);
    pf.style.width = pct + '%';
  }
}

function renderCartItems(){
  var box = $('#cartItems');
  if(!box) return;
  var items = cartItemsArr();
  $('#sheetCount').textContent = items.length + ' item' + (items.length === 1 ? '' : 's');
  var sub = cartSubtotal();
  var ship = cartShipping();
  var tot = cartTotal();
  $('#cartSubtotal').textContent = fmtEUR(sub);
  $('#cartShip').textContent = ship === 0 ? 'GRATIS' : fmtEUR(ship);
  $('#cartShipLabel').textContent = ship === 0 && sub >= FREE_SHIP ? 'Bezorgkosten (gratis)' : 'Bezorgkosten';
  $('#cartTotal').textContent = fmtEUR(tot);

  var warn = $('#cartMinWarn');
  var warnText = $('#cartMinText');
  var btn = $('#cartSendBtn');

  if(items.length === 0){
    box.innerHTML = '<div class="cart-empty">Je winkelwagen is leeg</div>';
    warn.classList.remove('hidden');
    warn.classList.remove('ok');
    warnText.textContent = 'Voeg producten toe om te bestellen';
    btn.disabled = true;
    return;
  }

  if(sub < MIN_ORDER){
    warn.classList.remove('hidden');
    warn.classList.remove('ok');
    warnText.textContent = 'Voeg nog ' + fmtEUR(MIN_ORDER - sub) + ' toe (min. ' + fmtEUR(MIN_ORDER) + ')';
    btn.disabled = true;
  } else if(sub < FREE_SHIP){
    warn.classList.remove('hidden');
    warn.classList.add('ok');
    warnText.textContent = 'Nog ' + fmtEUR(FREE_SHIP - sub) + ' voor gratis bezorging';
    btn.disabled = false;
  } else {
    warn.classList.remove('hidden');
    warn.classList.add('ok');
    warnText.textContent = 'Gratis bezorging \u2713';
    btn.disabled = false;
  }

  var html = '';
  for(var i = 0; i < items.length; i++){
    var it = items[i];
    var p = it.product;
    var line = p.price * it.qty;
    html += '<div class="cart-item" data-id="' + escapeHTML(p.id) + '">';
    html += '<div class="cart-item-emoji">' + p.emoji + '</div>';
    html += '<div class="cart-item-info">';
    html += '<div class="cart-item-name">' + escapeHTML(p.name) + (p.brand ? ' \u00B7 ' + escapeHTML(p.brand) : '') + '</div>';
    html += '<div class="cart-item-price">' + fmtEUR(p.price) + ' / stuk</div>';
    html += '</div>';
    html += '<div class="cart-qty">';
    html += '<button type="button" class="minus" data-act="dec" data-id="' + escapeHTML(p.id) + '" aria-label="Min">\u2212</button>';
    html += '<span class="cart-qty-num">' + it.qty + '</span>';
    html += '<button type="button" class="plus" data-act="inc" data-id="' + escapeHTML(p.id) + '" aria-label="Plus">+</button>';
    html += '</div>';
    html += '<div class="cart-item-total">' + fmtEUR(line) + '</div>';
    html += '</div>';
  }
  box.innerHTML = html;
}

function openCart(){
  renderCartItems();
  $('#cartModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  $('#cartModal').classList.remove('show');
  document.body.style.overflow = '';
}

/* ------------------- WHATSAPP MESSAGE ------------------- */
function buildWhatsAppMessage(){
  var items = cartItemsArr();
  var lines = [];
  lines.push('Hoi NachtDrop! Ik wil het volgende bestellen:');
  lines.push('');
  for(var i = 0; i < items.length; i++){
    var p = items[i].product;
    var q = items[i].qty;
    var label = p.name + (p.brand ? ' (' + p.brand + ')' : '') + (p.size ? ' - ' + p.size : '');
    lines.push(q + 'x ' + label + ' - ' + fmtEUR(p.price * q));
  }
  lines.push('');
  lines.push('Subtotaal: ' + fmtEUR(cartSubtotal()));
  var ship = cartShipping();
  lines.push('Bezorgkosten: ' + (ship === 0 ? 'GRATIS' : fmtEUR(ship)));
  lines.push('TOTAAL: ' + fmtEUR(cartTotal()));
  lines.push('');
  lines.push('Bezorgadres: ');
  lines.push('Naam: ');
  lines.push('Betaling: contant / pin');
  return lines.join('\n');
}

function sendToWhatsApp(){
  if(cartSubtotal() < MIN_ORDER) return;
  var msg = buildWhatsAppMessage();
  var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

function stickyCtaWhatsApp(){
  var lines = [
    'Hoi NachtDrop! Ik wil bestellen:',
    '',
    '1. Bundels & Deals',
    '2. Bier (los, 6-pack, krat)',
    '3. Wijn / Shots / Sterke drank',
    '4. Fris & Energy',
    '5. Snacks & IJs',
    '6. Accessoires',
    '',
    'Typ je bestelling + hoeveelheid.',
    'Bezorgadres: ',
    'Naam: ',
    'Betaling: contant / pin'
  ];
  var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  window.open(url, '_blank');
}

/* ------------------- RENDERING ------------------- */
function bundleCardHTML(b){
  return [
    '<article class="bcard ' + b.cardClass + '" data-id="' + b.id + '">',
      '<div class="bcard-imgs"><span aria-hidden="true">' + b.emoji + '</span>',
        '<div class="save-tag">-' + fmtEUR(b.save) + '</div>',
      '</div>',
      '<div class="bcard-body">',
        '<span class="btag ' + b.tagClass + '">' + b.tag + '</span>',
        '<div class="bname">' + escapeHTML(b.name) + '</div>',
        '<div class="bdesc">' + escapeHTML(b.desc) + '</div>',
        '<div class="bfoot">',
          '<div class="bprice-w">',
            '<span class="bprice-old">' + fmtEUR(b.oldPrice) + '</span>',
            '<span class="bprice">' + fmtEUR(b.price) + '</span>',
          '</div>',
          '<button type="button" class="bbtn" data-add="' + b.id + '">Voeg toe</button>',
        '</div>',
      '</div>',
    '</article>'
  ].join('');
}

function productCardHTML(p){
  return [
    '<article class="pcard" data-id="' + p.id + '">',
      '<div class="pcard-img">',
        '<span aria-hidden="true">' + p.emoji + '</span>',
        (p.tag ? '<span class="ptag ' + p.tagClass + '">' + p.tag + '</span>' : ''),
      '</div>',
      '<div class="pcard-body">',
        (p.brand ? '<div class="pcard-brand">' + escapeHTML(p.brand) + '</div>' : ''),
        '<div class="pcard-name">' + escapeHTML(p.name) + '</div>',
        (p.size ? '<div class="pcard-size">' + escapeHTML(p.size) + '</div>' : ''),
        '<div class="pcard-foot">',
          '<span class="pcard-price">' + fmtEUR(p.price) + '</span>',
          '<button type="button" class="qadd" data-add="' + p.id + '" aria-label="Voeg ' + escapeHTML(p.name) + ' toe">+</button>',
        '</div>',
      '</div>',
    '</article>'
  ].join('');
}

function renderInto(selector, items, kind){
  var el = document.querySelector(selector);
  if(!el) return;
  var html = '';
  for(var i = 0; i < items.length; i++){
    html += kind === 'bundle' ? bundleCardHTML(items[i]) : productCardHTML(items[i]);
  }
  el.innerHTML = html;
}

function renderAll(){
  /* Home carousels */
  renderInto('[data-render="bundles-top"]', BUNDLES.slice(0, 4), 'bundle');
  renderInto('[data-render="bier-top"]',    BIER.slice(0, 6),    'product');
  /* Deals */
  renderInto('[data-render="bundles-all"]', BUNDLES,             'bundle');
  /* Drank */
  renderInto('[data-render="bier-all"]',    BIER,                'product');
  renderInto('[data-render="wijn-all"]',    WIJN,                'product');
  renderInto('[data-render="shots-all"]',   SHOTS,               'product');
  /* Snacks */
  renderInto('[data-render="chips-all"]',   CHIPS,               'product');
  renderInto('[data-render="snoep-all"]',   SNOEP,               'product');
  renderInto('[data-render="ijs-all"]',     IJS,                 'product');
  /* Fris */
  renderInto('[data-render="fris-all"]',    FRIS,                'product');
  renderInto('[data-render="energy-all"]',  ENERGY,              'product');
  /* Meer */
  renderInto('[data-render="acc-all"]',     ACC,                 'product');
}

/* ------------------- TAB NAVIGATION ------------------- */
function goPage(name){
  $$('.page-section').forEach(function(s){ s.classList.remove('active'); });
  var target = document.getElementById('page-' + name);
  if(target) target.classList.add('active');
  $$('.app-tab').forEach(function(t){
    t.classList.toggle('on', t.getAttribute('data-page') === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------- COUNTDOWN + LIVE STATUS ------------------- */
function updateLiveStatus(){
  var now = new Date();
  var open = isOpenNow(now);
  var badge = $('#liveBadge');
  var liveText = $('#liveText');
  var close = getCloseTime(now);
  var closeStr = pad(close.getHours()) + ':' + pad(close.getMinutes());

  if(open){
    badge.classList.remove('closed');
    liveText.textContent = 'Open tot ' + closeStr;
  } else {
    badge.classList.add('closed');
    liveText.textContent = 'Gesloten - 20:00 weer open';
  }

  var stat = $('#closeStat');
  if(stat) stat.textContent = closeStr;

  /* Countdown strip */
  var cdMain = $('#cdMain');
  var cdTime = $('#cdTime');
  var cdSub = $('#cdSub');
  var cdStrip = $('#cdStrip');
  if(open && cdTime && cdMain){
    var diff = close.getTime() - now.getTime();
    if(diff > 0){
      var mins = Math.floor(diff / 60000);
      var hrs = Math.floor(mins / 60);
      var rmin = mins - hrs * 60;
      var label = hrs > 0 ? hrs + 'u ' + pad(rmin) + 'm' : rmin + ' min';
      cdTime.textContent = label;
      cdMain.innerHTML = 'Wij sluiten over <strong id="cdTime">' + label + '</strong>';
      if(cdStrip) cdStrip.classList.remove('closed');
      if(cdSub) cdSub.textContent = 'Doordeweeks tot 04:00 \u00B7 Weekend tot 05:30';

      /* Flash bar when <60 min */
      var flash = $('#flashBar');
      if(mins < 60){
        flash.classList.add('show');
        document.body.classList.add('flash-on');
        $('#flashMins').textContent = mins + ' min';
      } else {
        flash.classList.remove('show');
        document.body.classList.remove('flash-on');
      }
    }
  } else if(cdMain){
    cdMain.textContent = 'Wij zijn nu gesloten - vanaf 20:00 weer open';
    if(cdStrip) cdStrip.classList.add('closed');
    if(cdSub) cdSub.textContent = 'Ma-Do 20:00-04:00 \u00B7 Vr-Za 20:00-05:30';
    var flash2 = $('#flashBar');
    if(flash2){ flash2.classList.remove('show'); document.body.classList.remove('flash-on'); }
  }
}

/* ------------------- EVENT BINDING ------------------- */
function onClick(e){
  var t = e.target;
  /* Add to cart */
  var addBtn = t.closest && t.closest('[data-add]');
  if(addBtn){
    e.preventDefault();
    var id = addBtn.getAttribute('data-add');
    addToCart(id, 1);
    addBtn.classList.add('added');
    setTimeout(function(){ addBtn.classList.remove('added'); }, 450);
    return;
  }
  /* Cart qty buttons */
  var qtyBtn = t.closest && t.closest('[data-act]');
  if(qtyBtn){
    var act = qtyBtn.getAttribute('data-act');
    var pid = qtyBtn.getAttribute('data-id');
    var cur = cart[pid] || 0;
    if(act === 'inc') setQty(pid, cur + 1);
    else if(act === 'dec') setQty(pid, cur - 1);
    return;
  }
  /* Tab click */
  var tab = t.closest && t.closest('.app-tab[data-page]');
  if(tab){
    goPage(tab.getAttribute('data-page'));
    return;
  }
  /* data-go links */
  var go = t.closest && t.closest('[data-go]');
  if(go){
    goPage(go.getAttribute('data-go'));
    return;
  }
}

function bind(){
  document.addEventListener('click', onClick);
  $('#cartBar').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartModal').addEventListener('click', function(e){ if(e.target === this) closeCart(); });
  $('#cartClear').addEventListener('click', clearCart);
  $('#cartSendBtn').addEventListener('click', sendToWhatsApp);
  $('#stickyCta').addEventListener('click', stickyCtaWhatsApp);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeCart(); }
  });
}

/* ------------------- INIT ------------------- */
function init(){
  renderAll();
  bind();
  refreshCartUI();
  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();

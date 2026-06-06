/* ═══════════════════════════════════════════════════════════════════
   FinansTerminal — app.js
   Binance REST (klines) + WebSocket (real-time) + lightweight-charts v4
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

/* ── Constants ─────────────────────────────────────────────────── */
const BINANCE_REST = 'https://api.binance.com/api/v3';
const BINANCE_WS   = 'wss://stream.binance.com:9443/ws';
const KLINE_LIMIT  = 500;

const WATCHLIST_SYMBOLS = [
  { sym: 'BTCUSDT',  name: 'Bitcoin'   },
  { sym: 'ETHUSDT',  name: 'Ethereum'  },
  { sym: 'BNBUSDT',  name: 'BNB'       },
  { sym: 'SOLUSDT',  name: 'Solana'    },
  { sym: 'XRPUSDT',  name: 'Ripple'    },
  { sym: 'ADAUSDT',  name: 'Cardano'   },
  { sym: 'DOGEUSDT', name: 'Dogecoin'  },
  { sym: 'DOTUSDT',  name: 'Polkadot'  },
  { sym: 'AVAXUSDT', name: 'Avalanche' },
  { sym: 'MATICUSDT',name: 'Polygon'   },
  { sym: 'LTCUSDT',  name: 'Litecoin'  },
  { sym: 'LINKUSDT', name: 'Chainlink' },
];

/* interval → Binance kline interval string */
const INTERVAL_MAP = {
  '1m': '1m', '5m': '5m', '15m': '15m',
  '1h': '1h', '4h': '4h', '1d':  '1d', '1w': '1w',
};

/* ── State ─────────────────────────────────────────────────────── */
let state = {
  symbol:       'BTCUSDT',
  interval:     '15m',
  chartType:    'candlestick',
  indicators:   { ma: true, bb: true, vol: false },
  lastPrice:    null,
  prevPrice:    null,
  tickerData:   {},   // sym → { price, change }
};

/* ── DOM refs ──────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

/* ── lightweight-charts instances ─────────────────────────────── */
let chart, mainSeries, ma20Series, ma50Series, bbUpperSeries, bbLowerSeries, bbMidSeries, volSeries;

/* ── WebSocket refs ────────────────────────────────────────────── */
let klineWs      = null;
let miniTickerWs = null;
let depthWs      = null;

/* ═══════════════════════════════════════════════════════════════
   CHART INIT
   ═══════════════════════════════════════════════════════════════ */
function initChart() {
  const container = $('chartContainer');
  chart = LightweightCharts.createChart(container, {
    layout: {
      background:  { color: '#131722' },
      textColor:   '#787b86',
      fontFamily:  "'Roboto Mono', 'Consolas', monospace",
      fontSize:    11,
    },
    grid: {
      vertLines:   { color: '#1e222d' },
      horzLines:   { color: '#1e222d' },
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine:   { color: '#4c525e', width: 1, style: 1, labelBackgroundColor: '#363a45' },
      horzLine:   { color: '#4c525e', width: 1, style: 1, labelBackgroundColor: '#363a45' },
    },
    rightPriceScale: {
      borderColor: '#363a45',
      textColor:   '#787b86',
    },
    timeScale: {
      borderColor:        '#363a45',
      timeVisible:        true,
      secondsVisible:     false,
      rightBarStaysOnScroll: true,
    },
    handleScale: { axisPressedMouseMove: { time: true, price: true } },
  });

  /* resize observer */
  new ResizeObserver(() => {
    chart.applyOptions({
      width:  container.clientWidth,
      height: container.clientHeight,
    });
  }).observe(container);

  /* crosshair info panel */
  chart.subscribeCrosshairMove(param => {
    const panel = $('crosshairInfo');
    if (!param.time || !param.seriesData.size) { panel.classList.add('hidden'); return; }
    const data = param.seriesData.get(mainSeries);
    if (!data) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    $('ciTime').textContent  = formatTimeCH(param.time);
    const isCandle = state.chartType === 'candlestick' || state.chartType === 'bar';
    if (isCandle) {
      $('ciOpen').innerHTML  = `A:<b>${fmt(data.open)}</b>`;
      $('ciHigh').innerHTML  = `Y:<b>${fmt(data.high)}</b>`;
      $('ciLow').innerHTML   = `D:<b>${fmt(data.low)}</b>`;
      $('ciClose').innerHTML = `K:<b>${fmt(data.close)}</b>`;
    } else {
      const val = data.value ?? data.close;
      $('ciOpen').innerHTML  = ``;
      $('ciHigh').innerHTML  = ``;
      $('ciLow').innerHTML   = ``;
      $('ciClose').innerHTML = `Fiyat:<b>${fmt(val)}</b>`;
    }
    const vol = volSeries ? param.seriesData.get(volSeries) : null;
    $('ciVol').innerHTML = vol ? `H:<b>${fmtVol(vol.value)}</b>` : '';
  });
}

/* ═══════════════════════════════════════════════════════════════
   SERIES MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */
function clearAllSeries() {
  [mainSeries, ma20Series, ma50Series, bbUpperSeries, bbLowerSeries, bbMidSeries, volSeries].forEach(s => {
    if (s) { try { chart.removeSeries(s); } catch (_) {} }
  });
  mainSeries = ma20Series = ma50Series = bbUpperSeries = bbLowerSeries = bbMidSeries = volSeries = null;
}

function buildSeries() {
  clearAllSeries();

  /* main series */
  if (state.chartType === 'candlestick') {
    mainSeries = chart.addCandlestickSeries({
      upColor:          '#26a69a', downColor:       '#ef5350',
      borderUpColor:    '#26a69a', borderDownColor: '#ef5350',
      wickUpColor:      '#26a69a', wickDownColor:   '#ef5350',
    });
  } else if (state.chartType === 'bar') {
    mainSeries = chart.addBarSeries({
      upColor: '#26a69a', downColor: '#ef5350',
    });
  } else if (state.chartType === 'line') {
    mainSeries = chart.addLineSeries({
      color: '#2962ff', lineWidth: 2,
      priceLineVisible: false,
    });
  } else { /* area */
    mainSeries = chart.addAreaSeries({
      lineColor:      '#2962ff',
      topColor:       'rgba(41,98,255,.4)',
      bottomColor:    'rgba(41,98,255,0)',
      lineWidth:      2,
      priceLineVisible: false,
    });
  }

  /* MA overlays */
  if (state.indicators.ma) {
    ma20Series = chart.addLineSeries({
      color: '#f7c948', lineWidth: 1, priceLineVisible: false,
      lastValueVisible: false, crosshairMarkerVisible: false,
    });
    ma50Series = chart.addLineSeries({
      color: '#ff9800', lineWidth: 1, priceLineVisible: false,
      lastValueVisible: false, crosshairMarkerVisible: false,
    });
  }

  /* Bollinger Bands */
  if (state.indicators.bb) {
    bbUpperSeries = chart.addLineSeries({
      color: 'rgba(100,181,246,.6)', lineWidth: 1, priceLineVisible: false,
      lastValueVisible: false, crosshairMarkerVisible: false,
    });
    bbLowerSeries = chart.addLineSeries({
      color: 'rgba(100,181,246,.6)', lineWidth: 1, priceLineVisible: false,
      lastValueVisible: false, crosshairMarkerVisible: false,
    });
    bbMidSeries = chart.addLineSeries({
      color: 'rgba(100,181,246,.3)', lineWidth: 1, priceLineVisible: false,
      lastValueVisible: false, crosshairMarkerVisible: false,
    });
  }

  /* Volume */
  if (state.indicators.vol) {
    volSeries = chart.addHistogramSeries({
      priceFormat:   { type: 'volume' },
      priceScaleId:  'vol',
      color:         'rgba(120,123,134,.5)',
    });
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
  }
}

/* ═══════════════════════════════════════════════════════════════
   DATA LOADING
   ═══════════════════════════════════════════════════════════════ */
async function loadHistory() {
  showLoading(true);
  try {
    const iv  = INTERVAL_MAP[state.interval] || '15m';
    const url = `${BINANCE_REST}/klines?symbol=${state.symbol}&interval=${iv}&limit=${KLINE_LIMIT}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();

    /* raw = [[openTime, o, h, l, c, vol, ...], ...] */
    const candles = raw.map(k => ({
      time:   Math.floor(k[0] / 1000),
      open:   parseFloat(k[1]),
      high:   parseFloat(k[2]),
      low:    parseFloat(k[3]),
      close:  parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    buildSeries();

    /* main */
    const isCandle = state.chartType === 'candlestick' || state.chartType === 'bar';
    if (isCandle) {
      mainSeries.setData(candles);
    } else {
      mainSeries.setData(candles.map(c => ({ time: c.time, value: c.close })));
    }

    /* indicators */
    const closes = candles.map(c => c.close);
    const times  = candles.map(c => c.time);

    if (state.indicators.ma) {
      ma20Series.setData(calcMA(closes, times, 20));
      ma50Series.setData(calcMA(closes, times, 50));
    }
    if (state.indicators.bb) {
      const { upper, mid, lower } = calcBB(closes, times, 20, 2);
      bbUpperSeries.setData(upper);
      bbMidSeries.setData(mid);
      bbLowerSeries.setData(lower);
    }
    if (state.indicators.vol) {
      volSeries.setData(candles.map(c => ({
        time: c.time, value: c.volume,
        color: c.close >= c.open ? 'rgba(38,166,154,.5)' : 'rgba(239,83,80,.5)',
      })));
    }

    chart.timeScale().fitContent();
    showLoading(false);
  } catch (e) {
    console.error('loadHistory error', e);
    showLoading(false);
  }
}

/* ═══════════════════════════════════════════════════════════════
   WEBSOCKET — kline (live candle)
   ═══════════════════════════════════════════════════════════════ */
function connectKlineWs() {
  closeWs(klineWs);
  const sym = state.symbol.toLowerCase();
  const iv  = INTERVAL_MAP[state.interval] || '15m';
  klineWs   = new WebSocket(`${BINANCE_WS}/${sym}@kline_${iv}`);

  klineWs.onopen = () => setWsStatus(true);
  klineWs.onerror = () => setWsStatus(false);
  klineWs.onclose = () => { setWsStatus(false); setTimeout(connectKlineWs, 3000); };

  klineWs.onmessage = e => {
    const msg = JSON.parse(e.data);
    const k   = msg.k;
    const candle = {
      time:   Math.floor(k.t / 1000),
      open:   parseFloat(k.o),
      high:   parseFloat(k.h),
      low:    parseFloat(k.l),
      close:  parseFloat(k.c),
      volume: parseFloat(k.v),
    };

    if (!mainSeries) return;
    const isCandle = state.chartType === 'candlestick' || state.chartType === 'bar';
    if (isCandle) {
      mainSeries.update(candle);
    } else {
      mainSeries.update({ time: candle.time, value: candle.close });
    }

    /* update topbar price */
    updateTopbarPrice(candle.close, candle.high, candle.low);
  };
}

/* ── miniTicker — watchlist & bottom ticker ─────────────────── */
function connectMiniTickerWs() {
  closeWs(miniTickerWs);
  miniTickerWs = new WebSocket(`${BINANCE_WS}/!miniTicker@arr`);

  miniTickerWs.onmessage = e => {
    const arr = JSON.parse(e.data);
    arr.forEach(t => {
      state.tickerData[t.s] = {
        price:  parseFloat(t.c),
        change: parseFloat(t.P),  // % change 24h
        high:   parseFloat(t.h),
        low:    parseFloat(t.l),
        vol:    parseFloat(t.v),
      };
    });
    updateWatchlist();
    updateTickerBar();
    /* update topbar if current symbol */
    const d = state.tickerData[state.symbol];
    if (d) updateTopbarFull(d);
  };
  miniTickerWs.onerror = () => {};
  miniTickerWs.onclose = () => { setTimeout(connectMiniTickerWs, 5000); };
}

/* ── depth — order book ─────────────────────────────────────── */
function connectDepthWs() {
  closeWs(depthWs);
  const sym = state.symbol.toLowerCase();
  depthWs   = new WebSocket(`${BINANCE_WS}/${sym}@depth10@100ms`);

  depthWs.onmessage = e => {
    const msg = JSON.parse(e.data);
    renderOrderBook(msg.asks, msg.bids);
  };
  depthWs.onerror = () => {};
  depthWs.onclose = () => { setTimeout(connectDepthWs, 3000); };
}

/* ═══════════════════════════════════════════════════════════════
   ORDER BOOK RENDER
   ═══════════════════════════════════════════════════════════════ */
function renderOrderBook(asks, bids) {
  /* asks: lowest ask first → we reverse to show highest at top */
  const asksSorted = [...asks].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, 12);
  const bidsSorted = [...bids].sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, 12);

  const maxAsk = Math.max(...asksSorted.map(r => parseFloat(r[0]) * parseFloat(r[1])));
  const maxBid = Math.max(...bidsSorted.map(r => parseFloat(r[0]) * parseFloat(r[1])));

  $('obAsks').innerHTML = asksSorted.map(([p, q]) => {
    const price = parseFloat(p), qty = parseFloat(q);
    const total = price * qty;
    const pct   = maxAsk ? (total / maxAsk * 100).toFixed(1) : 0;
    return `<li class="ob-row">
      <span>${fmt(price)}</span>
      <span>${qty}</span>
      <span>${fmtVol(total)}</span>
      <div class="depth-bar" style="width:${pct}%"></div>
    </li>`;
  }).join('');

  $('obBids').innerHTML = bidsSorted.map(([p, q]) => {
    const price = parseFloat(p), qty = parseFloat(q);
    const total = price * qty;
    const pct   = maxBid ? (total / maxBid * 100).toFixed(1) : 0;
    return `<li class="ob-row">
      <span>${fmt(price)}</span>
      <span>${qty}</span>
      <span>${fmtVol(total)}</span>
      <div class="depth-bar" style="width:${pct}%"></div>
    </li>`;
  }).join('');

  /* spread */
  if (asks.length && bids.length) {
    const bestAsk = parseFloat(asks[0][0]);
    const bestBid = parseFloat(bids[0][0]);
    const spread  = (bestAsk - bestBid).toFixed(2);
    $('spreadVal').textContent = spread;

    /* mid price */
    const mid = ((bestAsk + bestBid) / 2);
    const prevMid = state.lastPrice;
    const arrow   = $('obMidArrow');
    $('obMidPrice').textContent = fmt(mid);
    if (prevMid !== null) {
      arrow.className = 'mid-arrow ' + (mid >= prevMid ? 'up' : 'down');
      arrow.innerHTML = mid >= prevMid ? '&#9650;' : '&#9660;';
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   WATCHLIST
   ═══════════════════════════════════════════════════════════════ */
function renderWatchlist() {
  const list = $('watchlist');
  list.innerHTML = WATCHLIST_SYMBOLS.map(({ sym, name }) => `
    <li class="watchlist-item${sym === state.symbol ? ' active' : ''}" data-sym="${sym}">
      <div class="wl-row1">
        <span class="wl-sym">${sym.replace('USDT','')}</span>
        <span class="wl-price" id="wl-price-${sym}">—</span>
      </div>
      <div class="wl-row2">
        <span class="wl-name">${name}</span>
        <span class="wl-chg" id="wl-chg-${sym}">—</span>
      </div>
    </li>`).join('');

  list.querySelectorAll('.watchlist-item').forEach(el => {
    el.addEventListener('click', () => switchSymbol(el.dataset.sym));
  });
}

function updateWatchlist() {
  WATCHLIST_SYMBOLS.forEach(({ sym }) => {
    const d = state.tickerData[sym];
    if (!d) return;
    const priceEl = document.getElementById(`wl-price-${sym}`);
    const chgEl   = document.getElementById(`wl-chg-${sym}`);
    if (!priceEl || !chgEl) return;
    priceEl.textContent  = fmt(d.price);
    const up = d.change >= 0;
    chgEl.textContent    = `${up ? '+' : ''}${d.change.toFixed(2)}%`;
    chgEl.className      = `wl-chg ${up ? 'up' : 'down'}`;
  });
}

/* ═══════════════════════════════════════════════════════════════
   TICKER BAR
   ═══════════════════════════════════════════════════════════════ */
function updateTickerBar() {
  const syms = WATCHLIST_SYMBOLS.filter(({ sym }) => state.tickerData[sym]);
  if (!syms.length) return;

  /* duplicate for seamless scroll */
  const items = [...syms, ...syms].map(({ sym, name }) => {
    const d  = state.tickerData[sym];
    const up = d.change >= 0;
    return `<div class="ticker-item">
      <span class="ticker-sym">${sym.replace('USDT','')}</span>
      <span class="ticker-price">${fmt(d.price)}</span>
      <span class="ticker-chg ${up ? 'up' : 'down'}">${up ? '+' : ''}${d.change.toFixed(2)}%</span>
    </div>`;
  }).join('');

  const track = $('tickerTrack');
  /* only re-render if content changed significantly (perf) */
  if (track.children.length < 4) track.innerHTML = items;
  else {
    /* just update text in-place */
    syms.forEach(({ sym }, i) => {
      const d  = state.tickerData[sym];
      const up = d.change >= 0;
      const base = i * 2; /* two copies */
      [base, base + syms.length].forEach(idx => {
        const el = track.children[idx];
        if (!el) return;
        el.querySelector('.ticker-price').textContent = fmt(d.price);
        const chgEl = el.querySelector('.ticker-chg');
        chgEl.textContent = `${up ? '+' : ''}${d.change.toFixed(2)}%`;
        chgEl.className   = `ticker-chg ${up ? 'up' : 'down'}`;
      });
    });
  }
}

/* ═══════════════════════════════════════════════════════════════
   TOP BAR UPDATES
   ═══════════════════════════════════════════════════════════════ */
function updateTopbarPrice(close, high, low) {
  const el = $('activePrice');
  if (state.lastPrice !== null) {
    el.classList.toggle('up',   close > state.lastPrice);
    el.classList.toggle('down', close < state.lastPrice);
  }
  el.textContent = fmt(close);
  state.prevPrice = state.lastPrice;
  state.lastPrice = close;
  if (high) $('highVal').textContent = fmt(high);
  if (low)  $('lowVal').textContent  = fmt(low);
}

function updateTopbarFull(d) {
  updateTopbarPrice(d.price, d.high, d.low);
  const up  = d.change >= 0;
  const chg = $('activeChange');
  chg.textContent = `${up ? '+' : ''}${d.change.toFixed(2)}%`;
  chg.className   = `active-change ${up ? 'up' : 'down'}`;
  $('volVal').textContent = fmtVol(d.vol);
}

/* ═══════════════════════════════════════════════════════════════
   SYMBOL SWITCH
   ═══════════════════════════════════════════════════════════════ */
function switchSymbol(sym) {
  if (sym === state.symbol) return;
  state.symbol    = sym;
  state.lastPrice = null;
  $('activeSymbolLabel').textContent = sym;
  $('activePrice').textContent = '—';
  $('activeChange').textContent = '—';
  $('highVal').textContent = '—';
  $('lowVal').textContent  = '—';
  $('volVal').textContent  = '—';
  $('obMidPrice').textContent = '—';
  $('spreadVal').textContent  = '—';
  $('obAsks').innerHTML = '';
  $('obBids').innerHTML = '';

  /* update active class in watchlist */
  document.querySelectorAll('.watchlist-item').forEach(el => {
    el.classList.toggle('active', el.dataset.sym === sym);
  });

  /* reconnect websockets */
  closeWs(klineWs);
  closeWs(depthWs);
  loadHistory().then(() => {
    connectKlineWs();
    connectDepthWs();
  });
}

/* ═══════════════════════════════════════════════════════════════
   SYMBOL SEARCH
   ═══════════════════════════════════════════════════════════════ */
let searchTimer = null;
async function handleSearch(q) {
  clearTimeout(searchTimer);
  const dd = $('searchDropdown');
  if (!q) { dd.classList.add('hidden'); return; }
  searchTimer = setTimeout(async () => {
    try {
      const res  = await fetch(`${BINANCE_REST}/exchangeInfo`);
      const data = await res.json();
      const hits = data.symbols
        .filter(s => s.quoteAsset === 'USDT' && s.status === 'TRADING'
                  && s.symbol.includes(q.toUpperCase()))
        .slice(0, 8);
      dd.innerHTML = hits.map(s => `
        <li data-sym="${s.symbol}">
          <span class="sd-symbol">${s.symbol.replace('USDT', '')} / USDT</span>
          <span class="sd-name">${s.baseAsset}</span>
        </li>`).join('');
      dd.classList.remove('hidden');
      dd.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          $('symbolInput').value = '';
          dd.classList.add('hidden');
          if (!WATCHLIST_SYMBOLS.find(w => w.sym === li.dataset.sym)) {
            WATCHLIST_SYMBOLS.push({ sym: li.dataset.sym, name: li.dataset.sym.replace('USDT','') });
            renderWatchlist();
          }
          switchSymbol(li.dataset.sym);
        });
      });
    } catch (_) {}
  }, 300);
}

/* ═══════════════════════════════════════════════════════════════
   INDICATORS — MATH
   ═══════════════════════════════════════════════════════════════ */
function calcMA(closes, times, period) {
  const result = [];
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push({ time: times[i], value: sum / period });
  }
  return result;
}

function calcBB(closes, times, period = 20, mult = 2) {
  const upper = [], mid = [], lower = [];
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean  = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((acc, v) => acc + (v - mean) ** 2, 0) / period;
    const std = Math.sqrt(variance);
    const t   = times[i];
    upper.push({ time: t, value: mean + mult * std });
    mid.push  ({ time: t, value: mean });
    lower.push({ time: t, value: mean - mult * std });
  }
  return { upper, mid, lower };
}

/* ═══════════════════════════════════════════════════════════════
   TRADE FORM
   ═══════════════════════════════════════════════════════════════ */
function initTradeForm() {
  document.querySelectorAll('.trade-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.trade-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const submit = $('tradeBtn');
      if (btn.dataset.side === 'buy') {
        submit.textContent = 'Al / Long';
        submit.className   = 'trade-submit buy';
      } else {
        submit.textContent = 'Sat / Short';
        submit.className   = 'trade-submit sell';
      }
    });
  });

  $('tradeBtn').addEventListener('click', () => {
    const price = $('tradePrice').value || 'Piyasa';
    const qty   = $('tradeQty').value;
    if (!qty) return alert('Miktar giriniz.');
    const side = document.querySelector('.trade-tab.active').dataset.side;
    alert(`[Demo] ${state.symbol} — ${side.toUpperCase()} @ ${price} × ${qty}`);
  });

  /* fill price from order book click */
  document.addEventListener('click', e => {
    const row = e.target.closest('.ob-row');
    if (!row) return;
    const priceText = row.querySelector('span:first-child')?.textContent;
    if (priceText) $('tradePrice').value = priceText.replace(/,/g, '');
  });
}

/* ═══════════════════════════════════════════════════════════════
   TOOLBAR LISTENERS
   ═══════════════════════════════════════════════════════════════ */
function initToolbar() {
  /* periods */
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.interval = btn.dataset.interval;
      closeWs(klineWs);
      loadHistory().then(connectKlineWs);
    });
  });

  /* chart type */
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.chartType = btn.dataset.type;
      loadHistory().then(connectKlineWs);
    });
  });

  /* indicators */
  document.querySelectorAll('.ind-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      state.indicators[btn.dataset.ind] = btn.classList.contains('active');
      loadHistory().then(connectKlineWs);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH INPUT
   ═══════════════════════════════════════════════════════════════ */
function initSearch() {
  const input = $('symbolInput');
  const dd    = $('searchDropdown');
  input.addEventListener('input', () => handleSearch(input.value.trim()));
  input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; dd.classList.add('hidden'); } });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) dd.classList.add('hidden');
  });
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function fmt(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 10000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (n >= 1)     return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 });
}

function fmtVol(n) {
  if (!n || isNaN(n)) return '—';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

function formatTimeCH(time) {
  const d = new Date(time * 1000);
  return d.toLocaleString('tr-TR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
}

function closeWs(ws) {
  if (!ws) return;
  ws.onclose = null;
  ws.onerror = null;
  try { ws.close(); } catch (_) {}
}

function showLoading(show) {
  $('loadingOverlay').classList.toggle('hidden', !show);
}

function setWsStatus(connected) {
  const dot   = $('wsStatus');
  const label = $('wsLabel');
  dot.className   = `ws-dot ${connected ? 'connected' : 'disconnected'}`;
  label.textContent = connected ? 'Canlı' : 'Bağlantı kesildi';
}

/* ═══════════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initChart();
  initToolbar();
  initSearch();
  initTradeForm();
  renderWatchlist();

  loadHistory().then(() => {
    connectKlineWs();
    connectMiniTickerWs();
    connectDepthWs();
  });

  $('activeSymbolLabel').textContent = state.symbol;
});

import React, { useState, useMemo } from 'react';
import {
  MAIN_INDICES,
  US_STOCKS_BY_TAB,
  CRYPTO_CARDS,
  WORLD_INDICES,
  Timeframe,
} from '../data/marketData';

export interface SuperchartSymbol {
  symbol: string;
  name: string;
  price: string;
  numericPrice: number;
  changePct: string;
  isPositive: boolean;
  category: string;
  range52W?: string;
  volume?: string;
}

interface SuperchartsViewProps {
  initialSymbol?: SuperchartSymbol;
  onBackToMarkets: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

const ALL_CHART_SYMBOLS: SuperchartSymbol[] = [
  ...MAIN_INDICES.map((i) => ({
    symbol: i.ticker,
    name: i.name,
    price: i.price,
    numericPrice: i.numericPrice,
    changePct: i.change,
    isPositive: i.isPositive,
    category: 'Index',
    range52W: '4,764 - 6,017',
    volume: '2.3B',
  })),
  ...US_STOCKS_BY_TAB['Most active'].map((s) => ({
    symbol: s.ticker,
    name: s.name,
    price: s.price,
    numericPrice: s.numericPrice,
    changePct: s.changePct,
    isPositive: s.isPositive,
    category: 'US Stock',
    range52W: s.range52W,
    volume: s.volume.replace('Vol ', ''),
  })),
  ...CRYPTO_CARDS.map((c) => ({
    symbol: c.pair,
    name: c.name,
    price: c.price,
    numericPrice: c.numericPrice,
    changePct: c.changePct,
    isPositive: c.isPositive,
    category: 'Crypto',
    range52W: c.range52W,
    volume: c.volume24h,
  })),
  ...WORLD_INDICES.map((w) => ({
    symbol: w.ticker,
    name: w.name,
    price: w.last,
    numericPrice: w.numericLast,
    changePct: w.chgPct,
    isPositive: w.isPositive,
    category: 'World Index',
    range52W: w.range52W,
    volume: '840M',
  })),
];

export const SuperchartsView: React.FC<SuperchartsViewProps> = ({
  initialSymbol,
  onBackToMarkets,
  watchlist,
  onToggleWatchlist,
}) => {
  const [activeAsset, setActiveAsset] = useState<SuperchartSymbol>(
    initialSymbol || ALL_CHART_SYMBOLS[0]
  );
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('candles');
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<'cursor' | 'trendline' | 'horizontal' | 'fib'>('cursor');
  const [horizontalLines, setHorizontalLines] = useState<number[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [activeAlerts, setActiveAlerts] = useState<{ symbol: string; price: string }[]>([
    { symbol: 'INDEX:SPX', price: '6,000.00' },
  ]);

  // Generate 36 deterministic candles based on activeAsset & timeframe
  const candles = useMemo(() => {
    const base = activeAsset.numericPrice;
    const seedStr = `${activeAsset.symbol}-${timeframe}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    const count = 36;
    const volatility = base * 0.006;
    const trend = activeAsset.isPositive ? 1 : -1;
    const items: {
      label: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      ema: number;
    }[] = [];

    let current = base * (1 - trend * 0.025);
    for (let i = 0; i < count; i++) {
      const pseudo = Math.sin(hash + i * 1.7) * 0.5 + Math.cos(hash * 0.5 + i * 0.9) * 0.5;
      const step = pseudo * volatility + (trend * base * 0.025) / count;
      const open = current;
      const close = i === count - 1 ? base : Math.max(base * 0.5, open + step);
      const high = Math.max(open, close) + Math.abs(Math.sin(i * 2.3 + hash)) * volatility * 0.85;
      const low = Math.min(open, close) - Math.abs(Math.cos(i * 1.9 + hash)) * volatility * 0.85;
      const volume = Math.round((40 + Math.abs(Math.sin(i + hash)) * 80) * 10) / 10;
      current = close;

      const hour = 9 + Math.floor((i * 6.5) / count);
      const min = Math.floor(((i * 390) / count) % 60);
      const label =
        timeframe === '1D'
          ? `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
          : `${timeframe} #${i + 1}`;

      items.push({ label, open, high, low, close, volume, ema: (open + close) / 2 });
    }

    // Smooth EMA
    let emaVal = items[0].close;
    const k = 2 / (9 + 1);
    for (let i = 0; i < items.length; i++) {
      emaVal = items[i].close * k + emaVal * (1 - k);
      items[i].ema = emaVal;
    }

    return items;
  }, [activeAsset, timeframe]);

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let vMax = 0;
    for (const c of candles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > vMax) vMax = c.volume;
    }
    const pad = (max - min) * 0.12 || 1;
    return { minPrice: min - pad, maxPrice: max + pad, maxVol: vMax || 100 };
  }, [candles]);

  const priceToY = (p: number) => {
    const ratio = (p - minPrice) / (maxPrice - minPrice || 1);
    return 340 - ratio * 300;
  };

  const yToPrice = (y: number) => {
    const ratio = (340 - y) / 300;
    return minPrice + ratio * (maxPrice - minPrice);
  };

  const inspectedCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'horizontal') {
      const rect = e.currentTarget.getBoundingClientRect();
      const relY = ((e.clientY - rect.top) / rect.height) * 400;
      if (relY >= 20 && relY <= 350) {
        setHorizontalLines((prev) => [...prev, relY]);
      }
    }
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPrice.trim()) return;
    setActiveAlerts((prev) => [
      { symbol: activeAsset.symbol, price: alertPrice.trim() },
      ...prev,
    ]);
    setAlertPrice('');
  };

  const formatNum = (n: number) =>
    n >= 1000
      ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : n.toFixed(2);

  return (
    <div className="bg-white border border-tv-border rounded-2xl shadow-sm overflow-hidden mb-10">
      {/* Top Supercharts Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-tv-border bg-tv-lightGray/40">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBackToMarkets}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-tv-dark bg-white hover:bg-tv-lightGray border border-tv-border px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap"
          >
            <span>←</span>
            <span>Markets Overview</span>
          </button>

          <div className="h-5 w-[1px] bg-tv-border hidden sm:block" />

          {/* Symbol Selector Dropdown */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Select Superchart Symbol"
              value={activeAsset.symbol}
              onChange={(e) => {
                const found = ALL_CHART_SYMBOLS.find((s) => s.symbol === e.target.value);
                if (found) setActiveAsset(found);
              }}
              className="bg-white border border-tv-border rounded-lg px-3 py-1.5 text-xs font-bold text-tv-dark focus:outline-none focus:border-tv-blue cursor-pointer"
            >
              {ALL_CHART_SYMBOLS.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => onToggleWatchlist(activeAsset.symbol)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                watchlist.includes(activeAsset.symbol)
                  ? 'bg-tv-blue text-white border-tv-blue'
                  : 'bg-white text-tv-dark border-tv-border hover:bg-tv-lightGray'
              }`}
            >
              {watchlist.includes(activeAsset.symbol) ? '★ In Watchlist' : '☆ Watchlist'}
            </button>
          </div>

          <div className="h-5 w-[1px] bg-tv-border hidden md:block" />

          {/* Timeframe Selector */}
          <div className="flex items-center bg-tv-lightGray p-0.5 rounded-lg text-xs font-semibold">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-tv-dark shadow-xs'
                    : 'text-tv-gray hover:text-tv-dark'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style & Indicators */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setChartType(chartType === 'candles' ? 'area' : 'candles')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-tv-border hover:bg-tv-lightGray transition cursor-pointer whitespace-nowrap"
            >
              {chartType === 'candles' ? 'Candles' : 'Area Line'}
            </button>
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                showEMA
                  ? 'bg-blue-50 text-tv-blue border-blue-200'
                  : 'bg-white text-tv-gray border-tv-border'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                showBollinger
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-white text-tv-gray border-tv-border'
              }`}
            >
              Bollinger Bands
            </button>
          </div>
        </div>

        {/* Live Quote Readout */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <span className="text-base font-extrabold num-tabular text-tv-dark mr-2">
              {activeAsset.price}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded num-tabular ${
                activeAsset.isPositive
                  ? 'bg-tv-greenLight text-tv-green'
                  : 'bg-tv-redLight text-tv-red'
              }`}
            >
              {activeAsset.changePct}
            </span>
          </div>
        </div>
      </div>

      {/* Main Supercharts Grid: Left Drawing Tools + Center Canvas + Right Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Drawing Toolbar + Chart Canvas */}
        <div className="lg:col-span-9 flex flex-col border-b lg:border-b-0 lg:border-r border-tv-border">
          {/* OHLCV Subheader */}
          <div className="px-4 py-2.5 border-b border-tv-border flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-tv-dark">{activeAsset.name}</span>
              <span className="text-tv-gray">·</span>
              <span className="text-tv-gray">{timeframe} Interval</span>
              <span className="text-tv-gray">·</span>
              <div className="flex items-center gap-2.5 num-tabular font-mono text-[11px]">
                <span>
                  O <strong className="text-tv-dark">{formatNum(inspectedCandle.open)}</strong>
                </span>
                <span>
                  H <strong className="text-tv-dark">{formatNum(inspectedCandle.high)}</strong>
                </span>
                <span>
                  L <strong className="text-tv-dark">{formatNum(inspectedCandle.low)}</strong>
                </span>
                <span>
                  C{' '}
                  <strong
                    className={
                      inspectedCandle.close >= inspectedCandle.open ? 'text-tv-green' : 'text-tv-red'
                    }
                  >
                    {formatNum(inspectedCandle.close)}
                  </strong>
                </span>
                <span>
                  Vol <strong className="text-tv-dark">{inspectedCandle.volume}M</strong>
                </span>
              </div>
            </div>

            {/* Drawing Tool Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTool('cursor')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  activeTool === 'cursor'
                    ? 'bg-tv-dark text-white'
                    : 'bg-tv-lightGray text-tv-gray hover:text-tv-dark'
                }`}
              >
                Crosshair
              </button>
              <button
                onClick={() => setActiveTool('horizontal')}
                className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                  activeTool === 'horizontal'
                    ? 'bg-tv-blue text-white'
                    : 'bg-tv-lightGray text-tv-gray hover:text-tv-dark'
                }`}
                title="Click anywhere on chart to place a horizontal support/resistance line"
              >
                + Support Line
              </button>
              {horizontalLines.length > 0 && (
                <button
                  onClick={() => setHorizontalLines([])}
                  className="px-2 py-1 rounded text-xs font-semibold bg-tv-redLight text-tv-red hover:opacity-80 cursor-pointer"
                >
                  Clear ({horizontalLines.length})
                </button>
              )}
            </div>
          </div>

          {/* Interactive SVG Chart Area */}
          <div className="relative w-full h-[420px] select-none bg-white">
            <svg
              viewBox="0 0 800 400"
              preserveAspectRatio="none"
              className={`w-full h-full ${
                activeTool === 'horizontal' ? 'cursor-crosshair' : 'cursor-default'
              }`}
              onClick={handleSvgClick}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="superAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor={activeAsset.isPositive ? '#089981' : '#f23645'}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={activeAsset.isPositive ? '#089981' : '#f23645'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines & Price Labels */}
              {[0.15, 0.35, 0.55, 0.75, 0.9].map((ratio, idx) => {
                const y = 30 + ratio * 310;
                const priceLabel = formatNum(yToPrice(y));
                return (
                  <g key={idx}>
                    <line
                      x1="0"
                      x2="730"
                      y1={y}
                      y2={y}
                      stroke="#f0f3fa"
                      strokeWidth="1"
                    />
                    <text
                      x="738"
                      y={y + 4}
                      fill="#787b86"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {priceLabel}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars at bottom */}
              {candles.map((c, idx) => {
                const x = 20 + (idx * 700) / candles.length;
                const vHeight = (c.volume / maxVol) * 55;
                const isUp = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - 5}
                    y={395 - vHeight}
                    width="10"
                    height={vHeight}
                    fill={isUp ? '#089981' : '#f23645'}
                    opacity="0.22"
                  />
                );
              })}

              {/* Bollinger Bands if enabled */}
              {showBollinger && (
                <>
                  <polyline
                    fill="none"
                    stroke="#9030e8"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.65"
                    points={candles
                      .map((c, idx) => {
                        const x = 20 + (idx * 700) / candles.length;
                        const y = priceToY(c.ema + (maxPrice - minPrice) * 0.09);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  <polyline
                    fill="none"
                    stroke="#9030e8"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.65"
                    points={candles
                      .map((c, idx) => {
                        const x = 20 + (idx * 700) / candles.length;
                        const y = priceToY(c.ema - (maxPrice - minPrice) * 0.09);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </>
              )}

              {/* Area or Candlesticks */}
              {chartType === 'area' ? (
                <>
                  <path
                    d={`M ${candles
                      .map((c, idx) => `${20 + (idx * 700) / candles.length},${priceToY(c.close)}`)
                      .join(' L ')} L ${20 + ((candles.length - 1) * 700) / candles.length},350 L 20,350 Z`}
                    fill="url(#superAreaGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke={activeAsset.isPositive ? '#089981' : '#f23645'}
                    strokeWidth="2.5"
                    points={candles
                      .map((c, idx) => `${20 + (idx * 700) / candles.length},${priceToY(c.close)}`)
                      .join(' ')}
                  />
                </>
              ) : (
                candles.map((c, idx) => {
                  const x = 20 + (idx * 700) / candles.length;
                  const isUp = c.close >= c.open;
                  const color = isUp ? '#089981' : '#f23645';
                  const yOpen = priceToY(c.open);
                  const yClose = priceToY(c.close);
                  const yHigh = priceToY(c.high);
                  const yLow = priceToY(c.low);
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2.5, Math.abs(yClose - yOpen));
                  return (
                    <g key={`candle-${idx}`}>
                      <line
                        x1={x}
                        x2={x}
                        y1={yHigh}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="1.4"
                      />
                      <rect
                        x={x - 5.5}
                        y={bodyTop}
                        width="11"
                        height={bodyHeight}
                        fill={color}
                        rx="1"
                      />
                    </g>
                  );
                })
              )}

              {/* EMA 20 Overlay */}
              {showEMA && (
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="1.8"
                  points={candles
                    .map((c, idx) => `${20 + (idx * 700) / candles.length},${priceToY(c.ema)}`)
                    .join(' ')}
                />
              )}

              {/* User Placed Support/Resistance Lines */}
              {horizontalLines.map((y, i) => (
                <g key={`hline-${i}`}>
                  <line
                    x1="0"
                    x2="730"
                    y1={y}
                    y2={y}
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                  <rect x="732" y={y - 9} width="64" height="18" rx="3" fill="#2962ff" />
                  <text x="737" y={y + 3} fill="#ffffff" fontSize="10" fontFamily="monospace">
                    {formatNum(yToPrice(y))}
                  </text>
                </g>
              ))}

              {/* Hover Crosshair */}
              {hoverIndex !== null && candles[hoverIndex] && (
                <g>
                  <line
                    x1={20 + (hoverIndex * 700) / candles.length}
                    x2={20 + (hoverIndex * 700) / candles.length}
                    y1="10"
                    y2="390"
                    stroke="#787b86"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={20 + (hoverIndex * 700) / candles.length}
                    cy={priceToY(candles[hoverIndex].close)}
                    r="4.5"
                    fill="#2962ff"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Invisible Hover Columns for Smooth Scrubbing */}
              {candles.map((_, idx) => {
                const x = 20 + (idx * 700) / candles.length;
                const colW = 700 / candles.length;
                return (
                  <rect
                    key={`hit-${idx}`}
                    x={x - colW / 2}
                    y="0"
                    width={colW}
                    height="400"
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(idx)}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Watchlist & Price Alerts */}
        <div className="lg:col-span-3 flex flex-col justify-between p-4 bg-white">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-tv-gray">
                Watchlist &amp; Quotes
              </span>
              <span className="text-xs text-tv-gray num-tabular">{ALL_CHART_SYMBOLS.length} symbols</span>
            </div>

            <div className="divide-y divide-tv-border max-h-[250px] overflow-y-auto no-scrollbar border border-tv-border rounded-xl">
              {ALL_CHART_SYMBOLS.map((item) => {
                const isSelected = item.symbol === activeAsset.symbol;
                return (
                  <button
                    key={item.symbol}
                    onClick={() => setActiveAsset(item)}
                    className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition cursor-pointer ${
                      isSelected ? 'bg-tv-lightGray' : 'hover:bg-tv-hoverBg'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-tv-dark flex items-center gap-1.5">
                        <span>{item.symbol}</span>
                        {watchlist.includes(item.symbol) && (
                          <span className="text-tv-blue text-[10px]">★</span>
                        )}
                      </div>
                      <div className="text-[11px] text-tv-gray truncate w-28">{item.name}</div>
                    </div>
                    <div className="text-right num-tabular">
                      <div className="text-xs font-bold text-tv-dark">{item.price}</div>
                      <div
                        className={`text-[11px] font-semibold ${
                          item.isPositive ? 'text-tv-green' : 'text-tv-red'
                        }`}
                      >
                        {item.changePct}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Alerts Box */}
          <div className="mt-4 pt-4 border-t border-tv-border">
            <div className="text-xs font-bold uppercase tracking-wider text-tv-gray mb-2">
              Price Alerts ({activeAlerts.length})
            </div>
            <form onSubmit={handleAddAlert} className="flex gap-1.5 mb-2.5">
              <input
                type="text"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder={`Target for ${activeAsset.symbol}...`}
                className="flex-1 min-w-0 border border-tv-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-tv-blue num-tabular"
              />
              <button
                type="submit"
                className="bg-tv-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition cursor-pointer whitespace-nowrap"
              >
                Set Alert
              </button>
            </form>
            <div className="space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {activeAlerts.map((al, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs bg-tv-lightGray/70 px-2.5 py-1.5 rounded-lg"
                >
                  <span className="font-semibold text-tv-dark">{al.symbol}</span>
                  <span className="num-tabular text-tv-blue font-bold">@ {al.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

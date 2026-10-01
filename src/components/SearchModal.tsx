import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ALL_US_INDICES,
  WORLD_INDICES,
  US_STOCKS_BY_TAB,
  EXTENDED_CRYPTO_LIST,
  CATEGORY_HIGHLIGHTS,
} from '../data/marketData';
import { SuperchartSymbol } from './SuperchartsView';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (sym: SuperchartSymbol) => void;
}

type AssetFilter = 'All' | 'Stocks' | 'Indices' | 'Crypto' | 'Forex' | 'Futures' | 'Bonds' | 'ETFs';

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AssetFilter>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const allItems = useMemo(() => {
    const list: (SuperchartSymbol & { filterGroup: AssetFilter; exchange: string })[] = [];

    ALL_US_INDICES.forEach((idx) => {
      list.push({
        symbol: idx.ticker,
        name: idx.name,
        price: idx.price,
        numericPrice: idx.numericPrice,
        changePct: idx.change,
        isPositive: idx.isPositive,
        category: 'US Index',
        filterGroup: 'Indices',
        exchange: 'INDEX',
        range52W: idx.range52W,
      });
    });

    WORLD_INDICES.forEach((w) => {
      list.push({
        symbol: w.ticker,
        name: w.name,
        price: w.last,
        numericPrice: w.numericLast,
        changePct: w.chgPct,
        isPositive: w.isPositive,
        category: w.region,
        filterGroup: 'Indices',
        exchange: 'GLOBAL',
        range52W: w.range52W,
      });
    });

    const seenStocks = new Set<string>();
    Object.values(US_STOCKS_BY_TAB)
      .flat()
      .forEach((s) => {
        if (seenStocks.has(s.ticker)) return;
        seenStocks.add(s.ticker);
        list.push({
          symbol: s.ticker,
          name: s.name,
          price: s.price,
          numericPrice: s.numericPrice,
          changePct: s.changePct,
          isPositive: s.isPositive,
          category: s.sector,
          filterGroup: 'Stocks',
          exchange: 'NASDAQ / NYSE',
          range52W: s.range52W,
          volume: s.volume,
        });
      });

    EXTENDED_CRYPTO_LIST.forEach((c) => {
      list.push({
        symbol: c.pair,
        name: c.name,
        price: c.price,
        numericPrice: c.numericPrice,
        changePct: c.changePct,
        isPositive: c.isPositive,
        category: 'Crypto Spot',
        filterGroup: 'Crypto',
        exchange: 'CRYPTO',
        range52W: c.range52W,
      });
    });

    CATEGORY_HIGHLIGHTS['Forex'].forEach((fx) => {
      list.push({
        symbol: fx.symbol,
        name: fx.name,
        price: fx.last,
        numericPrice: parseFloat(fx.last.replace(/[^0-9.]/g, '')) || 1.0,
        changePct: fx.changePct,
        isPositive: fx.isPositive,
        category: 'Forex',
        filterGroup: 'Forex',
        exchange: 'FX SPOT',
      });
    });

    CATEGORY_HIGHLIGHTS['Futures'].forEach((ft) => {
      list.push({
        symbol: ft.symbol,
        name: ft.name,
        price: ft.last,
        numericPrice: parseFloat(ft.last.replace(/[^0-9.]/g, '')) || 100,
        changePct: ft.changePct,
        isPositive: ft.isPositive,
        category: 'Futures',
        filterGroup: 'Futures',
        exchange: 'CME / NYMEX',
      });
    });

    [...CATEGORY_HIGHLIGHTS['Government bonds'], ...CATEGORY_HIGHLIGHTS['Corporate bonds']].forEach(
      (b) => {
        list.push({
          symbol: b.symbol,
          name: b.name,
          price: b.last,
          numericPrice: parseFloat(b.last.replace(/[^0-9.]/g, '')) || 4.0,
          changePct: b.changePct,
          isPositive: b.isPositive,
          category: 'Fixed Income',
          filterGroup: 'Bonds',
          exchange: 'TVC / NYSE',
        });
      }
    );

    CATEGORY_HIGHLIGHTS['ETFs'].forEach((etf) => {
      list.push({
        symbol: etf.symbol,
        name: etf.name,
        price: etf.last,
        numericPrice: parseFloat(etf.last.replace(/[^0-9.]/g, '')) || 100,
        changePct: etf.changePct,
        isPositive: etf.isPositive,
        category: 'ETF',
        filterGroup: 'ETFs',
        exchange: 'NYSE ARCA',
      });
    });

    return list;
  }, []);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchesGroup = filter === 'All' || item.filterGroup === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [allItems, filter, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-tv-border rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-tv-border">
          <svg
            className="w-5 h-5 text-tv-gray shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, index, crypto or bond (e.g. SPX, NVDA, BTC)..."
            className="w-full text-sm text-tv-dark placeholder:text-tv-gray focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-xs font-semibold text-tv-gray hover:text-tv-dark px-2 py-1 rounded bg-tv-lightGray cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-tv-border overflow-x-auto no-scrollbar bg-tv-lightGray/40">
          {(['All', 'Stocks', 'Indices', 'Crypto', 'Forex', 'Futures', 'Bonds', 'ETFs'] as AssetFilter[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  filter === tab
                    ? 'bg-tv-dark text-white'
                    : 'text-tv-gray hover:text-tv-dark hover:bg-tv-lightGray'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-tv-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-tv-gray">
              No matching symbols found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={`${item.symbol}-${idx}`}
                onClick={() => {
                  onSelectSymbol(item);
                  onClose();
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-tv-hoverBg transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-tv-dark w-24 shrink-0">{item.symbol}</span>
                  <div>
                    <div className="text-sm font-medium text-tv-dark">{item.name}</div>
                    <div className="text-xs text-tv-gray">
                      {item.category} · {item.exchange}
                    </div>
                  </div>
                </div>
                <div className="text-right num-tabular">
                  <div className="text-sm font-bold text-tv-dark">{item.price}</div>
                  <div
                    className={`text-xs font-semibold ${
                      item.isPositive ? 'text-tv-green' : 'text-tv-red'
                    }`}
                  >
                    {item.changePct}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-tv-lightGray/60 border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
          <span>Click any instrument to launch interactive Supercharts</span>
          <span className="num-tabular">{filtered.length} instruments</span>
        </div>
      </div>
    </div>
  );
};

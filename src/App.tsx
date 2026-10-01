import React, { useState, useEffect } from 'react';
import {
  CATEGORIES,
  MAIN_INDICES,
  MAJOR_BENCHMARKS,
  ALL_US_INDICES,
  WORLD_INDICES,
  US_STOCKS_BY_TAB,
  CRYPTO_CARDS,
  EXTENDED_CRYPTO_LIST,
  CATEGORY_HIGHLIGHTS,
  COMMUNITY_IDEAS,
  BROKERS_LIST,
  MarketCategory,
  Timeframe,
  StockSubTab,
} from './data/marketData';
import { SuperchartsView, SuperchartSymbol } from './components/SuperchartsView';
import { SearchModal } from './components/SearchModal';

type NavTab = 'Products' | 'Community' | 'Markets' | 'Brokers' | 'More';

export default function App() {
  // Navigation & Primary View State
  const [activeNav, setActiveNav] = useState<NavTab>('Markets');
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedIndexId, setSelectedIndexId] = useState<string>('SPX');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [activeStockTab, setActiveStockTab] = useState<StockSubTab>('Most active');

  // Interactive Chart Hover State
  const [chartHoverIdx, setChartHoverIdx] = useState<number | null>(null);

  // World Indices Table Sorting
  const [worldSortField, setWorldSortField] = useState<'default' | 'last' | 'chg' | 'chgPct'>('default');
  const [worldSortAsc, setWorldSortAsc] = useState<boolean>(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [superchartSymbol, setSuperchartSymbol] = useState<SuperchartSymbol | undefined>(undefined);
  const [inspectSymbol, setInspectSymbol] = useState<SuperchartSymbol | null>(null);
  const [showAllUSIndicesModal, setShowAllUSIndicesModal] = useState<boolean>(false);
  const [showAllCryptoModal, setShowAllCryptoModal] = useState<boolean>(false);
  const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [widgetCopied, setWidgetCopied] = useState<boolean>(false);
  const [locale, setLocale] = useState<'EN' | 'DE' | 'JP' | 'FR'>('EN');
  const [showLocaleMenu, setShowLocaleMenu] = useState<boolean>(false);
  const [showHeadlineMenu, setShowHeadlineMenu] = useState<boolean>(false);

  // User Watchlist State
  const [watchlist, setWatchlist] = useState<string[]>([
    'INDEX:SPX',
    'NVDA',
    'AAPL',
    'BTC/USD',
  ]);

  // Global Ctrl+K / Cmd+K shortcut for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setInspectSymbol(null);
        setShowAllUSIndicesModal(false);
        setShowAllCryptoModal(false);
        setShowWidgetModal(false);
        setShowAccountModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const activeIndex = MAIN_INDICES.find((i) => i.id === selectedIndexId) || MAIN_INDICES[0];
  const activeSvgData = activeIndex.svgPaths[selectedTimeframe];
  const activeSeries = activeIndex.series[selectedTimeframe];

  const sortedWorldIndices = React.useMemo(() => {
    if (worldSortField === 'default') return WORLD_INDICES;
    return [...WORLD_INDICES].sort((a, b) => {
      const valA =
        worldSortField === 'last'
          ? a.numericLast
          : worldSortField === 'chg'
          ? a.numericChg
          : a.numericChgPct;
      const valB =
        worldSortField === 'last'
          ? b.numericLast
          : worldSortField === 'chg'
          ? b.numericChg
          : b.numericChgPct;
      return worldSortAsc ? valA - valB : valB - valA;
    });
  }, [worldSortField, worldSortAsc]);

  const handleSortWorld = (field: 'last' | 'chg' | 'chgPct') => {
    if (worldSortField === field) {
      if (worldSortAsc) {
        setWorldSortField('default');
      } else {
        setWorldSortAsc(true);
      }
    } else {
      setWorldSortField(field);
      setWorldSortAsc(false);
    }
  };

  const openInSupercharts = (sym: SuperchartSymbol) => {
    setSuperchartSymbol(sym);
    setActiveNav('Products');
    setInspectSymbol(null);
    setShowAllUSIndicesModal(false);
    setShowAllCryptoModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeStocks = US_STOCKS_BY_TAB[activeStockTab];

  return (
    <div className="min-h-screen bg-white text-tv-dark selection:bg-blue-100 selection:text-blue-900">
      {/* BEGIN: MainHeader */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tv-border">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[64px] flex items-center justify-between">
          {/* Left side: TV Iconic Logo, Search & Nav links */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a
              className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
              href="#markets"
              title="TradingView Home"
              onClick={(e) => {
                e.preventDefault();
                setActiveNav('Markets');
                setActiveCategory('US stocks');
                setSelectedIndexId('SPX');
                setSelectedTimeframe('1D');
              }}
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 fill-current text-tv-dark"
                viewBox="0 0 36 28"
              >
                <path d="M14 22H7V11h7v11zm9-16h-7v22h7V6zm9 5h-7v17h7V11z"></path>
                <path
                  d="M0 5.5A5.5 5.5 0 0 1 5.5 0H14v6H5.5A0.5 0.5 0 0 0 5 6.5v15a0.5 0.5 0 0 0 .5.5H7v6H5.5A5.5 5.5 0 0 1 0 22.5v-17z"
                  fill="none"
                ></path>
                <path
                  d="M3.5 4h6.5v6H6.5A2.5 2.5 0 0 0 4 12.5V23H0v-10.5A8.5 8.5 0 0 1 8.5 4z"
                  fill="none"
                ></path>
                <path
                  d="M5 4.5A2.5 2.5 0 0 1 7.5 2H11v5H7.5A0.5 0.5 0 0 0 7 7.5V11H2V7.5A3 3 0 0 1 5 4.5z"
                  fill="none"
                ></path>
                <path
                  d="M0 6h8v5H3.5C2.12 11 1 12.12 1 13.5V28H0V6z"
                  fill="none"
                ></path>
                <polygon points="4,24 8,24 8,8 0,8 0,13 4,13"></polygon>
                <polygon points="12,28 17,28 17,0 12,0"></polygon>
                <polygon points="21,28 26,28 26,10 21,10"></polygon>
                <polygon points="30,28 35,28 35,6 30,6"></polygon>
              </svg>
            </a>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2.5 bg-tv-lightGray hover:bg-[#e4e7ef] text-tv-gray px-3.5 py-1.5 rounded-full text-sm font-normal w-56 lg:w-64 transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-tv-gray"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  ></path>
                </svg>
                <span className="text-xs text-tv-gray/90">Search (Ctrl+K)</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold ml-2">
              {(['Products', 'Community', 'Markets', 'Brokers', 'More'] as NavTab[]).map((tab) => {
                const isActive = activeNav === tab;
                return (
                  <a
                    key={tab}
                    href={`#${tab.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(tab);
                    }}
                    className={
                      isActive
                        ? 'text-tv-blue relative py-2'
                        : 'text-tv-gray hover:text-tv-dark transition-colors'
                    }
                  >
                    {tab}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-tv-blue rounded-full"></span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right side controls: Language, Profile, CTA */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center hover:bg-tv-lightGray text-tv-dark transition-colors cursor-pointer"
              title="Search symbols"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                />
              </svg>
            </button>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLocaleMenu((prev) => !prev)}
                className="flex items-center gap-1.5 text-sm font-semibold text-tv-dark hover:text-tv-blue transition-colors px-2 py-1 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  <path
                    d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                    strokeWidth="2"
                  ></path>
                </svg>
                <span className="text-xs uppercase font-bold tracking-wide">{locale}</span>
              </button>
              {showLocaleMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-tv-border rounded-xl shadow-lg py-1.5 z-50 text-xs font-semibold">
                  {(
                    [
                      { code: 'EN', label: 'English (USD)' },
                      { code: 'DE', label: 'Deutsch (EUR)' },
                      { code: 'JP', label: '日本語 (JPY)' },
                      { code: 'FR', label: 'Français (EUR)' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLocale(item.code);
                        setShowLocaleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-tv-hoverBg flex items-center justify-between cursor-pointer ${
                        locale === item.code ? 'text-tv-blue font-bold' : 'text-tv-dark'
                      }`}
                    >
                      <span>{item.label}</span>
                      {locale === item.code && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User profile icon */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-tv-lightGray text-tv-dark transition-colors cursor-pointer relative"
              title="Account profile & Watchlist"
            >
              <svg
                className="w-5 h-5 text-tv-dark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                ></path>
              </svg>
            </button>

            {/* Get Started Gradient Pill Button */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="gradient-btn text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Get started
            </button>
          </div>
        </div>
      </header>
      {/* END: MainHeader */}

      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Conditional Top-Level Navigation Screens */}
        {activeNav === 'Products' && (
          <SuperchartsView
            initialSymbol={superchartSymbol}
            onBackToMarkets={() => setActiveNav('Markets')}
            watchlist={watchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        )}

        {activeNav === 'Community' && (
          <section className="mb-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-tv-dark">
                  Community Trade Ideas &amp; Research
                </h1>
                <p className="text-sm text-tv-gray mt-1">
                  Institutional and quantitative market setups shared by verified market analysts
                </p>
              </div>
              <button
                onClick={() => setActiveNav('Markets')}
                className="px-4 py-2 rounded-full text-xs font-bold border border-tv-border hover:bg-tv-lightGray transition cursor-pointer"
              >
                ← Back to Markets Overview
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {COMMUNITY_IDEAS.map((idea) => (
                <div
                  key={idea.id}
                  onClick={() =>
                    openInSupercharts({
                      symbol: idea.symbol,
                      name: idea.title,
                      price: idea.targetPrice,
                      numericPrice: parseFloat(idea.targetPrice.replace(/[^0-9.]/g, '')) || 5983.99,
                      changePct: idea.bias === 'LONG' ? '+2.40%' : '-1.80%',
                      isPositive: idea.bias === 'LONG',
                      category: 'Community Setup',
                    })
                  }
                  className="border border-tv-border hover:border-gray-400 rounded-2xl p-5 bg-white transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-tv-gray mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-tv-dark">{idea.symbol}</span>
                        <span>·</span>
                        <span>{idea.timeframe} Chart</span>
                        <span>·</span>
                        <span
                          className={`font-bold ${
                            idea.bias === 'LONG' ? 'text-tv-green' : 'text-tv-red'
                          }`}
                        >
                          {idea.bias}
                        </span>
                      </div>
                      <span>{idea.publishedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-tv-dark mb-2 hover:text-tv-blue transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-tv-gray leading-relaxed">{idea.summary}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-tv-lightGray flex items-center justify-between text-xs">
                    <span className="font-semibold text-tv-dark">By {idea.author}</span>
                    <div className="flex items-center gap-4 text-tv-gray num-tabular">
                      <span>Target: {idea.targetPrice}</span>
                      <span>▲ {idea.likes}</span>
                      <span>💬 {idea.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeNav === 'Brokers' && (
          <section className="mb-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-tv-dark">
                  Verified Brokerage Integrations
                </h1>
                <p className="text-sm text-tv-gray mt-1">
                  Connect live brokerage accounts or practice with real-time Paper Trading directly inside Supercharts
                </p>
              </div>
              <button
                onClick={() => setActiveNav('Markets')}
                className="px-4 py-2 rounded-full text-xs font-bold border border-tv-border hover:bg-tv-lightGray transition cursor-pointer"
              >
                ← Back to Markets Overview
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BROKERS_LIST.map((broker) => (
                <div
                  key={broker.id}
                  className="border border-tv-border rounded-2xl p-5 bg-white flex flex-col justify-between hover:border-gray-400 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl text-white font-black text-sm flex items-center justify-center shrink-0"
                        style={{ backgroundColor: broker.badgeColor }}
                      >
                        {broker.badge}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-tv-dark">{broker.name}</h3>
                        <p className="text-xs text-tv-gray mt-0.5">{broker.assets}</p>
                      </div>
                    </div>
                    <div className="text-right num-tabular">
                      <div className="text-sm font-extrabold text-tv-dark">★ {broker.rating} / 5.0</div>
                      <div className="text-xs text-tv-gray">{broker.reviewsCount}</div>
                    </div>
                  </div>
                  <div className="mt-5 pt-3 border-t border-tv-lightGray flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-tv-gray">
                      Min Deposit: <strong className="text-tv-dark">{broker.minDeposit}</strong> ·{' '}
                      <span>{broker.commission}</span> · <span>{broker.regulation}</span>
                    </div>
                    <button
                      onClick={() => setActiveNav('Products')}
                      className="text-tv-blue font-bold hover:underline cursor-pointer"
                    >
                      Launch Trading Panel →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeNav === 'More' && (
          <section className="mb-14">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-tv-dark">
                  Global Economic Calendar &amp; Screeners
                </h1>
                <p className="text-sm text-tv-gray mt-1">
                  Macroeconomic releases, central bank rate decisions, and cross-asset benchmarks
                </p>
              </div>
              <button
                onClick={() => setActiveNav('Markets')}
                className="px-4 py-2 rounded-full text-xs font-bold border border-tv-border hover:bg-tv-lightGray transition cursor-pointer"
              >
                ← Back to Markets Overview
              </button>
            </div>
            <div className="overflow-x-auto border border-tv-border rounded-xl bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-tv-lightGray/70 border-b border-tv-border text-xs font-semibold text-tv-gray uppercase">
                  <tr>
                    <th className="py-3 px-4">Indicator</th>
                    <th className="py-3 px-4">Category / Source</th>
                    <th className="py-3 px-4 text-right">Actual</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tv-border font-medium">
                  {CATEGORY_HIGHLIGHTS['Economy'].map((ev) => (
                    <tr key={ev.symbol} className="hover:bg-tv-hoverBg transition-colors">
                      <td className="py-3.5 px-4 font-bold text-tv-dark">
                        {ev.name}{' '}
                        <span className="text-xs text-tv-gray font-normal ml-1">{ev.symbol}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-tv-gray">{ev.detail}</td>
                      <td className="py-3.5 px-4 text-right font-semibold num-tabular">{ev.last}</td>
                      <td
                        className={`py-3.5 px-4 text-right font-semibold num-tabular ${
                          ev.isPositive ? 'text-tv-green' : 'text-tv-red'
                        }`}
                      >
                        {ev.change}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-tv-gray num-tabular">
                        {ev.changePct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* BEGIN: HeroHeadlineSection */}
        <section className="flex flex-col items-center justify-center text-center mb-10 relative">
          {/* Big Headline */}
          <div
            onClick={() => setShowHeadlineMenu((prev) => !prev)}
            className="inline-flex items-center gap-3 cursor-pointer group select-none"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-tv-dark group-hover:text-tv-blue transition-colors">
              Markets, everywhere
            </h1>
            <svg
              className={`w-7 h-7 md:w-9 md:h-9 text-tv-dark stroke-[2.5] mt-1 transition-transform group-hover:translate-y-0.5 ${
                showHeadlineMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>

          {/* Quick Jump Dropdown when clicking "Markets, everywhere v" */}
          {showHeadlineMenu && (
            <div className="mt-3 bg-white border border-tv-border rounded-2xl shadow-lg p-2 flex flex-wrap items-center justify-center gap-2 z-30 max-w-xl">
              {[
                { label: 'Major Indices', target: 'indices-section' },
                { label: 'World Indices', target: 'world-indices-section' },
                { label: 'US Stocks', target: 'us-stocks-section' },
                { label: 'Crypto Markets', target: 'crypto-section' },
                { label: 'Launch Supercharts', action: () => setActiveNav('Products') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowHeadlineMenu(false);
                    if (item.action) {
                      item.action();
                    } else if (item.target) {
                      document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-tv-lightGray hover:bg-tv-dark hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Categories Filter Tabs */}
          <div className="w-full mt-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start sm:justify-center gap-2 min-w-max px-2">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={
                      isActive
                        ? 'px-4 py-1.5 rounded-full text-sm font-semibold bg-tv-pillActive text-tv-dark cursor-pointer whitespace-nowrap'
                        : 'px-4 py-1.5 rounded-full text-sm font-medium text-tv-gray hover:text-tv-dark hover:bg-tv-lightGray transition cursor-pointer whitespace-nowrap'
                    }
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        {/* END: HeroHeadlineSection */}

        {/* Dynamic Category Spotlight Banner when a non-default category tab is selected */}
        {activeCategory !== 'US stocks' && (
          <section className="mb-12 border border-tv-border rounded-2xl p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-tv-dark">
                  {activeCategory} Spotlight
                </h2>
                <span className="text-xs text-tv-gray">· Real-time institutional feed</span>
              </div>
              <button
                onClick={() => setActiveCategory('US stocks')}
                className="text-xs font-semibold text-tv-blue hover:underline cursor-pointer"
              >
                Reset to Default View
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORY_HIGHLIGHTS[activeCategory].map((item) => (
                <div
                  key={item.symbol}
                  onClick={() =>
                    openInSupercharts({
                      symbol: item.symbol,
                      name: item.name,
                      price: item.last,
                      numericPrice: parseFloat(item.last.replace(/[^0-9.]/g, '')) || 100,
                      changePct: item.changePct,
                      isPositive: item.isPositive,
                      category: item.category,
                    })
                  }
                  className="border border-tv-border hover:border-gray-400 p-4 rounded-xl bg-white transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-tv-dark">{item.symbol}</div>
                      <div className="text-xs text-tv-gray truncate w-36">{item.name}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded num-tabular ${
                        item.isPositive
                          ? 'text-tv-green bg-tv-greenLight'
                          : 'text-tv-red bg-tv-redLight'
                      }`}
                    >
                      {item.changePct}
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-lg font-bold num-tabular">{item.last}</span>
                    <span className="text-xs text-tv-gray">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BEGIN: IndicesMainSection */}
        <section id="indices-section" className="mb-14">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <a
              className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-tv-dark hover:text-tv-blue cursor-pointer"
              href="#indices"
              onClick={(e) => {
                e.preventDefault();
                setShowAllUSIndicesModal(true);
              }}
            >
              Indices
              <svg
                className="w-5 h-5 text-tv-gray group-hover:text-tv-blue transition-transform group-hover:translate-x-0.5 stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>
          </div>

          {/* Quick Index Pill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {MAIN_INDICES.map((idx) => {
              const isSelected = idx.id === selectedIndexId;
              return (
                <div
                  key={idx.id}
                  onClick={() => setSelectedIndexId(idx.id)}
                  className={
                    isSelected
                      ? 'bg-tv-lightGray hover:bg-[#e7eaf2] p-4 rounded-full flex items-center justify-between cursor-pointer transition'
                      : 'bg-white hover:bg-tv-hoverBg border border-tv-border p-4 rounded-full flex items-center justify-between cursor-pointer transition'
                  }
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center tracking-tighter shrink-0 shadow-inner"
                      style={{ backgroundColor: idx.badgeColor }}
                    >
                      {idx.badgeText}
                    </span>
                    <div>
                      <div className="font-bold text-sm tracking-tight text-tv-dark">{idx.name}</div>
                      <div className="text-xs text-tv-gray">{idx.ticker}</div>
                    </div>
                  </div>
                  <div className="text-right pr-2">
                    <div className="text-sm font-bold num-tabular">{idx.price}</div>
                    <div
                      className={`text-xs font-semibold num-tabular ${
                        idx.isPositive ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {idx.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Interactive Chart Preview Box & Key Market Indicators Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-tv-border rounded-2xl p-5 md:p-6 shadow-sm">
            {/* Left Side: Interactive Mini Chart */}
            <div className="lg:col-span-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-tv-border pb-6 lg:pb-0 lg:pr-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-tv-green animate-pulse"></span>
                    <h3 className="text-lg font-bold">{activeIndex.name} Performance Overview</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-tv-greenLight text-tv-green font-bold uppercase tracking-wider">
                      Market Open
                    </span>
                  </div>
                  <p className="text-xs text-tv-gray mt-0.5">{activeIndex.description}</p>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center bg-tv-lightGray p-1 rounded-lg text-xs font-semibold">
                  {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => {
                    const isTfActive = selectedTimeframe === tf;
                    return (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={
                          isTfActive
                            ? 'px-2.5 py-1 rounded bg-white shadow-xs text-tv-dark cursor-pointer'
                            : 'px-2.5 py-1 text-tv-gray hover:text-tv-dark cursor-pointer'
                        }
                      >
                        {tf}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Synthetic SVG Area Chart (TradingView style sparkline canvas) */}
              <div
                className="w-full h-56 relative my-2 select-none"
                onMouseLeave={() => setChartHoverIdx(null)}
              >
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                  <defs>
                    <linearGradient id="tvChartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={activeSvgData.isPositive ? '#089981' : '#f23645'}
                        stopOpacity="0.32"
                      ></stop>
                      <stop
                        offset="100%"
                        stopColor={activeSvgData.isPositive ? '#089981' : '#f23645'}
                        stopOpacity="0.0"
                      ></stop>
                    </linearGradient>
                  </defs>
                  {/* Chart Gridlines */}
                  <line
                    stroke="#f0f3fa"
                    strokeDasharray="3 3"
                    x1="0"
                    x2="600"
                    y1="40"
                    y2="40"
                  ></line>
                  <line
                    stroke="#f0f3fa"
                    strokeDasharray="3 3"
                    x1="0"
                    x2="600"
                    y1="90"
                    y2="90"
                  ></line>
                  <line
                    stroke="#f0f3fa"
                    strokeDasharray="3 3"
                    x1="0"
                    x2="600"
                    y1="140"
                    y2="140"
                  ></line>
                  {/* Area Fill */}
                  <path d={activeSvgData.area} fill="url(#tvChartGradient)"></path>
                  {/* Crisp Line */}
                  <path
                    d={activeSvgData.line}
                    fill="none"
                    stroke={activeSvgData.isPositive ? '#089981' : '#f23645'}
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Final price indicator dot */}
                  <circle
                    className="animate-ping"
                    cx="600"
                    cy={activeSvgData.isPositive ? 20 : 152}
                    fill={activeSvgData.isPositive ? '#089981' : '#f23645'}
                    opacity="0.4"
                    r="4.5"
                  ></circle>
                  <circle
                    cx="600"
                    cy={activeSvgData.isPositive ? 20 : 152}
                    fill={activeSvgData.isPositive ? '#089981' : '#f23645'}
                    r="3.5"
                  ></circle>

                  {/* Interactive Hover Crosshair Line */}
                  {chartHoverIdx !== null && activeSeries[chartHoverIdx] && (
                    <line
                      x1={(chartHoverIdx / Math.max(1, activeSeries.length - 1)) * 590 + 5}
                      x2={(chartHoverIdx / Math.max(1, activeSeries.length - 1)) * 590 + 5}
                      y1="0"
                      y2="200"
                      stroke="#787b86"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  )}

                  {/* Invisible Hover Columns */}
                  {activeSeries.map((_, idx) => {
                    const colWidth = 600 / activeSeries.length;
                    return (
                      <rect
                        key={idx}
                        x={idx * colWidth}
                        y="0"
                        width={colWidth}
                        height="200"
                        fill="transparent"
                        className="cursor-crosshair"
                        onMouseEnter={() => setChartHoverIdx(idx)}
                      />
                    );
                  })}
                </svg>

                {/* Price Badge */}
                <div
                  className={`absolute right-2 top-3 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow num-tabular ${
                    activeSvgData.isPositive ? 'bg-tv-green' : 'bg-tv-red'
                  }`}
                >
                  {chartHoverIdx !== null && activeSeries[chartHoverIdx]
                    ? `${activeSeries[chartHoverIdx].time} · ${activeSeries[
                        chartHoverIdx
                      ].price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} (${activeSeries[chartHoverIdx].volume})`
                    : activeSvgData.badge}
                </div>
              </div>

              {/* Bottom Chart CTA actions */}
              <div className="flex items-center justify-between pt-3 border-t border-tv-lightGray text-xs font-semibold">
                <span className="text-tv-gray">Data provided by BATS &amp; major exchanges</span>
                <div className="flex items-center gap-4 text-tv-blue">
                  <a
                    className="hover:underline flex items-center gap-1 cursor-pointer"
                    href="#supercharts"
                    onClick={(e) => {
                      e.preventDefault();
                      openInSupercharts({
                        symbol: activeIndex.ticker,
                        name: activeIndex.name,
                        price: activeIndex.price,
                        numericPrice: activeIndex.numericPrice,
                        changePct: activeIndex.change,
                        isPositive: activeIndex.isPositive,
                        category: 'US Index',
                      });
                    }}
                  >
                    Launch full-featured Supercharts →
                  </a>
                  <a
                    className="text-tv-gray hover:text-tv-dark cursor-pointer"
                    href="#widget"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWidgetModal(true);
                    }}
                  >
                    Get widget
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: Mini Table of other primary US Indices */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="font-bold text-sm text-tv-gray uppercase tracking-wider mb-2">
                Major Benchmarks
              </div>
              <div className="divide-y divide-tv-border">
                {MAJOR_BENCHMARKS.map((bench) => (
                  <div
                    key={bench.id}
                    onClick={() =>
                      setInspectSymbol({
                        symbol: bench.ticker,
                        name: bench.name,
                        price: bench.price,
                        numericPrice: bench.numericPrice,
                        changePct: bench.change,
                        isPositive: bench.isPositive,
                        category: bench.category,
                        range52W: bench.range52W,
                      })
                    }
                    className="py-2.5 flex items-center justify-between hover:bg-tv-hoverBg px-1 rounded transition cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-sm">{bench.name}</div>
                      <div className="text-xs text-tv-gray">{bench.ticker}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold num-tabular">{bench.price}</div>
                      <div
                        className={`text-xs font-bold num-tabular ${
                          bench.isPositive ? 'text-tv-green' : 'text-tv-red'
                        }`}
                      >
                        {bench.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                className="mt-4 block text-center py-2 border border-tv-border hover:bg-tv-lightGray rounded-xl text-xs font-bold text-tv-dark transition cursor-pointer"
                href="#all-us-indices"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllUSIndicesModal(true);
                }}
              >
                See all 42 US Indices
              </a>
            </div>
          </div>
        </section>
        {/* END: IndicesMainSection */}

        {/* BEGIN: WorldIndicesSection */}
        <section id="world-indices-section" className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <a
              className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-tv-dark hover:text-tv-blue cursor-pointer"
              href="#world-indices"
              onClick={(e) => {
                e.preventDefault();
                setWorldSortField('default');
              }}
            >
              World indices
              <svg
                className="w-5 h-5 text-tv-gray group-hover:text-tv-blue transition-transform group-hover:translate-x-0.5 stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium text-tv-gray">
                {worldSortField === 'default'
                  ? 'Sorted by market prominence'
                  : `Sorted by ${worldSortField.toUpperCase()} (${worldSortAsc ? 'Asc' : 'Desc'})`}
              </span>
            </div>
          </div>

          {/* High density data table */}
          <div className="overflow-x-auto border border-tv-border rounded-xl">
            <table className="w-full text-left text-sm" id="world-indices-table">
              <thead className="bg-tv-lightGray/70 border-b border-tv-border text-xs font-semibold text-tv-gray uppercase">
                <tr>
                  <th className="py-3 px-4" scope="col">
                    Index
                  </th>
                  <th className="py-3 px-4" scope="col">
                    Region / Country
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-tv-dark select-none"
                    scope="col"
                    onClick={() => handleSortWorld('last')}
                  >
                    Last {worldSortField === 'last' ? (worldSortAsc ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-tv-dark select-none"
                    scope="col"
                    onClick={() => handleSortWorld('chg')}
                  >
                    Chg {worldSortField === 'chg' ? (worldSortAsc ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-tv-dark select-none"
                    scope="col"
                    onClick={() => handleSortWorld('chgPct')}
                  >
                    Chg % {worldSortField === 'chgPct' ? (worldSortAsc ? '↑' : '↓') : ''}
                  </th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell" scope="col">
                    52W Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tv-border font-medium">
                {sortedWorldIndices.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      setInspectSymbol({
                        symbol: row.ticker,
                        name: row.name,
                        price: row.last,
                        numericPrice: row.numericLast,
                        changePct: row.chgPct,
                        isPositive: row.isPositive,
                        category: `${row.region} Index`,
                        range52W: row.range52W,
                      })
                    }
                    className="hover:bg-tv-hoverBg transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full ${row.badgeBg} ${row.badgeText} flex items-center justify-center text-[10px] font-black`}
                        >
                          {row.countryCode}
                        </span>
                        <div>
                          <span className="font-bold text-tv-dark hover:text-tv-blue cursor-pointer">
                            {row.name}
                          </span>
                          <span className="text-xs text-tv-gray ml-1.5 font-normal">
                            {row.ticker}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-tv-gray">{row.region}</td>
                    <td className="py-3.5 px-4 text-right font-semibold num-tabular">{row.last}</td>
                    <td
                      className={`py-3.5 px-4 text-right font-semibold num-tabular ${
                        row.isPositive ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {row.chg}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-semibold num-tabular ${
                        row.isPositive ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {row.chgPct}
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-tv-gray hidden sm:table-cell num-tabular">
                      {row.range52W}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* END: WorldIndicesSection */}

        {/* BEGIN: USStocksSection */}
        <section id="us-stocks-section" className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <a
              className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-tv-dark hover:text-tv-blue cursor-pointer"
              href="#us-stocks"
              onClick={(e) => {
                e.preventDefault();
                setIsSearchOpen(true);
              }}
            >
              US stocks
              <svg
                className="w-5 h-5 text-tv-gray group-hover:text-tv-blue transition-transform group-hover:translate-x-0.5 stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>

            {/* Filter Subtabs */}
            <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto no-scrollbar">
              {(
                ['Most active', 'Top gainers', 'Top losers', 'Earnings this week'] as StockSubTab[]
              ).map((tab) => {
                const isActive = activeStockTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveStockTab(tab)}
                    className={
                      isActive
                        ? 'bg-tv-dark text-white px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap'
                        : 'bg-tv-lightGray hover:bg-tv-border text-tv-dark px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap'
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stocks Grid (Top Mega-cap tech items) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {activeStocks.map((stock) => (
              <div
                key={stock.id}
                onClick={() =>
                  setInspectSymbol({
                    symbol: stock.ticker,
                    name: stock.name,
                    price: stock.price,
                    numericPrice: stock.numericPrice,
                    changePct: stock.changePct,
                    isPositive: stock.isPositive,
                    category: `${stock.sector} · ${stock.marketCap}`,
                    range52W: stock.range52W,
                    volume: stock.volume,
                  })
                }
                className="border border-tv-border hover:border-gray-400 p-4 rounded-xl transition hover:shadow-sm bg-white cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-xs"
                      style={{ backgroundColor: stock.badgeBg }}
                    >
                      {stock.badgeText}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{stock.ticker}</h4>
                      <p className="text-xs text-tv-gray truncate w-24">{stock.name}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded num-tabular ${
                      stock.isPositive
                        ? 'text-tv-green bg-tv-greenLight'
                        : 'text-tv-red bg-tv-redLight'
                    }`}
                  >
                    {stock.changePct}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xl font-bold num-tabular">{stock.price}</span>
                  <span className="text-xs text-tv-gray font-medium">{stock.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* END: USStocksSection */}

        {/* BEGIN: CryptoSection */}
        <section id="crypto-section" className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <a
              className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-tv-dark hover:text-tv-blue cursor-pointer"
              href="#crypto"
              onClick={(e) => {
                e.preventDefault();
                setShowAllCryptoModal(true);
              }}
            >
              Crypto
              <svg
                className="w-5 h-5 text-tv-gray group-hover:text-tv-blue transition-transform group-hover:translate-x-0.5 stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </a>
            <a
              className="text-xs font-bold text-tv-blue hover:underline cursor-pointer"
              href="#all-crypto"
              onClick={(e) => {
                e.preventDefault();
                setShowAllCryptoModal(true);
              }}
            >
              View 1,000+ coins →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRYPTO_CARDS.map((coin) => (
              <div
                key={coin.id}
                onClick={() =>
                  setInspectSymbol({
                    symbol: coin.pair,
                    name: coin.name,
                    price: coin.price,
                    numericPrice: coin.numericPrice,
                    changePct: coin.changePct,
                    isPositive: coin.isPositive,
                    category: `Crypto · ${coin.marketCap}`,
                    range52W: coin.range52W,
                    volume: coin.volume24h,
                  })
                }
                className="border border-tv-border p-4 rounded-2xl bg-white hover:border-gray-400 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                      style={{
                        backgroundColor: coin.badgeBg,
                        color: coin.badgeTextColor,
                      }}
                    >
                      {coin.symbolIcon}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{coin.name}</div>
                      <div className="text-xs text-tv-gray font-semibold">{coin.pair}</div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-xs num-tabular ${
                      coin.isPositive
                        ? 'bg-tv-greenLight text-tv-green'
                        : 'bg-tv-redLight text-tv-red'
                    }`}
                  >
                    {coin.changePct}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-2xl font-black tracking-tight num-tabular">{coin.price}</div>
                  <div className="text-xs text-tv-gray">{coin.marketCap}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* END: CryptoSection */}
      </main>

      {/* BEGIN: MainFooter */}
      <footer className="border-t border-tv-border bg-white mt-16 pt-12 pb-10 text-tv-dark text-xs">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Top footer columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div>
              <h5 className="font-bold text-sm mb-3">Products</h5>
              <ul className="space-y-2 text-tv-gray">
                <li>
                  <a
                    className="hover:text-tv-dark cursor-pointer"
                    href="#supercharts"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Supercharts
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark cursor-pointer"
                    href="#pinescript"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Pine Script™
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark cursor-pointer"
                    href="#stock-screener"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSearchOpen(true);
                    }}
                  >
                    Stock Screener
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark cursor-pointer"
                    href="#crypto-screener"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllCryptoModal(true);
                    }}
                  >
                    Crypto Screener
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark cursor-pointer"
                    href="#economic-calendar"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('More');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Economic Calendar
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-3">Company</h5>
              <ul className="space-y-2 text-tv-gray">
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Markets');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAccountModal(true);
                    }}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#wall-of-love"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Community');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Wall of Love
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#careers"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAccountModal(true);
                    }}
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-3">Community</h5>
              <ul className="space-y-2 text-tv-gray">
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#refer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAccountModal(true);
                    }}
                  >
                    Refer a friend
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#ideas"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Community');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Ideas
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#scripts"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Community');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Scripts
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#rules"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Community');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    House rules
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#moderators"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Community');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Moderators
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-3">For business</h5>
              <ul className="space-y-2 text-tv-gray">
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#widgets"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWidgetModal(true);
                    }}
                  >
                    Widgets
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#advertising"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowWidgetModal(true);
                    }}
                  >
                    Advertising
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#charting-libraries"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Charting libraries
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#brokerage-integration"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Brokers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Brokerage integration
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-sm mb-3">Trading</h5>
              <ul className="space-y-2 text-tv-gray">
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#broker-awards"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('Brokers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Broker awards
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#platform-status"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav('More');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Platform status
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-tv-dark"
                    href="#help-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSearchOpen(true);
                    }}
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-tv-lightGray flex flex-col md:flex-row items-center justify-between gap-4 text-tv-gray">
            <div className="flex items-center gap-4">
              <span className="font-bold text-tv-dark text-sm">TradingView</span>
              <span>Look first / Then leap.</span>
              <span>© 2025 TradingView</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                className="hover:text-tv-dark"
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAccountModal(true);
                }}
              >
                Terms of use
              </a>
              <a
                className="hover:text-tv-dark"
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAccountModal(true);
                }}
              >
                Privacy policy
              </a>
              <a
                className="hover:text-tv-dark"
                href="#cookies"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAccountModal(true);
                }}
              >
                Cookies
              </a>
              <a
                className="hover:text-tv-dark"
                href="#security"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAccountModal(true);
                }}
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}

      {/* Interactive Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={(sym) => openInSupercharts(sym)}
      />

      {/* Symbol Quick Inspector Modal */}
      {inspectSymbol && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setInspectSymbol(null)}
        >
          <div
            className="bg-white border border-tv-border rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-tv-gray">{inspectSymbol.category}</div>
                <h3 className="text-xl font-extrabold text-tv-dark mt-0.5">
                  {inspectSymbol.name} ({inspectSymbol.symbol})
                </h3>
              </div>
              <button
                onClick={() => setInspectSymbol(null)}
                className="text-xs font-bold text-tv-gray hover:text-tv-dark px-2.5 py-1 rounded-lg bg-tv-lightGray cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-black num-tabular text-tv-dark">
                {inspectSymbol.price}
              </span>
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded num-tabular ${
                  inspectSymbol.isPositive
                    ? 'bg-tv-greenLight text-tv-green'
                    : 'bg-tv-redLight text-tv-red'
                }`}
              >
                {inspectSymbol.changePct}
              </span>
            </div>

            <div className="mt-5 pt-4 border-t border-tv-border space-y-2.5 text-xs">
              {inspectSymbol.range52W && (
                <div className="flex justify-between">
                  <span className="text-tv-gray">52-Week Range</span>
                  <span className="font-semibold text-tv-dark num-tabular">
                    {inspectSymbol.range52W}
                  </span>
                </div>
              )}
              {inspectSymbol.volume && (
                <div className="flex justify-between">
                  <span className="text-tv-gray">Trading Volume</span>
                  <span className="font-semibold text-tv-dark num-tabular">
                    {inspectSymbol.volume}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-tv-gray">Market Status</span>
                <span className="font-semibold text-tv-green">Real-Time Feed Active</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => openInSupercharts(inspectSymbol)}
                className="flex-1 bg-tv-blue hover:opacity-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
              >
                Open in Supercharts →
              </button>
              <button
                onClick={() => toggleWatchlist(inspectSymbol.symbol)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  watchlist.includes(inspectSymbol.symbol)
                    ? 'bg-tv-lightGray text-tv-dark border-tv-border'
                    : 'bg-white text-tv-dark border-tv-border hover:bg-tv-lightGray'
                }`}
              >
                {watchlist.includes(inspectSymbol.symbol) ? '★ Saved' : '☆ Watchlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All US Indices Directory Modal */}
      {showAllUSIndicesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowAllUSIndicesModal(false)}
        >
          <div
            className="bg-white border border-tv-border rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-tv-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-tv-dark">US Benchmark Indices</h3>
                <p className="text-xs text-tv-gray">Click any index to launch interactive Supercharts</p>
              </div>
              <button
                onClick={() => setShowAllUSIndicesModal(false)}
                className="text-xs font-bold text-tv-gray hover:text-tv-dark px-2.5 py-1 rounded-lg bg-tv-lightGray cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-tv-border">
              {ALL_US_INDICES.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    openInSupercharts({
                      symbol: item.ticker,
                      name: item.name,
                      price: item.price,
                      numericPrice: item.numericPrice,
                      changePct: item.change,
                      isPositive: item.isPositive,
                      category: item.category,
                      range52W: item.range52W,
                    })
                  }
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-tv-hoverBg transition cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-bold text-tv-dark">
                      {item.name}{' '}
                      <span className="text-xs font-normal text-tv-gray ml-1">{item.ticker}</span>
                    </div>
                    <div className="text-xs text-tv-gray">
                      {item.category} · 52W: {item.range52W}
                    </div>
                  </div>
                  <div className="text-right num-tabular">
                    <div className="text-sm font-bold text-tv-dark">{item.price}</div>
                    <div
                      className={`text-xs font-bold ${
                        item.isPositive ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Extended Crypto Screener Modal */}
      {showAllCryptoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowAllCryptoModal(false)}
        >
          <div
            className="bg-white border border-tv-border rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-tv-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-tv-dark">Cryptocurrency Market Screener</h3>
                <p className="text-xs text-tv-gray">Spot prices, 24h volume, and capitalization</p>
              </div>
              <button
                onClick={() => setShowAllCryptoModal(false)}
                className="text-xs font-bold text-tv-gray hover:text-tv-dark px-2.5 py-1 rounded-lg bg-tv-lightGray cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-tv-border">
              {EXTENDED_CRYPTO_LIST.map((coin) => (
                <div
                  key={coin.id}
                  onClick={() =>
                    openInSupercharts({
                      symbol: coin.pair,
                      name: coin.name,
                      price: coin.price,
                      numericPrice: coin.numericPrice,
                      changePct: coin.changePct,
                      isPositive: coin.isPositive,
                      category: 'Crypto Spot',
                      range52W: coin.range52W,
                    })
                  }
                  className="px-6 py-3.5 flex items-center justify-between hover:bg-tv-hoverBg transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
                      style={{ backgroundColor: coin.badgeBg, color: coin.badgeTextColor }}
                    >
                      {coin.symbolIcon}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-tv-dark">
                        {coin.name}{' '}
                        <span className="text-xs font-normal text-tv-gray ml-1">{coin.pair}</span>
                      </div>
                      <div className="text-xs text-tv-gray">
                        {coin.marketCap} · 24h Vol {coin.volume24h}
                      </div>
                    </div>
                  </div>
                  <div className="text-right num-tabular">
                    <div className="text-sm font-bold text-tv-dark">{coin.price}</div>
                    <div
                      className={`text-xs font-bold ${
                        coin.isPositive ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {coin.changePct}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Embeddable Widget Modal */}
      {showWidgetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowWidgetModal(false)}
        >
          <div
            className="bg-white border border-tv-border rounded-2xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-tv-dark">
                Embed {activeIndex.name} Overview Widget
              </h3>
              <button
                onClick={() => setShowWidgetModal(false)}
                className="text-xs font-bold text-tv-gray hover:text-tv-dark px-2.5 py-1 rounded-lg bg-tv-lightGray cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-tv-gray mb-4">
              Copy and paste this responsive HTML snippet to embed the live {activeIndex.ticker} mini-chart on your site or dashboard.
            </p>
            <pre className="bg-tv-lightGray p-3.5 rounded-xl text-[11px] font-mono text-tv-dark overflow-x-auto border border-tv-border">
{`<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
  {
    "symbol": "${activeIndex.ticker}",
    "width": "100%",
    "height": 220,
    "locale": "${locale.toLowerCase()}",
    "dateRange": "${selectedTimeframe}",
    "colorTheme": "light",
    "isTransparent": false
  }
  </script>
</div>
<!-- TradingView Widget END -->`}
            </pre>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `<div class="tradingview-widget-container" data-symbol="${activeIndex.ticker}" data-range="${selectedTimeframe}"></div>`
                  );
                  setWidgetCopied(true);
                  setTimeout(() => setWidgetCopied(false), 2000);
                }}
                className="bg-tv-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-95 transition cursor-pointer"
              >
                {widgetCopied ? '✓ Snippet Copied' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account & Watchlist Modal */}
      {showAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setShowAccountModal(false)}
        >
          <div
            className="bg-white border border-tv-border rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-tv-dark">Personal Watchlist &amp; Workspace</h3>
                <p className="text-xs text-tv-gray">Synced across Markets Overview and Supercharts</p>
              </div>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-xs font-bold text-tv-gray hover:text-tv-dark px-2.5 py-1 rounded-lg bg-tv-lightGray cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="divide-y divide-tv-border border border-tv-border rounded-xl mb-5 max-h-60 overflow-y-auto">
              {watchlist.length === 0 ? (
                <div className="p-4 text-center text-xs text-tv-gray">
                  Your watchlist is empty. Click any asset to add it.
                </div>
              ) : (
                watchlist.map((sym) => (
                  <div
                    key={sym}
                    className="px-3.5 py-2.5 flex items-center justify-between hover:bg-tv-hoverBg"
                  >
                    <button
                      onClick={() => {
                        setShowAccountModal(false);
                        openInSupercharts({
                          symbol: sym,
                          name: sym,
                          price: '$148.88',
                          numericPrice: 148.88,
                          changePct: '+1.25%',
                          isPositive: true,
                          category: 'Watchlist Symbol',
                        });
                      }}
                      className="text-xs font-bold text-tv-dark hover:text-tv-blue cursor-pointer"
                    >
                      {sym}
                    </button>
                    <button
                      onClick={() => toggleWatchlist(sym)}
                      className="text-xs text-tv-gray hover:text-tv-red cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setActiveNav('Products');
                }}
                className="flex-1 gradient-btn text-white py-2.5 px-4 rounded-full text-xs font-bold cursor-pointer"
              >
                Launch Supercharts Workspace
              </button>
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  setIsSearchOpen(true);
                }}
                className="py-2.5 px-4 rounded-full text-xs font-bold border border-tv-border hover:bg-tv-lightGray transition cursor-pointer"
              >
                + Add Symbol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

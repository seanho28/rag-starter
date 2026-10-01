export type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type StockSubTab = 'Most active' | 'Top gainers' | 'Top losers' | 'Earnings this week';

export interface ChartDataPoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: string;
}

export interface IndexPillItem {
  id: string;
  badgeText: string;
  badgeColor: string;
  name: string;
  ticker: string;
  price: string;
  numericPrice: number;
  change: string;
  changeAbs: string;
  isPositive: boolean;
  description: string;
  svgPaths: Record<Timeframe, { area: string; line: string; badge: string; isPositive: boolean }>;
  series: Record<Timeframe, ChartDataPoint[]>;
}

export interface BenchmarkItem {
  id: string;
  name: string;
  ticker: string;
  price: string;
  numericPrice: number;
  change: string;
  changeAbs: string;
  isPositive: boolean;
  range52W: string;
  category: string;
}

export interface WorldIndexItem {
  id: string;
  countryCode: string;
  badgeBg: string;
  badgeText: string;
  name: string;
  ticker: string;
  region: string;
  last: string;
  numericLast: number;
  chg: string;
  numericChg: number;
  chgPct: string;
  numericChgPct: number;
  isPositive: boolean;
  range52W: string;
}

export interface StockCardItem {
  id: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor?: string;
  ticker: string;
  name: string;
  changePct: string;
  numericChangePct: number;
  isPositive: boolean;
  price: string;
  numericPrice: number;
  volume: string;
  marketCap: string;
  peRatio: string;
  sector: string;
  range52W: string;
}

export interface CryptoCardItem {
  id: string;
  symbolIcon: string;
  badgeBg: string;
  badgeTextColor: string;
  name: string;
  pair: string;
  changePct: string;
  numericChangePct: number;
  isPositive: boolean;
  price: string;
  numericPrice: number;
  marketCap: string;
  volume24h: string;
  range52W: string;
}

export const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const MAIN_INDICES: IndexPillItem[] = [
  {
    id: 'SPX',
    badgeText: '500',
    badgeColor: '#e91e63',
    name: 'S&P 500',
    ticker: 'INDEX:SPX',
    price: '5,983.99',
    numericPrice: 5983.99,
    change: '+0.42%',
    changeAbs: '+24.81',
    isPositive: true,
    description: 'Real-time benchmark index tracker for leading US equities',
    svgPaths: {
      '1D': {
        area: 'M 0,160 Q 50,140 100,120 T 200,130 T 300,95 T 400,60 T 500,45 T 600,20 L 600,200 L 0,200 Z',
        line: 'M 0,160 Q 50,140 100,120 T 200,130 T 300,95 T 400,60 T 500,45 T 600,20',
        badge: '5,983.99 +24.81 (+0.42%)',
        isPositive: true,
      },
      '5D': {
        area: 'M 0,150 Q 60,155 120,125 T 240,105 T 360,115 T 480,55 T 600,28 L 600,200 L 0,200 Z',
        line: 'M 0,150 Q 60,155 120,125 T 240,105 T 360,115 T 480,55 T 600,28',
        badge: '5,983.99 +88.14 (+1.49%)',
        isPositive: true,
      },
      '1M': {
        area: 'M 0,170 Q 75,145 150,135 T 300,90 T 450,68 T 600,22 L 600,200 L 0,200 Z',
        line: 'M 0,170 Q 75,145 150,135 T 300,90 T 450,68 T 600,22',
        badge: '5,983.99 +214.60 (+3.72%)',
        isPositive: true,
      },
      '6M': {
        area: 'M 0,175 Q 80,150 160,120 T 320,100 T 460,50 T 600,18 L 600,200 L 0,200 Z',
        line: 'M 0,175 Q 80,150 160,120 T 320,100 T 460,50 T 600,18',
        badge: '5,983.99 +682.40 (+12.87%)',
        isPositive: true,
      },
      '1Y': {
        area: 'M 0,182 Q 90,160 180,130 T 360,85 T 480,42 T 600,16 L 600,200 L 0,200 Z',
        line: 'M 0,182 Q 90,160 180,130 T 360,85 T 480,42 T 600,16',
        badge: '5,983.99 +1,219.80 (+25.60%)',
        isPositive: true,
      },
      ALL: {
        area: 'M 0,190 Q 100,178 200,150 T 380,95 T 500,45 T 600,15 L 600,200 L 0,200 Z',
        line: 'M 0,190 Q 100,178 200,150 T 380,95 T 500,45 T 600,15',
        badge: '5,983.99 +4,612.10 (+336.2%)',
        isPositive: true,
      },
    },
    series: {
      '1D': [
        { time: '09:30', price: 5959.18, open: 5955.0, high: 5963.2, low: 5951.4, volume: '142M' },
        { time: '10:30', price: 5966.45, open: 5959.2, high: 5969.8, low: 5958.0, volume: '198M' },
        { time: '11:30', price: 5963.12, open: 5966.5, high: 5968.0, low: 5960.1, volume: '164M' },
        { time: '12:30', price: 5971.80, open: 5963.1, high: 5974.5, low: 5962.5, volume: '151M' },
        { time: '13:30', price: 5977.90, open: 5971.8, high: 5980.1, low: 5970.2, volume: '176M' },
        { time: '14:30', price: 5980.35, open: 5977.9, high: 5982.4, low: 5976.0, volume: '210M' },
        { time: '15:30', price: 5983.99, open: 5980.3, high: 5986.0, low: 5979.1, volume: '289M' },
      ],
      '5D': [
        { time: 'Mon', price: 5895.85, open: 5888.0, high: 5905.2, low: 5882.1, volume: '1.8B' },
        { time: 'Tue', price: 5918.40, open: 5896.0, high: 5925.0, low: 5892.4, volume: '2.1B' },
        { time: 'Wed', price: 5941.20, open: 5918.4, high: 5950.1, low: 5915.0, volume: '1.9B' },
        { time: 'Thu', price: 5959.18, open: 5941.2, high: 5964.8, low: 5938.0, volume: '2.0B' },
        { time: 'Fri', price: 5983.99, open: 5959.2, high: 5986.0, low: 5955.0, volume: '2.3B' },
      ],
      '1M': [
        { time: 'W1', price: 5769.39, open: 5750.0, high: 5785.0, low: 5740.0, volume: '8.9B' },
        { time: 'W2', price: 5832.10, open: 5769.4, high: 5845.0, low: 5765.0, volume: '9.4B' },
        { time: 'W3', price: 5904.75, open: 5832.1, high: 5915.0, low: 5828.0, volume: '9.1B' },
        { time: 'W4', price: 5983.99, open: 5904.8, high: 5986.0, low: 5895.0, volume: '10.2B' },
      ],
      '6M': [
        { time: 'Apr', price: 5301.59, open: 5280.0, high: 5340.0, low: 5250.0, volume: '38B' },
        { time: 'May', price: 5450.20, open: 5301.6, high: 5480.0, low: 5295.0, volume: '41B' },
        { time: 'Jun', price: 5588.90, open: 5450.2, high: 5610.0, low: 5440.0, volume: '39B' },
        { time: 'Jul', price: 5667.40, open: 5588.9, high: 5690.0, low: 5570.0, volume: '42B' },
        { time: 'Aug', price: 5812.15, open: 5667.4, high: 5830.0, low: 5650.0, volume: '40B' },
        { time: 'Sep', price: 5983.99, open: 5812.2, high: 5986.0, low: 5800.0, volume: '44B' },
      ],
      '1Y': [
        { time: 'Q4', price: 4764.19, open: 4720.0, high: 4800.0, low: 4700.0, volume: '120B' },
        { time: 'Q1', price: 5254.35, open: 4764.2, high: 5280.0, low: 4750.0, volume: '132B' },
        { time: 'Q2', price: 5560.80, open: 5254.4, high: 5590.0, low: 5240.0, volume: '128B' },
        { time: 'Q3', price: 5983.99, open: 5560.8, high: 5986.0, low: 5545.0, volume: '140B' },
      ],
      ALL: [
        { time: '2021', price: 4766.18, open: 3756.0, high: 4800.0, low: 3700.0, volume: '490B' },
        { time: '2022', price: 3839.50, open: 4766.2, high: 4818.0, low: 3491.0, volume: '530B' },
        { time: '2023', price: 4769.83, open: 3839.5, high: 4793.0, low: 3808.0, volume: '510B' },
        { time: '2024', price: 5983.99, open: 4769.8, high: 5986.0, low: 4682.0, volume: '545B' },
      ],
    },
  },
  {
    id: 'NDX',
    badgeText: '100',
    badgeColor: '#0091ff',
    name: 'Nasdaq 100',
    ticker: 'INDEX:NDX',
    price: '20,891.24',
    numericPrice: 20891.24,
    change: '+0.68%',
    changeAbs: '+141.12',
    isPositive: true,
    description: 'Real-time benchmark index tracker for top 100 non-financial Nasdaq companies',
    svgPaths: {
      '1D': {
        area: 'M 0,168 Q 55,145 110,115 T 220,120 T 330,80 T 450,48 T 600,18 L 600,200 L 0,200 Z',
        line: 'M 0,168 Q 55,145 110,115 T 220,120 T 330,80 T 450,48 T 600,18',
        badge: '20,891.24 +141.12 (+0.68%)',
        isPositive: true,
      },
      '5D': {
        area: 'M 0,160 Q 70,140 140,128 T 280,95 T 420,65 T 600,20 L 600,200 L 0,200 Z',
        line: 'M 0,160 Q 70,140 140,128 T 280,95 T 420,65 T 600,20',
        badge: '20,891.24 +438.90 (+2.15%)',
        isPositive: true,
      },
      '1M': {
        area: 'M 0,175 Q 85,155 170,120 T 340,88 T 480,52 T 600,20 L 600,200 L 0,200 Z',
        line: 'M 0,175 Q 85,155 170,120 T 340,88 T 480,52 T 600,20',
        badge: '20,891.24 +980.45 (+4.92%)',
        isPositive: true,
      },
      '6M': {
        area: 'M 0,180 Q 95,150 190,115 T 380,80 T 500,40 T 600,15 L 600,200 L 0,200 Z',
        line: 'M 0,180 Q 95,150 190,115 T 380,80 T 500,40 T 600,15',
        badge: '20,891.24 +2,840.10 (+15.73%)',
        isPositive: true,
      },
      '1Y': {
        area: 'M 0,185 Q 100,160 200,125 T 400,75 T 510,35 T 600,14 L 600,200 L 0,200 Z',
        line: 'M 0,185 Q 100,160 200,125 T 400,75 T 510,35 T 600,14',
        badge: '20,891.24 +5,120.80 (+32.47%)',
        isPositive: true,
      },
      ALL: {
        area: 'M 0,192 Q 110,175 220,145 T 410,90 T 520,40 T 600,12 L 600,200 L 0,200 Z',
        line: 'M 0,192 Q 110,175 220,145 T 410,90 T 520,40 T 600,12',
        badge: '20,891.24 +16,410.00 (+366.2%)',
        isPositive: true,
      },
    },
    series: {
      '1D': [
        { time: '09:30', price: 20750.12, open: 20740.0, high: 20780.0, low: 20725.0, volume: '98M' },
        { time: '10:30', price: 20792.40, open: 20750.1, high: 20810.0, low: 20748.0, volume: '112M' },
        { time: '11:30', price: 20815.60, open: 20792.4, high: 20830.0, low: 20785.0, volume: '94M' },
        { time: '12:30', price: 20838.90, open: 20815.6, high: 20850.0, low: 20810.0, volume: '88M' },
        { time: '13:30', price: 20860.15, open: 20838.9, high: 20875.0, low: 20832.0, volume: '105M' },
        { time: '14:30', price: 20874.50, open: 20860.2, high: 20885.0, low: 20855.0, volume: '124M' },
        { time: '15:30', price: 20891.24, open: 20874.5, high: 20898.0, low: 20870.0, volume: '165M' },
      ],
      '5D': [
        { time: 'Mon', price: 20452.34, open: 20410.0, high: 20490.0, low: 20395.0, volume: '910M' },
        { time: 'Tue', price: 20580.10, open: 20452.3, high: 20610.0, low: 20440.0, volume: '945M' },
        { time: 'Wed', price: 20690.45, open: 20580.1, high: 20720.0, low: 20560.0, volume: '890M' },
        { time: 'Thu', price: 20750.12, open: 20690.5, high: 20780.0, low: 20675.0, volume: '920M' },
        { time: 'Fri', price: 20891.24, open: 20750.1, high: 20898.0, low: 20740.0, volume: '1.05B' },
      ],
      '1M': [
        { time: 'W1', price: 19910.79, open: 19850.0, high: 19980.0, low: 19810.0, volume: '4.1B' },
        { time: 'W2', price: 20240.30, open: 19910.8, high: 20300.0, low: 19900.0, volume: '4.4B' },
        { time: 'W3', price: 20560.80, open: 20240.3, high: 20610.0, low: 20210.0, volume: '4.3B' },
        { time: 'W4', price: 20891.24, open: 20560.8, high: 20898.0, low: 20540.0, volume: '4.8B' },
      ],
      '6M': [
        { time: 'Apr', price: 18051.14, open: 17990.0, high: 18200.0, low: 17850.0, volume: '18B' },
        { time: 'May', price: 18620.40, open: 18051.1, high: 18750.0, low: 18010.0, volume: '19B' },
        { time: 'Jun', price: 19210.80, open: 18620.4, high: 19350.0, low: 18590.0, volume: '20B' },
        { time: 'Jul', price: 19780.20, open: 19210.8, high: 19900.0, low: 19150.0, volume: '21B' },
        { time: 'Aug', price: 20310.50, open: 19780.2, high: 20450.0, low: 19720.0, volume: '19B' },
        { time: 'Sep', price: 20891.24, open: 20310.5, high: 20898.0, low: 20280.0, volume: '22B' },
      ],
      '1Y': [
        { time: 'Q4', price: 15770.44, open: 15600.0, high: 16100.0, low: 15500.0, volume: '56B' },
        { time: 'Q1', price: 18254.69, open: 15770.4, high: 18400.0, low: 15700.0, volume: '61B' },
        { time: 'Q2', price: 19682.87, open: 18254.7, high: 19800.0, low: 18190.0, volume: '59B' },
        { time: 'Q3', price: 20891.24, open: 19682.9, high: 20898.0, low: 19600.0, volume: '64B' },
      ],
      ALL: [
        { time: '2021', price: 16320.08, open: 12888.0, high: 16573.0, low: 12200.0, volume: '210B' },
        { time: '2022', price: 10939.76, open: 16320.1, high: 16500.0, low: 10440.0, volume: '240B' },
        { time: '2023', price: 16825.93, open: 10939.8, high: 16900.0, low: 10800.0, volume: '230B' },
        { time: '2024', price: 20891.24, open: 16825.9, high: 20898.0, low: 16200.0, volume: '255B' },
      ],
    },
  },
  {
    id: 'DJI',
    badgeText: '30',
    badgeColor: '#00bcd4',
    name: 'Dow 30',
    ticker: 'INDEX:DJI',
    price: '43,729.34',
    numericPrice: 43729.34,
    change: '-0.15%',
    changeAbs: '-65.72',
    isPositive: false,
    description: 'Price-weighted measurement stock market index of 30 prominent US companies',
    svgPaths: {
      '1D': {
        area: 'M 0,55 Q 60,65 120,82 T 240,75 T 360,115 T 480,135 T 600,152 L 600,200 L 0,200 Z',
        line: 'M 0,55 Q 60,65 120,82 T 240,75 T 360,115 T 480,135 T 600,152',
        badge: '43,729.34 -65.72 (-0.15%)',
        isPositive: false,
      },
      '5D': {
        area: 'M 0,145 Q 70,135 140,115 T 280,95 T 420,70 T 600,35 L 600,200 L 0,200 Z',
        line: 'M 0,145 Q 70,135 140,115 T 280,95 T 420,70 T 600,35',
        badge: '43,729.34 +312.40 (+0.72%)',
        isPositive: true,
      },
      '1M': {
        area: 'M 0,160 Q 80,145 160,125 T 320,90 T 460,58 T 600,28 L 600,200 L 0,200 Z',
        line: 'M 0,160 Q 80,145 160,125 T 320,90 T 460,58 T 600,28',
        badge: '43,729.34 +1,105.20 (+2.59%)',
        isPositive: true,
      },
      '6M': {
        area: 'M 0,170 Q 90,150 180,125 T 360,85 T 480,50 T 600,22 L 600,200 L 0,200 Z',
        line: 'M 0,170 Q 90,150 180,125 T 360,85 T 480,50 T 600,22',
        badge: '43,729.34 +3,920.15 (+9.85%)',
        isPositive: true,
      },
      '1Y': {
        area: 'M 0,178 Q 100,155 200,130 T 400,80 T 500,45 T 600,20 L 600,200 L 0,200 Z',
        line: 'M 0,178 Q 100,155 200,130 T 400,80 T 500,45 T 600,20',
        badge: '43,729.34 +7,410.50 (+20.40%)',
        isPositive: true,
      },
      ALL: {
        area: 'M 0,188 Q 110,170 220,140 T 410,95 T 510,48 T 600,18 L 600,200 L 0,200 Z',
        line: 'M 0,188 Q 110,170 220,140 T 410,95 T 510,48 T 600,18',
        badge: '43,729.34 +28,190.00 (+181.4%)',
        isPositive: true,
      },
    },
    series: {
      '1D': [
        { time: '09:30', price: 43795.06, open: 43800.0, high: 43825.0, low: 43780.0, volume: '42M' },
        { time: '10:30', price: 43782.10, open: 43795.1, high: 43805.0, low: 43770.0, volume: '48M' },
        { time: '11:30', price: 43788.40, open: 43782.1, high: 43798.0, low: 43775.0, volume: '39M' },
        { time: '12:30', price: 43760.20, open: 43788.4, high: 43790.0, low: 43750.0, volume: '41M' },
        { time: '13:30', price: 43748.90, open: 43760.2, high: 43765.0, low: 43740.0, volume: '46M' },
        { time: '14:30', price: 43739.15, open: 43748.9, high: 43755.0, low: 43730.0, volume: '55M' },
        { time: '15:30', price: 43729.34, open: 43739.2, high: 43745.0, low: 43720.0, volume: '78M' },
      ],
      '5D': [
        { time: 'Mon', price: 43416.94, open: 43390.0, high: 43480.0, low: 43350.0, volume: '310M' },
        { time: 'Tue', price: 43520.40, open: 43416.9, high: 43580.0, low: 43400.0, volume: '330M' },
        { time: 'Wed', price: 43690.10, open: 43520.4, high: 43740.0, low: 43510.0, volume: '305M' },
        { time: 'Thu', price: 43795.06, open: 43690.1, high: 43830.0, low: 43680.0, volume: '325M' },
        { time: 'Fri', price: 43729.34, open: 43795.1, high: 43825.0, low: 43720.0, volume: '350M' },
      ],
      '1M': [
        { time: 'W1', price: 42624.14, open: 42550.0, high: 42750.0, low: 42490.0, volume: '1.4B' },
        { time: 'W2', price: 42980.50, open: 42624.1, high: 43100.0, low: 42600.0, volume: '1.5B' },
        { time: 'W3', price: 43410.20, open: 42980.5, high: 43520.0, low: 42950.0, volume: '1.4B' },
        { time: 'W4', price: 43729.34, open: 43410.2, high: 43830.0, low: 43390.0, volume: '1.6B' },
      ],
      '6M': [
        { time: 'Apr', price: 39809.19, open: 39700.0, high: 40100.0, low: 39500.0, volume: '6.2B' },
        { time: 'May', price: 40450.80, open: 39809.2, high: 40600.0, low: 39780.0, volume: '6.5B' },
        { time: 'Jun', price: 41120.40, open: 40450.8, high: 41300.0, low: 40400.0, volume: '6.1B' },
        { time: 'Jul', price: 41980.60, open: 41120.4, high: 42150.0, low: 41050.0, volume: '6.4B' },
        { time: 'Aug', price: 42890.10, open: 41980.6, high: 43050.0, low: 41900.0, volume: '6.3B' },
        { time: 'Sep', price: 43729.34, open: 42890.1, high: 43830.0, low: 42800.0, volume: '6.8B' },
      ],
      '1Y': [
        { time: 'Q4', price: 36318.84, open: 36100.0, high: 36600.0, low: 36000.0, volume: '19B' },
        { time: 'Q1', price: 39807.37, open: 36318.8, high: 40000.0, low: 36250.0, volume: '21B' },
        { time: 'Q2', price: 41563.08, open: 39807.4, high: 41750.0, low: 39700.0, volume: '20B' },
        { time: 'Q3', price: 43729.34, open: 41563.1, high: 43830.0, low: 41500.0, volume: '22B' },
      ],
      ALL: [
        { time: '2021', price: 36338.30, open: 30606.0, high: 36679.0, low: 29856.0, volume: '78B' },
        { time: '2022', price: 33147.25, open: 36338.3, high: 36952.0, low: 28660.0, volume: '85B' },
        { time: '2023', price: 37689.54, open: 33147.3, high: 37778.0, low: 31429.0, volume: '81B' },
        { time: '2024', price: 43729.34, open: 37689.5, high: 43830.0, low: 37122.0, volume: '88B' },
      ],
    },
  },
];

export const MAJOR_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'RUT',
    name: 'Russell 2000',
    ticker: 'RUT',
    price: '2,328.60',
    numericPrice: 2328.6,
    change: '+1.24%',
    changeAbs: '+28.52',
    isPositive: true,
    range52W: '1,633 - 2,442',
    category: 'Small Cap Index',
  },
  {
    id: 'IXIC',
    name: 'Nasdaq Composite',
    ticker: 'IXIC',
    price: '19,281.40',
    numericPrice: 19281.4,
    change: '+0.75%',
    numericPriceChange: 143.5,
    changeAbs: '+143.52',
    isPositive: true,
    range52W: '14,058 - 19,380',
    category: 'Broad Composite',
  } as BenchmarkItem & { numericPriceChange?: number },
  {
    id: 'VIX',
    name: 'Volatility Index',
    ticker: 'VIX',
    price: '14.92',
    numericPrice: 14.92,
    change: '-4.29%',
    changeAbs: '-0.67',
    isPositive: false,
    range52W: '11.52 - 38.57',
    category: 'Implied Volatility',
  },
  {
    id: 'DXY',
    name: 'US Dollar Index',
    ticker: 'DXY',
    price: '105.42',
    numericPrice: 105.42,
    change: '+0.18%',
    changeAbs: '+0.19',
    isPositive: true,
    range52W: '100.15 - 107.34',
    category: 'Currency Basket',
  },
];

export const ALL_US_INDICES: BenchmarkItem[] = [
  ...MAJOR_BENCHMARKS,
  {
    id: 'SPX',
    name: 'S&P 500',
    ticker: 'SPX',
    price: '5,983.99',
    numericPrice: 5983.99,
    change: '+0.42%',
    changeAbs: '+24.81',
    isPositive: true,
    range52W: '4,764 - 6,017',
    category: 'Large Cap Benchmark',
  },
  {
    id: 'NDX',
    name: 'Nasdaq 100',
    ticker: 'NDX',
    price: '20,891.24',
    numericPrice: 20891.24,
    change: '+0.68%',
    changeAbs: '+141.12',
    isPositive: true,
    range52W: '15,770 - 21,182',
    category: 'Tech & Growth',
  },
  {
    id: 'DJI',
    name: 'Dow Jones Industrial Average',
    ticker: 'DJI',
    price: '43,729.34',
    numericPrice: 43729.34,
    change: '-0.15%',
    changeAbs: '-65.72',
    isPositive: false,
    range52W: '36,318 - 44,486',
    category: 'Blue Chip 30',
  },
  {
    id: 'MID',
    name: 'S&P 400 MidCap',
    ticker: 'MID',
    price: '3,194.85',
    numericPrice: 3194.85,
    change: '+0.89%',
    changeAbs: '+28.18',
    isPositive: true,
    range52W: '2,580 - 3,260',
    category: 'Mid Cap Equities',
  },
  {
    id: 'SML',
    name: 'S&P 600 SmallCap',
    ticker: 'SML',
    price: '1,482.10',
    numericPrice: 1482.1,
    change: '+1.12%',
    changeAbs: '+16.41',
    isPositive: true,
    range52W: '1,180 - 1,520',
    category: 'Small Cap Equities',
  },
  {
    id: 'SOX',
    name: 'PHLX Semiconductor',
    ticker: 'SOX',
    price: '5,318.42',
    numericPrice: 5318.42,
    change: '+2.14%',
    changeAbs: '+111.42',
    isPositive: true,
    range52W: '3,890 - 5,931',
    category: 'Sector Index',
  },
  {
    id: 'BKX',
    name: 'KBW Nasdaq Bank Index',
    ticker: 'BKX',
    price: '132.74',
    numericPrice: 132.74,
    change: '+0.54%',
    changeAbs: '+0.71',
    isPositive: true,
    range52W: '94.10 - 138.20',
    category: 'Financial Sector',
  },
  {
    id: 'NYA',
    name: 'NYSE Composite',
    ticker: 'NYA',
    price: '19,842.15',
    numericPrice: 19842.15,
    change: '+0.31%',
    changeAbs: '+61.32',
    isPositive: true,
    range52W: '16,420 - 20,115',
    category: 'Broad Composite',
  },
];

export const WORLD_INDICES: WorldIndexItem[] = [
  {
    id: 'NI225',
    countryCode: 'JP',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-600',
    name: 'Nikkei 225',
    ticker: 'NI225',
    region: 'Japan',
    last: '39,381.41',
    numericLast: 39381.41,
    chg: '+118.96',
    numericChg: 118.96,
    chgPct: '+0.30%',
    numericChgPct: 0.3,
    isPositive: true,
    range52W: '30,538 - 42,426',
  },
  {
    id: 'UKX',
    countryCode: 'UK',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    name: 'FTSE 100',
    ticker: 'UKX',
    region: 'United Kingdom',
    last: '8,140.74',
    numericLast: 8140.74,
    chg: '-26.50',
    numericChg: -26.5,
    chgPct: '-0.32%',
    numericChgPct: -0.32,
    isPositive: false,
    range52W: '7,384 - 8,474',
  },
  {
    id: 'DAX',
    countryCode: 'DE',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-800',
    name: 'DAX 40',
    ticker: 'DAX',
    region: 'Germany',
    last: '19,254.97',
    numericLast: 19254.97,
    chg: '-142.12',
    numericChg: -142.12,
    chgPct: '-0.73%',
    numericChgPct: -0.73,
    isPositive: false,
    range52W: '15,620 - 19,674',
  },
  {
    id: 'PX1',
    countryCode: 'FR',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    name: 'CAC 40',
    ticker: 'PX1',
    region: 'France',
    last: '7,338.68',
    numericLast: 7338.68,
    chg: '-70.40',
    numericChg: -70.4,
    chgPct: '-0.95%',
    numericChgPct: -0.95,
    isPositive: false,
    range52W: '7,029 - 8,259',
  },
  {
    id: 'HSI',
    countryCode: 'HK',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    name: 'Hang Seng',
    ticker: 'HSI',
    region: 'Hong Kong',
    last: '20,728.19',
    numericLast: 20728.19,
    chg: '+415.70',
    numericChg: 415.7,
    chgPct: '+2.04%',
    numericChgPct: 2.04,
    isPositive: true,
    range52W: '14,794 - 23,241',
  },
];

export const US_STOCKS_BY_TAB: Record<StockSubTab, StockCardItem[]> = {
  'Most active': [
    {
      id: 'NVDA',
      badgeText: 'NV',
      badgeBg: '#76b900',
      ticker: 'NVDA',
      name: 'NVIDIA Corp',
      changePct: '+3.18%',
      numericChangePct: 3.18,
      isPositive: true,
      price: '$148.88',
      numericPrice: 148.88,
      volume: 'Vol 65.4M',
      marketCap: '$3.65T',
      peRatio: '56.4',
      sector: 'Semiconductors',
      range52W: '$47.32 - $149.76',
    },
    {
      id: 'AAPL',
      badgeText: 'AAPL',
      badgeBg: '#000000',
      ticker: 'AAPL',
      name: 'Apple Inc',
      changePct: '+0.82%',
      numericChangePct: 0.82,
      isPositive: true,
      price: '$227.48',
      numericPrice: 227.48,
      volume: 'Vol 41.2M',
      marketCap: '$3.46T',
      peRatio: '34.8',
      sector: 'Consumer Tech',
      range52W: '$164.08 - $237.23',
    },
    {
      id: 'TSLA',
      badgeText: 'TSLA',
      badgeBg: '#e82127',
      ticker: 'TSLA',
      name: 'Tesla Inc',
      changePct: '+4.90%',
      numericChangePct: 4.9,
      isPositive: true,
      price: '$321.22',
      numericPrice: 321.22,
      volume: 'Vol 78.9M',
      marketCap: '$1.02T',
      peRatio: '87.2',
      sector: 'Automotive & Energy',
      range52W: '$138.80 - $358.64',
    },
    {
      id: 'MSFT',
      badgeText: 'MSFT',
      badgeBg: '#00a4ef',
      ticker: 'MSFT',
      name: 'Microsoft Corp',
      changePct: '-0.34%',
      numericChangePct: -0.34,
      isPositive: false,
      price: '$422.54',
      numericPrice: 422.54,
      volume: 'Vol 22.1M',
      marketCap: '$3.14T',
      peRatio: '35.1',
      sector: 'Cloud & Software',
      range52W: '$366.50 - $468.35',
    },
  ],
  'Top gainers': [
    {
      id: 'PLTR',
      badgeText: 'PLTR',
      badgeBg: '#101113',
      ticker: 'PLTR',
      name: 'Palantir Technologies',
      changePct: '+8.42%',
      numericChangePct: 8.42,
      isPositive: true,
      price: '$64.18',
      numericPrice: 64.18,
      volume: 'Vol 92.1M',
      marketCap: '$143.2B',
      peRatio: '162.0',
      sector: 'Enterprise Software',
      range52W: '$15.66 - $66.00',
    },
    {
      id: 'TSLA',
      badgeText: 'TSLA',
      badgeBg: '#e82127',
      ticker: 'TSLA',
      name: 'Tesla Inc',
      changePct: '+4.90%',
      numericChangePct: 4.9,
      isPositive: true,
      price: '$321.22',
      numericPrice: 321.22,
      volume: 'Vol 78.9M',
      marketCap: '$1.02T',
      peRatio: '87.2',
      sector: 'Automotive & Energy',
      range52W: '$138.80 - $358.64',
    },
    {
      id: 'COIN',
      badgeText: 'COIN',
      badgeBg: '#0052ff',
      ticker: 'COIN',
      name: 'Coinbase Global',
      changePct: '+6.15%',
      numericChangePct: 6.15,
      isPositive: true,
      price: '$298.40',
      numericPrice: 298.4,
      volume: 'Vol 34.8M',
      marketCap: '$74.5B',
      peRatio: '46.9',
      sector: 'Financial Exchanges',
      range52W: '$114.51 - $334.86',
    },
    {
      id: 'NVDA',
      badgeText: 'NV',
      badgeBg: '#76b900',
      ticker: 'NVDA',
      name: 'NVIDIA Corp',
      changePct: '+3.18%',
      numericChangePct: 3.18,
      isPositive: true,
      price: '$148.88',
      numericPrice: 148.88,
      volume: 'Vol 65.4M',
      marketCap: '$3.65T',
      peRatio: '56.4',
      sector: 'Semiconductors',
      range52W: '$47.32 - $149.76',
    },
  ],
  'Top losers': [
    {
      id: 'LLY',
      badgeText: 'LLY',
      badgeBg: '#d52b1e',
      ticker: 'LLY',
      name: 'Eli Lilly & Co',
      changePct: '-3.12%',
      numericChangePct: -3.12,
      isPositive: false,
      price: '$792.10',
      numericPrice: 792.1,
      volume: 'Vol 8.4M',
      marketCap: '$752.8B',
      peRatio: '68.4',
      sector: 'Pharmaceuticals',
      range52W: '$579.00 - $972.53',
    },
    {
      id: 'SMCI',
      badgeText: 'SMCI',
      badgeBg: '#005691',
      ticker: 'SMCI',
      name: 'Super Micro Computer',
      changePct: '-4.85%',
      numericChangePct: -4.85,
      isPositive: false,
      price: '$24.60',
      numericPrice: 24.6,
      volume: 'Vol 58.3M',
      marketCap: '$14.4B',
      peRatio: '12.8',
      sector: 'Computer Hardware',
      range52W: '$17.25 - $122.90',
    },
    {
      id: 'INTC',
      badgeText: 'INTC',
      badgeBg: '#0071c5',
      ticker: 'INTC',
      name: 'Intel Corp',
      changePct: '-2.14%',
      numericChangePct: -2.14,
      isPositive: false,
      price: '$24.35',
      numericPrice: 24.35,
      volume: 'Vol 51.0M',
      marketCap: '$104.2B',
      peRatio: 'N/A',
      sector: 'Semiconductors',
      range52W: '$18.51 - $51.28',
    },
    {
      id: 'MSFT',
      badgeText: 'MSFT',
      badgeBg: '#00a4ef',
      ticker: 'MSFT',
      name: 'Microsoft Corp',
      changePct: '-0.34%',
      numericChangePct: -0.34,
      isPositive: false,
      price: '$422.54',
      numericPrice: 422.54,
      volume: 'Vol 22.1M',
      marketCap: '$3.14T',
      peRatio: '35.1',
      sector: 'Cloud & Software',
      range52W: '$366.50 - $468.35',
    },
  ],
  'Earnings this week': [
    {
      id: 'CRM',
      badgeText: 'CRM',
      badgeBg: '#00a1e0',
      ticker: 'CRM',
      name: 'Salesforce Inc',
      changePct: '+1.94%',
      numericChangePct: 1.94,
      isPositive: true,
      price: '$338.90',
      numericPrice: 338.9,
      volume: 'Vol 9.2M',
      marketCap: '$324.1B',
      peRatio: '44.2',
      sector: 'Enterprise Cloud',
      range52W: '$212.00 - $348.86',
    },
    {
      id: 'AVGO',
      badgeText: 'AVGO',
      badgeBg: '#cc092f',
      ticker: 'AVGO',
      name: 'Broadcom Inc',
      changePct: '+2.41%',
      numericChangePct: 2.41,
      isPositive: true,
      price: '$176.45',
      numericPrice: 176.45,
      volume: 'Vol 24.7M',
      marketCap: '$823.9B',
      peRatio: '38.7',
      sector: 'Semiconductors',
      range52W: '$90.35 - $185.16',
    },
    {
      id: 'COST',
      badgeText: 'COST',
      badgeBg: '#e31837',
      ticker: 'COST',
      name: 'Costco Wholesale',
      changePct: '+0.65%',
      numericChangePct: 0.65,
      isPositive: true,
      price: '$942.80',
      numericPrice: 942.8,
      volume: 'Vol 1.9M',
      marketCap: '$417.6B',
      peRatio: '54.9',
      sector: 'Consumer Retail',
      range52W: '$592.12 - $962.00',
    },
    {
      id: 'ADBE',
      badgeText: 'ADBE',
      badgeBg: '#ff0000',
      ticker: 'ADBE',
      name: 'Adobe Inc',
      changePct: '-1.08%',
      numericChangePct: -1.08,
      isPositive: false,
      price: '$512.30',
      numericPrice: 512.3,
      volume: 'Vol 3.1M',
      marketCap: '$226.4B',
      peRatio: '41.3',
      sector: 'Creative Software',
      range52W: '$433.97 - $638.25',
    },
  ],
};

export const CRYPTO_CARDS: CryptoCardItem[] = [
  {
    id: 'BTCUSD',
    symbolIcon: '₿',
    badgeBg: '#f7931a',
    badgeTextColor: '#ffffff',
    name: 'Bitcoin',
    pair: 'BTC/USD',
    changePct: '+2.84%',
    numericChangePct: 2.84,
    isPositive: true,
    price: '$91,240.00',
    numericPrice: 91240.0,
    marketCap: 'Cap $1.80T',
    volume24h: '$68.4B',
    range52W: '$38,505 - $93,477',
  },
  {
    id: 'ETHUSD',
    symbolIcon: 'Ξ',
    badgeBg: '#627eea',
    badgeTextColor: '#ffffff',
    name: 'Ethereum',
    pair: 'ETH/USD',
    changePct: '+1.45%',
    numericChangePct: 1.45,
    isPositive: true,
    price: '$3,348.50',
    numericPrice: 3348.5,
    marketCap: 'Cap $402.1B',
    volume24h: '$31.2B',
    range52W: '$2,116 - $4,092',
  },
  {
    id: 'SOLUSD',
    symbolIcon: '◎',
    badgeBg: '#14f195',
    badgeTextColor: '#000000',
    name: 'Solana',
    pair: 'SOL/USD',
    changePct: '+7.12%',
    numericChangePct: 7.12,
    isPositive: true,
    price: '$218.40',
    numericPrice: 218.4,
    marketCap: 'Cap $103.8B',
    volume24h: '$11.9B',
    range52W: '$53.60 - $248.10',
  },
];

export const EXTENDED_CRYPTO_LIST: CryptoCardItem[] = [
  ...CRYPTO_CARDS,
  {
    id: 'BNBUSD',
    symbolIcon: 'B',
    badgeBg: '#f3ba2f',
    badgeTextColor: '#000000',
    name: 'BNB',
    pair: 'BNB/USD',
    changePct: '+1.18%',
    numericChangePct: 1.18,
    isPositive: true,
    price: '$642.10',
    numericPrice: 642.1,
    marketCap: 'Cap $92.4B',
    volume24h: '$2.1B',
    range52W: '$224.00 - $720.60',
  },
  {
    id: 'XRPUSD',
    symbolIcon: '✕',
    badgeBg: '#23292f',
    badgeTextColor: '#ffffff',
    name: 'XRP',
    pair: 'XRP/USD',
    changePct: '+9.45%',
    numericChangePct: 9.45,
    isPositive: true,
    price: '$1.14',
    numericPrice: 1.14,
    marketCap: 'Cap $64.9B',
    volume24h: '$8.7B',
    range52W: '$0.42 - $1.26',
  },
  {
    id: 'ADAUSD',
    symbolIcon: '₳',
    badgeBg: '#0033ad',
    badgeTextColor: '#ffffff',
    name: 'Cardano',
    pair: 'ADA/USD',
    changePct: '+4.30%',
    numericChangePct: 4.3,
    isPositive: true,
    price: '$0.78',
    numericPrice: 0.78,
    marketCap: 'Cap $27.4B',
    volume24h: '$1.9B',
    range52W: '$0.31 - $0.82',
  },
];

export interface CategoryHighlightItem {
  symbol: string;
  name: string;
  category: MarketCategory;
  last: string;
  change: string;
  changePct: string;
  isPositive: boolean;
  detail: string;
}

export const CATEGORY_HIGHLIGHTS: Record<MarketCategory, CategoryHighlightItem[]> = {
  'US stocks': [
    { symbol: 'NVDA', name: 'NVIDIA Corp', category: 'US stocks', last: '$148.88', change: '+4.59', changePct: '+3.18%', isPositive: true, detail: 'Vol 65.4M · NASDAQ' },
    { symbol: 'AAPL', name: 'Apple Inc', category: 'US stocks', last: '$227.48', change: '+1.85', changePct: '+0.82%', isPositive: true, detail: 'Vol 41.2M · NASDAQ' },
    { symbol: 'TSLA', name: 'Tesla Inc', category: 'US stocks', last: '$321.22', change: '+15.01', changePct: '+4.90%', isPositive: true, detail: 'Vol 78.9M · NASDAQ' },
    { symbol: 'MSFT', name: 'Microsoft Corp', category: 'US stocks', last: '$422.54', change: '-1.44', changePct: '-0.34%', isPositive: false, detail: 'Vol 22.1M · NASDAQ' },
  ],
  'World stocks': [
    { symbol: 'ASML', name: 'ASML Holding NV', category: 'World stocks', last: '€658.40', change: '+12.80', changePct: '+1.98%', isPositive: true, detail: 'Euronext Amsterdam' },
    { symbol: 'TSM', name: 'Taiwan Semiconductor', category: 'World stocks', last: '$191.20', change: '+4.10', changePct: '+2.19%', isPositive: true, detail: 'TWSE / NYSE ADR' },
    { symbol: 'NOVO', name: 'Novo Nordisk A/S', category: 'World stocks', last: 'DKK 748.50', change: '-6.20', changePct: '-0.82%', isPositive: false, detail: 'OMX Copenhagen' },
    { symbol: '7203', name: 'Toyota Motor Corp', category: 'World stocks', last: '¥2,718.0', change: '+34.5', changePct: '+1.29%', isPositive: true, detail: 'Tokyo Stock Exchange' },
  ],
  Crypto: [
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', category: 'Crypto', last: '$91,240.00', change: '+2,519.80', changePct: '+2.84%', isPositive: true, detail: 'Cap $1.80T · Spot' },
    { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', category: 'Crypto', last: '$3,348.50', change: '+47.85', changePct: '+1.45%', isPositive: true, detail: 'Cap $402.1B · Spot' },
    { symbol: 'SOLUSD', name: 'Solana / US Dollar', category: 'Crypto', last: '$218.40', change: '+14.52', changePct: '+7.12%', isPositive: true, detail: 'Cap $103.8B · Spot' },
    { symbol: 'XRPUSD', name: 'XRP / US Dollar', category: 'Crypto', last: '$1.1420', change: '+0.098', changePct: '+9.45%', isPositive: true, detail: 'Cap $64.9B · Spot' },
  ],
  Futures: [
    { symbol: 'ES1!', name: 'E-mini S&P 500 Futures', category: 'Futures', last: '6,008.25', change: '+25.50', changePct: '+0.43%', isPositive: true, detail: 'CME · Dec 2026' },
    { symbol: 'GC1!', name: 'Gold Futures', category: 'Futures', last: '$2,614.80', change: '+18.40', changePct: '+0.71%', isPositive: true, detail: 'COMEX · Troy Oz' },
    { symbol: 'CL1!', name: 'Crude Oil WTI Futures', category: 'Futures', last: '$68.92', change: '-0.84', changePct: '-1.20%', isPositive: false, detail: 'NYMEX · Barrel' },
    { symbol: 'NQ1!', name: 'E-mini Nasdaq-100 Futures', category: 'Futures', last: '20,985.50', change: '+142.00', changePct: '+0.68%', isPositive: true, detail: 'CME · Dec 2026' },
  ],
  Forex: [
    { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'Forex', last: '1.0542', change: '-0.0021', changePct: '-0.20%', isPositive: false, detail: 'FX Spot · G10' },
    { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'Forex', last: '154.68', change: '+0.42', changePct: '+0.27%', isPositive: true, detail: 'FX Spot · G10' },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'Forex', last: '1.2684', change: '-0.0034', changePct: '-0.27%', isPositive: false, detail: 'FX Spot · G10' },
    { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'Forex', last: '0.8842', change: '+0.0012', changePct: '+0.14%', isPositive: true, detail: 'FX Spot · G10' },
  ],
  'Government bonds': [
    { symbol: 'US10Y', name: 'US 10-Year Treasury Yield', category: 'Government bonds', last: '4.418%', change: '-0.024', changePct: '-0.54%', isPositive: false, detail: 'TVC · Benchmark Yield' },
    { symbol: 'US02Y', name: 'US 2-Year Treasury Yield', category: 'Government bonds', last: '4.284%', change: '-0.018', changePct: '-0.42%', isPositive: false, detail: 'TVC · Short Duration' },
    { symbol: 'DE10Y', name: 'Germany 10-Year Bund Yield', category: 'Government bonds', last: '2.342%', change: '-0.031', changePct: '-1.31%', isPositive: false, detail: 'Eurozone Benchmark' },
    { symbol: 'JP10Y', name: 'Japan 10-Year JGB Yield', category: 'Government bonds', last: '1.068%', change: '+0.012', changePct: '+1.14%', isPositive: true, detail: 'Ministry of Finance' },
  ],
  'Corporate bonds': [
    { symbol: 'LQD', name: 'iBoxx $ Investment Grade Corporate', category: 'Corporate bonds', last: '$108.42', change: '+0.34', changePct: '+0.31%', isPositive: true, detail: 'Yield 5.18% · IG' },
    { symbol: 'HYG', name: 'iBoxx $ High Yield Corporate Bond', category: 'Corporate bonds', last: '$79.64', change: '+0.19', changePct: '+0.24%', isPositive: true, detail: 'Yield 7.32% · High Yield' },
    { symbol: 'VCIT', name: 'Intermediate-Term Corporate Bond', category: 'Corporate bonds', last: '$81.15', change: '+0.22', changePct: '+0.27%', isPositive: true, detail: 'Duration 6.1Y · IG' },
    { symbol: 'JNK', name: 'Bloomberg High Yield Bond', category: 'Corporate bonds', last: '$96.88', change: '+0.18', changePct: '+0.19%', isPositive: true, detail: 'Yield 7.45% · High Yield' },
  ],
  ETFs: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', category: 'ETFs', last: '$596.85', change: '+2.48', changePct: '+0.42%', isPositive: true, detail: 'AUM $618B · Equity' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust Series 1', category: 'ETFs', last: '$508.92', change: '+3.42', changePct: '+0.68%', isPositive: true, detail: 'AUM $312B · Tech' },
    { symbol: 'IBIT', name: 'iShares Bitcoin Trust ETF', category: 'ETFs', last: '$51.94', change: '+1.42', changePct: '+2.81%', isPositive: true, detail: 'AUM $43B · Digital Assets' },
    { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', category: 'ETFs', last: '$91.48', change: '+0.62', changePct: '+0.68%', isPositive: true, detail: 'AUM $54B · Fixed Income' },
  ],
  Economy: [
    { symbol: 'USCPI', name: 'US Consumer Price Index YoY', category: 'Economy', last: '2.60%', change: '+0.20%', changePct: 'Prior 2.4%', isPositive: true, detail: 'Bureau of Labor Statistics' },
    { symbol: 'FEDFUNDS', name: 'Federal Funds Target Rate', category: 'Economy', last: '4.75%', change: '-0.25%', changePct: '25 bps Cut', isPositive: false, detail: 'Federal Reserve' },
    { symbol: 'USGDP', name: 'US Real GDP Growth QoQ (Annualized)', category: 'Economy', last: '2.80%', change: '-0.20%', changePct: 'Prior 3.0%', isPositive: true, detail: 'Bureau of Economic Analysis' },
    { symbol: 'USUNEMP', name: 'US Unemployment Rate', category: 'Economy', last: '4.10%', change: '0.00%', changePct: 'Unchanged', isPositive: true, detail: 'Monthly Nonfarm Payrolls' },
  ],
};

export interface CommunityIdea {
  id: string;
  symbol: string;
  bias: 'LONG' | 'SHORT';
  title: string;
  author: string;
  timeframe: string;
  summary: string;
  likes: number;
  comments: number;
  publishedAt: string;
  targetPrice: string;
}

export const COMMUNITY_IDEAS: CommunityIdea[] = [
  {
    id: 'idea-1',
    symbol: 'INDEX:SPX',
    bias: 'LONG',
    title: 'S&P 500 Breakout Above 5,950 Channel Resistance Targets 6,050',
    author: 'MacroQuantResearch',
    timeframe: '4H',
    summary: 'Breadth expansion in Financials and Semiconductors confirms institutional accumulation above the 20-day exponential moving average.',
    likes: 428,
    comments: 64,
    publishedAt: '2 hours ago',
    targetPrice: '6,050.00',
  },
  {
    id: 'idea-2',
    symbol: 'NVDA',
    bias: 'LONG',
    title: 'NVDA Pre-Earnings Ascending Triangle Continuation Structure',
    author: 'ChipCycleAlpha',
    timeframe: '1D',
    summary: 'Data center demand remains supply-constrained into Q4; key support holds firmly at $142.50 with upper Bollinger Band expansion.',
    likes: 812,
    comments: 119,
    publishedAt: '4 hours ago',
    targetPrice: '$162.00',
  },
  {
    id: 'idea-3',
    symbol: 'BTCUSD',
    bias: 'LONG',
    title: 'Bitcoin Consolidating Above $90K Flag Support Before Next Impulse',
    author: 'DigitalFlowDesk',
    timeframe: '1H',
    summary: 'Spot ETF net inflows exceeded $1.8B this week while exchange reserves hit multi-year lows. Watching $93.5K breakout trigger.',
    likes: 695,
    comments: 93,
    publishedAt: '5 hours ago',
    targetPrice: '$98,500.00',
  },
  {
    id: 'idea-4',
    symbol: 'DAX',
    bias: 'SHORT',
    title: 'DAX 40 Testing 19,350 Supply Zone Amid Eurozone PMI Divergence',
    author: 'FrankfurtFX',
    timeframe: '1D',
    summary: 'Lower highs forming on daily RSI suggest mean reversion toward the 50-day moving average near 18,950.',
    likes: 214,
    comments: 31,
    publishedAt: '7 hours ago',
    targetPrice: '18,950.00',
  },
];

export interface BrokerPartner {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  rating: string;
  reviewsCount: string;
  assets: string;
  minDeposit: string;
  commission: string;
  regulation: string;
}

export const BROKERS_LIST: BrokerPartner[] = [
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    badge: 'IB',
    badgeColor: '#d81224',
    rating: '4.8',
    reviewsCount: '28.4K reviews',
    assets: 'Stocks, Options, Futures, Forex, Bonds',
    minDeposit: '$0',
    commission: '$0.005 / share',
    regulation: 'SEC, FINRA, CFTC, FCA',
  },
  {
    id: 'tradestation',
    name: 'TradeStation',
    badge: 'TS',
    badgeColor: '#0066cc',
    rating: '4.7',
    reviewsCount: '19.1K reviews',
    assets: 'US Stocks, ETFs, Options, Futures',
    minDeposit: '$0',
    commission: '$0 Commission Equities',
    regulation: 'SEC, FINRA, NFA',
  },
  {
    id: 'oanda',
    name: 'OANDA',
    badge: 'OA',
    badgeColor: '#00205b',
    rating: '4.6',
    reviewsCount: '15.8K reviews',
    assets: 'Forex, Metals, Commodities',
    minDeposit: '$0',
    commission: 'Spread-only from 0.6 pips',
    regulation: 'CFTC, NFA, FCA, ASIC',
  },
  {
    id: 'coinbase-adv',
    name: 'Coinbase Advanced',
    badge: 'CB',
    badgeColor: '#0052ff',
    rating: '4.6',
    reviewsCount: '12.3K reviews',
    assets: '300+ Spot Crypto Pairs & Perpetuals',
    minDeposit: '$1',
    commission: '0.0% - 0.40% Maker/Taker',
    regulation: 'NYDFS, FinCEN',
  },
];

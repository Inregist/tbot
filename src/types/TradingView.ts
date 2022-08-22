export interface TradingViewSignal {
  type: 'entry' | 'exit';
  symbol: string;
  timeframe: string;
  direction: 'long' | 'short';
  price: number;
  target: number;
}

export interface KlineData {
    time: number;     // timestamp в миллисекундах
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  // Получение исторических свечей (интервал 1 минута, количество 100)
  export const fetchHistoricalKlines = async (
    symbol: string = 'BTCUSDT',
    interval: string = '1m',
    limit: number = 100
  ): Promise<KlineData[]> => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.map((kline: any[]) => ({
      time: kline[0], // открытие свечи в ms
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  };
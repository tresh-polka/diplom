import { useEffect, useState } from 'react';

interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
}

export const useBinanceWebSocket = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, TickerData>>({});

  const fetchPrices = async () => {
    for (const symbol of symbols) {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const ticker = await response.json();
        setData(prev => ({
          ...prev,
          [symbol]: {
            symbol: symbol,
            price: parseFloat(ticker.lastPrice).toFixed(2),
            priceChange: parseFloat(ticker.priceChange).toFixed(2),
            priceChangePercent: parseFloat(ticker.priceChangePercent).toFixed(2),
          }
        }));
      } catch (err) {
        console.error(`REST error for ${symbol}:`, err);
      }
    }
  };

  useEffect(() => {
    fetchPrices(); // первый запрос сразу
    const interval = setInterval(fetchPrices, 3000); // обновление каждые 3 секунды
    return () => clearInterval(interval);
  }, [symbols]);

  return data;
};
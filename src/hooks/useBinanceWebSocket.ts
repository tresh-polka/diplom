import { useEffect, useState, useRef } from 'react';

interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
}

export const useBinanceWebSocket = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, TickerData>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Стрим для нескольких символов: wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const streamName = response.stream; // например "btcusdt@ticker"
      const ticker = response.data;
      
      const symbolFromStream = streamName.split('@')[0].toUpperCase();
      
      setData(prev => ({
        ...prev,
        [symbolFromStream]: {
          symbol: symbolFromStream,
          price: parseFloat(ticker.c).toFixed(2),
          priceChange: parseFloat(ticker.p).toFixed(2),
          priceChangePercent: parseFloat(ticker.P).toFixed(2),
        }
      }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbols]);

  return data;
};
import React from 'react';
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket';
import TickerCard from './components/TickerCard';

function App() {
  const symbols = ['BTCUSDT', 'ETHUSDT'];
  const tickerData = useBinanceWebSocket(symbols);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Крипто Демотрейдинг</h1>
          <p className="text-gray-400">Реальные цены в реальном времени через Binance WebSocket</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {symbols.map(symbol => {
            const data = tickerData[symbol];
            if (!data) {
              return (
                <div key={symbol} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
              );
            }
            return (
              <TickerCard
                key={symbol}
                symbol={data.symbol}
                price={data.price}
                priceChangePercent={data.priceChangePercent}
                priceChange={data.priceChange}
              />
            );
          })}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Данные в реальном времени от Binance
        </footer>
      </div>
    </div>
  );
}

export default App;
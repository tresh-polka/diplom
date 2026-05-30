import React, { useState, useEffect } from 'react';
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket';
import TickerCard from './components/TickerCard';
import PriceChart from './components/PriceChart';
import { fetchHistoricalKlines, KlineData } from './services/binanceApi';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [historicalData, setHistoricalData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const symbols = ['BTCUSDT', 'ETHUSDT'];
  const tickerData = useBinanceWebSocket(symbols);

  // Загрузка исторических данных при смене символа
  useEffect(() => {
    setLoading(true);
    fetchHistoricalKlines(selectedSymbol, '1m', 100)
      .then(data => {
        setHistoricalData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch historical data:', err);
        setLoading(false);
      });
  }, [selectedSymbol]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-2">Крипто Демотрейдинг</h1>
          <p className="text-gray-400">Реальные цены + исторический график (Binance)</p>
        </header>

        {/* Карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <div key={symbol} onClick={() => setSelectedSymbol(symbol)} className="cursor-pointer transition-transform hover:scale-105">
                <TickerCard
                  symbol={data.symbol}
                  price={data.price}
                  priceChangePercent={data.priceChangePercent}
                  priceChange={data.priceChange}
                />
              </div>
            );
          })}
        </div>

        {/* График */}
        {loading ? (
          <div className="bg-gray-800 rounded-xl p-6 animate-pulse h-[450px] flex items-center justify-center">
            <p className="text-gray-400">Загрузка исторических данных...</p>
          </div>
        ) : (
          <PriceChart data={historicalData} symbol={selectedSymbol} />
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Данные в реальном времени и исторические от Binance
        </footer>
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Asset } from '../hooks/usePortfolio';

interface PortfolioPanelProps {
  assets: Asset[];
  balance: number;
  currentPrices: Record<string, number>;
  onBuy: (symbol: string, amount: number, price: number) => boolean;
  onSell: (symbol: string, amount: number, price: number) => boolean;
}

const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ assets, balance, currentPrices, onBuy, onSell }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  const currentPrice = currentPrices[selectedSymbol] || 0;
  const costOrRevenue = parseFloat(amount) * currentPrice;
  const asset = assets.find(a => a.symbol === selectedSymbol);
  const maxSellAmount = asset ? asset.amount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Введите корректное количество');
      return;
    }
    if (activeTab === 'buy') {
      onBuy(selectedSymbol, numAmount, currentPrice);
    } else {
      onSell(selectedSymbol, numAmount, currentPrice);
    }
    setAmount('');
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Демо-счёт</h2>
      
      <div className="mb-6 p-4 bg-gray-900 rounded-lg">
        <div className="text-gray-400 text-sm">Баланс USDT</div>
        <div className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              activeTab === 'buy' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Покупка
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              activeTab === 'sell' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Продажа
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-gray-300 text-sm mb-1">Валюта</label>
            <div className="relative">
                <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white appearance-none focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                >
                <option value="BTCUSDT">BTC/USDT</option>
                <option value="ETHUSDT">ETH/USDT</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
                </div>
            </div>
        </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Количество</label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-sm text-gray-400">
            Текущая цена: ${currentPrice.toFixed(2)}<br />
            {activeTab === 'buy' ? 'Стоимость' : 'Выручка'}: ${costOrRevenue.toFixed(2)}
            {activeTab === 'sell' && asset && (
              <span className="block mt-1">Доступно: {asset.amount.toFixed(4)} {selectedSymbol.replace('USDT', '')}</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold transition bg-blue-600 hover:bg-blue-700 text-white"
          >
            {activeTab === 'buy' ? 'Купить' : 'Продать'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-3">Ваши активы</h3>
        {assets.length === 0 ? (
          <p className="text-gray-500 text-sm">Нет активов</p>
        ) : (
          <div className="space-y-2">
            {assets.map(asset => {
              const currentPriceAsset = currentPrices[asset.symbol] || 0;
              const currentValue = asset.amount * currentPriceAsset;
              const profitLoss = (currentPriceAsset - asset.avgPrice) * asset.amount;
              const profitPercent = ((currentPriceAsset - asset.avgPrice) / asset.avgPrice) * 100;
              return (
                <div key={asset.symbol} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{asset.symbol}</span>
                    <span className="text-sm text-gray-300">{asset.amount.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Средняя цена: ${asset.avgPrice.toFixed(2)}</span>
                    <span className="text-gray-400">Текущая: ${currentPriceAsset.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Стоимость: ${currentValue.toFixed(2)}</span>
                    <span className={profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} ({profitPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPanel;
import React from 'react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';

interface TickerCardProps {
  symbol: string;
  price: string;
  priceChangePercent: string;
  priceChange: string;
}

const getIcon = (symbol: string) => {
  if (symbol.includes('BTC')) return <FaBitcoin className="text-orange-500 text-2xl" />;
  if (symbol.includes('ETH')) return <FaEthereum className="text-purple-400 text-2xl" />;
  return null;
};

const TickerCard: React.FC<TickerCardProps> = ({ symbol, price, priceChangePercent, priceChange }) => {
  const isPositive = parseFloat(priceChangePercent) >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeSign = isPositive ? '+' : '';

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon(symbol)}
          <span className="text-xl font-bold text-white">{symbol}</span>
        </div>
        <span className="text-gray-400 text-sm">USDT</span>
      </div>
      <div className="text-3xl font-bold text-white mb-2">
        ${price}
      </div>
      <div className={`flex items-center gap-2 ${changeColor}`}>
        <span>{changeSign}{priceChangePercent}%</span>
        <span className="text-sm">({changeSign}{priceChange})</span>
      </div>
    </div>
  );
};

export default TickerCard;
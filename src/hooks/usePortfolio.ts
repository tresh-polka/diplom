import { useState, useEffect } from 'react';

export interface Asset {
  symbol: string;
  amount: number;
  avgPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
}

export const usePortfolio = () => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('portfolio_assets');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('portfolio_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('portfolio_balance');
    return saved ? JSON.parse(saved) : 10000; // Стартовый баланс $10,000
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('portfolio_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('portfolio_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('portfolio_balance', JSON.stringify(balance));
  }, [balance]);

  const buy = (symbol: string, amount: number, price: number) => {
    const cost = amount * price;
    if (cost > balance) {
      alert('Недостаточно средств!');
      return false;
    }
    setBalance(prev => prev - cost);

    const existingAsset = assets.find(a => a.symbol === symbol);
    if (existingAsset) {
      const newAmount = existingAsset.amount + amount;
      const newAvgPrice = (existingAsset.avgPrice * existingAsset.amount + cost) / newAmount;
      setAssets(prev => prev.map(a => a.symbol === symbol ? { ...a, amount: newAmount, avgPrice: newAvgPrice } : a));
    } else {
      setAssets(prev => [...prev, { symbol, amount, avgPrice: price }]);
    }

    setTransactions(prev => [...prev, {
      id: Date.now().toString(),
      symbol,
      type: 'buy',
      amount,
      price,
      timestamp: Date.now(),
    }]);
    return true;
  };

  const sell = (symbol: string, amount: number, price: number) => {
    const asset = assets.find(a => a.symbol === symbol);
    if (!asset || asset.amount < amount) {
      alert('Недостаточно криптовалюты!');
      return false;
    }
    const revenue = amount * price;
    setBalance(prev => prev + revenue);

    const newAmount = asset.amount - amount;
    if (newAmount === 0) {
      setAssets(prev => prev.filter(a => a.symbol !== symbol));
    } else {
      setAssets(prev => prev.map(a => a.symbol === symbol ? { ...a, amount: newAmount } : a));
    }

    setTransactions(prev => [...prev, {
      id: Date.now().toString(),
      symbol,
      type: 'sell',
      amount,
      price,
      timestamp: Date.now(),
    }]);
    return true;
  };

  const getTotalValue = (currentPrices: Record<string, number>) => {
    let total = balance;
    assets.forEach(asset => {
      const price = currentPrices[asset.symbol];
      if (price) {
        total += asset.amount * price;
      }
    });
    return total;
  };

  return { assets, transactions, balance, buy, sell, getTotalValue };
};
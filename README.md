# Крипто Демотрейдинг

Демонстрационное веб-приложение для торговли криптовалютами с визуализацией данных в реальном времени.

**Демо:** https://tresh-polka.github.io/diplom/

## Функционал

- Реальные курсы BTC/USDT и ETH/USDT через WebSocket Binance
- Свечной график с историческими данными (Binance REST API)
- Демо-счёт: покупка/продажа, баланс, портфель, P&L
- Адаптивный интерфейс, тёмная тема

## Технологии

- React 18, TypeScript, Vite
- TailwindCSS
- Lightweight Charts
- Binance WebSocket / REST API

## Запуск локально

```bash
git clone https://github.com/tresh-polka/diplom.git
cd diplom
npm install
npm run dev

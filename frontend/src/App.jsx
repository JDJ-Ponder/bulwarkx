import React, { useState } from 'react'
import CommandInput from './CommandInput';
import { price } from './data';
import { initialOrders, initialTransactions, price } from './data';

function App() {
  // Sample data for the order book and transaction history
  const [orders, setOrders] = useState(initialOrders);
  const [transactions, setTransactions] = useState(initialTransactions);

  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  
  const [terminalOutput, setTerminalOutput] = useState([]);

  const commands = {
    help: () => {
      setTerminalOutput((prevOutput) => ['Available commands: help, clear, price', ...prevOutput]);
    },
    clear: () => {
      setTerminalOutput([]);
    },
    price: () => {
        setTerminalOutput((prevOutput) => [price, ...prevOutput]);
    },
    buy: (amount, price) => {
      const newOrder = { type: 'BUY', price: price, quantity: amount };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      const newTransaction = { type: 'BUY', amount: amount, timestamp: new Date().toLocaleTimeString() };
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      setTerminalOutput((prevOutput) => [`Trade completed: BUY ${amount} at ${price}`, ...prevOutput]);
    },
    sell: (amount, price) => {
      const newOrder = { type: 'SELL', price: price, quantity: amount };
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      const newTransaction = { type: 'SELL', amount: amount, timestamp: new Date().toLocaleTimeString() };
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      setTerminalOutput((prevOutput) => [`Trade completed: SELL ${amount} at ${price}`, ...prevOutput]);
    },
    invalid: (command) => {
      setTerminalOutput((prevOutput) => [`Invalid command: ${command}`, ...prevOutput]);
    }
  };

  const handleCommand = (command) => {
    setTerminalOutput((prevOutput) => [`PonderJaunt> ${command}`, ...prevOutput]);
        const commandHandler = commands[command];
        if (commandHandler) {
          commandHandler();
        } else {
          const parts = command.split(' ');
          const subCommand = parts[0].toLowerCase();
          const amount = parts[1];
          const price = parts[2];

          if (subCommand === 'buy' && amount && price) {
            if (isNaN(amount) || isNaN(price)) {
              commands.invalid(command)
            } else {
                commands.buy(amount, price);
            }
          } else if (subCommand === 'sell' && amount && price) {
            if (isNaN(amount) || isNaN(price)) {
                commands.invalid(command)
            } else {
                commands.sell(amount, price);
            }
          } else {
            commands.invalid(command);
          }
        }
  };

  const handleTradeAmountChange = (event) => {
    setTradeAmount(event.target.value);
  };

  const handleTradePriceChange = (event) => {
    setTradePrice(event.target.value);
  };

  const handleTrade = () => {
    setTradeAmount('');
    setTradePrice('');
  }

  return (
    <div className="terminal">
        <div className="header">PonderJaunt DEX</div>
        <div className="terminal-output">
          {terminalOutput.map((line, index) => (
            <div key={index} className="terminal-line">
              {line}
            </div>
          )).reverse()}
        </div>
        <div className="terminal-sections">
          <div className="terminal-section order-book">
            <h3>Order Book</h3>
            {orders.map((order, index) => (
              <div key={index} className="order">
                <span>{order.type}</span>
                <span>{order.price}</span>
                <span>{order.quantity}</span>
              </div>
            ))}
          </div>
          <div className="terminal-section transaction-history">
            <h3>Transaction History</h3>
            {transactions.map((tx, index) => (
              <div key={index} className="transaction">
                <span>{tx.type}</span>
                <span>{tx.amount}</span>
                <span>{tx.timestamp}</span>
              </div>
            ))}
          </div>
          <div className="terminal-section trade-interface">
            <h3>Trade Interface</h3>
            <div className="trade-options">
              <button onClick={() => handleCommand(`buy ${tradeAmount} ${tradePrice}`)}>Buy</button>
              <button onClick={() => handleCommand(`sell ${tradeAmount} ${tradePrice}`)}>Sell</button>
            </div>
            <div className="trade-form">
              <input type="text" placeholder="Amount" value={tradeAmount} onChange={handleTradeAmountChange} />
              <input type="text" placeholder="Price" value={tradePrice} onChange={handleTradePriceChange} />
            </div>
            <button onClick={() => handleTrade()}>Trade</button>
          </div>
        </div>
        <CommandInput onCommand={handleCommand} />
    </div>
  );
}

export default App;

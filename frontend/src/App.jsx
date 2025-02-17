import React, { useState } from 'react'
import CommandInput from './CommandInput';

import { initialOrders, initialTransactions, price } from './data';

function App() {
  // Sample data for the order book and transaction history
  const [orders, setOrders] = useState(initialOrders);
  const [transactions, setTransactions] = useState(initialTransactions);

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
    }
  };

  const handleCommand = (command) => {
    setTerminalOutput((prevOutput) => [`PonderJaunt> ${command}`, ...prevOutput]);
        const commandHandler = commands[command];
        if (commandHandler) {
          commandHandler();
        } else {
          setTerminalOutput((prevOutput) => [`Invalid command: ${command}`, ...prevOutput]);
        }
  };

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
              <button>Buy</button>
              <button>Sell</button>
            </div>
            <div className="trade-form">
              <input type="text" placeholder="Amount" />
              <input type="text" placeholder="Price" />
              <button>Trade</button>
            </div>
          </div>
        </div>
        <CommandInput onCommand={handleCommand} />
    </div>
  );
}

export default App;

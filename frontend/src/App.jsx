import React, { useState } from 'react';

function App() {  
  // Sample data for the order book and transaction history
  const [orders, setOrders] = useState([
    { type: 'BUY', price: '100', quantity: '5' },
    { type: 'SELL', price: '102', quantity: '3' },
    { type: 'BUY', price: '99', quantity: '2' },
    { type: 'SELL', price: '103', quantity: '7' },
  ]);

  const [transactions, setTransactions] = useState([
    { type: 'BUY', amount: '2', timestamp: '10:00' },
    { type: 'SELL', amount: '1', timestamp: '10:01' },
    { type: 'BUY', amount: '3', timestamp: '10:02' },
  ]);

    const [terminalOutput, setTerminalOutput] = useState([]);

    const handleCommand = (command) => {
      setTerminalOutput((prevOutput) => [`PonderJaunt> ${command}`, ...prevOutput]);
    
      // Basic command handling for 'help' and 'clear'
      if (command === 'help') {
        setTerminalOutput((prevOutput) => ['Available commands: help, clear, price', ...prevOutput]);
      } else if (command === 'clear') {
        setTerminalOutput([]);
      } else if (command === 'price') {
        setTerminalOutput((prevOutput) => ['$101', ...prevOutput]);
      } else {
        setTerminalOutput((prevOutput) => ['Invalid command', ...prevOutput]);
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
  function CommandInput({ onCommand }) {
    const [command, setCommand] = useState('');
  
    const handleInputChange = (event) => {
      setCommand(event.target.value);
    };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        onCommand(command);
        setCommand('');
      }
    };
  
    return (
      <div className='command-line'>
        <span>&gt;&gt;</span>
        <input
          type="text"
          className="command-input-field"
          placeholder="Enter Command"
          value={command}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
}

export default App;
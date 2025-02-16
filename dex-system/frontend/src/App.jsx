// package.json
{
    "name": "ponderjaunt-dex-frontend",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.3",
        "vite": "^4.4.5"
    }
}
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
```

```javascript
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PonderJaunt DEX</title>
    <link rel="stylesheet" href="./src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```javascript
// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const BlinkingCursor = () => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span className={showCursor ? 'cursor' : 'cursor hidden'}>█</span>;
};

const AnimatedText = ({ text, delay }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{displayedText}</span>;
};

const CommandInput = ({ onCommand }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onCommand(command);
      setCommand('');
    }
  };

  return (
    <div className="command-input">
      <span className="prompt">PonderJaunt&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
        className="command-input-field"
      />
      <BlinkingCursor />
    </div>
  );
};

const OrderBook = ({ orders }) => {
  return (
    <div className="order-book">
      <h3>Order Book</h3>
      {orders.map((order, index) => (
        <div key={index} className="order">
          <span>{order.type}</span>
          <span>{order.price}</span>
          <span>{order.quantity}</span>
        </div>
      ))}
    </div>
  );
};

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      {transactions.map((tx, index) => (
        <div key={index} className="transaction">
          <span>{tx.type}</span>
          <span>{tx.amount}</span>
          <span>{tx.timestamp}</span>
        </div>
      ))}
    </div>
  );
};

const TradeInterface = ({ onTrade }) => {
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleTrade = () => {
    onTrade({ type: tradeType, amount, price });
    setAmount('');
    setPrice('');
  };

  return (
    <div className="trade-interface">
      <h3>Trade Interface</h3>
      <div>
        <button onClick={() => setTradeType('buy')}>Buy</button>
        <button onClick={() => setTradeType('sell')}>Sell</button>
      </div>
      <div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button onClick={handleTrade}>Trade</button>
    </div>
  );
};

const App = () => {
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [orders, setOrders] = useState([
    { type: 'BUY', price: 100, quantity: 10 },
    { type: 'SELL', price: 102, quantity: 5 },
  ]);
  const [transactions, setTransactions] = useState([
    { type: 'BUY', amount: 10, timestamp: '12:00:00' },
    { type: 'SELL', amount: 5, timestamp: '12:00:01' },
  ]);

  const handleCommand = (command) => {
    setTerminalOutput((prevOutput) => [
      ...prevOutput,
      `PonderJaunt> ${command}`,
    ]);

    if (command === 'help') {
      setTerminalOutput((prevOutput) => [...prevOutput, 'Available commands: help, clear']);
    } else if (command === 'clear') {
      setTerminalOutput((prevOutput) => {
        return [];
      });
    } else if (command === "price"){
      setTerminalOutput((prevOutput) => [...prevOutput, 'Current price: $101']);
    } else {
      setTerminalOutput((prevOutput) => [
        ...prevOutput,
        { type: 'output', text: `Unknown command: ${command}` },
      ]);
    }
  };

  const handleTrade = (trade) => {
    setTransactions((prevTransactions) => [
      ...prevTransactions,
      { ...trade, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  return (
    <div className="terminal">
      <div className="header">PonderJaunt DEX</div>
      <div className="terminal-output">
        {terminalOutput.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
      </div>
      <div className="terminal-sections">
        <div className="terminal-section">
          <OrderBook orders={orders} />
        </div>
        <div className="terminal-section">
          <TransactionHistory transactions={transactions} />
        </div>
        <div className="terminal-section">
          <TradeInterface onTrade={handleTrade} />
        </div>
      </div>
      <CommandInput onCommand={handleCommand} />
    </div>
  );
};

export default App;
```

```css
/* src/App.css */
body {
  margin: 0;
  background-color: #000;
  color: #0F0;
  font-family: 'Courier New', Courier, monospace;
  overflow: hidden;
}

.terminal {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
}

.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.terminal-line {
  margin-bottom: 5px;
}

.terminal-header {
  margin-bottom: 20px;
  font-size: 24px;
}

.command {
  color: #0ff;
}

.output {
  color: #0f0;
}

.cursor {
  animation: blinker 1s linear infinite;
  display: inline-block;
}

.cursor.hidden {
  opacity: 0;
}

.prompt {
  color: #0f0;
  margin-right: 5px;
}

.command-input {
  display: flex;
  align-items: center;
}

.command-input-field {
  background-color: transparent;
  border: none;
  color: #0F0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  outline: none;
  flex-grow: 1;
}

.terminal-sections {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.terminal-section {
  flex-grow: 1;
}

.order-book,
.transaction-history,
.trade-interface {
  border: 1px solid #0F0;
  padding: 10px;
}

.order,
.transaction {
  display: flex;
  justify-content: space-between;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
```

```css
/* src/index.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
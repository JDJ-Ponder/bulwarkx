import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../../shared/utils';
import './App.css'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkServerStatus();
        setServerStatus(status);
      } catch (err) {
        setServerStatus(false);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const statusStyle = {
    color: serverStatus ? 'green' : 'red',
  };

  

  return (
    <div className="app">
      <div className="terminal">
        <div className="header">
          <span className="status">Server Status: {serverStatus}</span>
        </div>
        <div className="content">
          <span className="status" style={statusStyle}>{serverStatus ? "Online" : "Offline"}</span>
          <p>Welcome to the PonderJaunt DEX</p>
        </div>
      </div>
    </div>
  );
}

export default App;
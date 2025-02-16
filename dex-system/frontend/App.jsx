import React, { useState, useEffect } from 'react';
import { checkServerStatus } from '../../../dex-project/shared/utils';

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkServerStatus();
        setServerStatus(status ? 'Online' : 'Offline');
        if (!status) {
          setError('Backend server is offline!');
        }
      } catch (err) {
        setServerStatus('Offline');
        setError('Error checking server status: ' + err.message);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app">
      <div className="terminal">
        <div className="header">
          <span className="status">Server Status: {serverStatus}</span>
        </div>
        <div className="content">
          {error && <div className="error">{error}</div>}
          <p>Welcome to the PonderJaunt DEX</p>
        </div>
      </div>
    </div>
  );
}

export default App;
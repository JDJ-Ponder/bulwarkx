import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div>Trading Terminal</div>
      </div>
      <div className="terminal-content">
        {data && <div className="terminal-data">{JSON.stringify(data)}</div>}
        {error && <div className="terminal-error">{error}</div>}
      </div>
      <div className='command-line'>
        <span>&gt;&gt;</span>
        <input type="text" className="command-input-field" placeholder="Enter Command" />
      </div>
    </div>
  );
}

export default App;
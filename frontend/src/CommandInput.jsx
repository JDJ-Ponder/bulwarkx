import React, { useState } from 'react';

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

      <label htmlFor="commandInput"></label>
      <span>&gt;&gt;</span>
      <input
        type="text"
        className="command-input-field"
        placeholder="Enter Command"
        value={command}
        id="commandInput"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default CommandInput;
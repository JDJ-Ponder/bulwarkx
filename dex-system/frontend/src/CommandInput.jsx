import React, { useState } from 'react';

function CommandInput() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Submitted:', inputValue);
  };

  return (
    <div className="CommandInput">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter command here..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default CommandInput;
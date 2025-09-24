import React, { useState } from 'react';
import { KeyboardGrid } from './KeyboardGrid';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {
  const [textInput, setTextInput] = useState<string>('');


  return (
    <div className="app-container">
      <div className="top-area">
        <p>One</p>
        <p>Two</p>
      </div>

      <div className="middle-area">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type here..."
          className="text-input"
        />
      </div>

      <KeyboardGrid />
    </div>
  );
};
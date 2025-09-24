import React, { useState } from 'react';

interface TypingBoxProps {}

export const TypingBox: React.FC<TypingBoxProps> = () => {
  const [textInput, setTextInput] = useState<string>('');

  return (
    <div className="typing-box-container">
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Type here..."
        className="typing-box-input"
      />
    </div>
  );
};
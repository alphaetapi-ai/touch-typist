import React, { useState } from 'react';

interface TypingBoxProps {
  onWordSubmit: (word: string) => boolean;
}

export const TypingBox: React.FC<TypingBoxProps> = ({ onWordSubmit }) => {
  const [textInput, setTextInput] = useState<string>('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = textInput.trim();
      if (trimmedInput) {
        const wasMatch = onWordSubmit(trimmedInput);
        if (wasMatch) {
          setTextInput('');
        }
      }
    }
  };

  return (
    <div className="typing-box-container">
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type here..."
        className="typing-box-input"
      />
    </div>
  );
};
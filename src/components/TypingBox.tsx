import React, { useState, useEffect } from 'react';
import { useKeyboardHighlight } from '../contexts/KeyboardHighlightContext';

interface TypingBoxProps {
  onWordSubmit: (word: string) => boolean;
  currentWord: string;
}

export const TypingBox: React.FC<TypingBoxProps> = ({
  onWordSubmit,
  currentWord
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const { updateHighlightForInput } = useKeyboardHighlight();

  useEffect(() => {
    updateHighlightForInput(textInput, currentWord);
  }, [textInput, currentWord, updateHighlightForInput]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      const trimmedInput = textInput.trim();
      if (trimmedInput) {
        const wasMatch = onWordSubmit(trimmedInput);
        if (wasMatch) {
          e.preventDefault();
          setTextInput('');
        } else if (e.key === 'Enter') {
          // Prevent Enter when word doesn't match, but allow space to be handled naturally
          e.preventDefault();
        }
        // For space key: if word doesn't match, let browser handle it naturally (no preventDefault)
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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  );
};
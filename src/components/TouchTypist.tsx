import React from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';
import { PendingWords } from './PendingWords';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {


  return (
    <div className="app-container">
      <PendingWords />

      <TypingBox />

      <KeyboardGrid />
    </div>
  );
};
import React from 'react';
import { KeyboardGrid } from './KeyboardGrid';
import { TypingBox } from './TypingBox';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {


  return (
    <div className="app-container">
      <div className="top-area">
        <p>One</p>
        <p>Two</p>
      </div>

      <TypingBox />

      <KeyboardGrid />
    </div>
  );
};
import React, { useState } from 'react';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {
  const [textInput, setTextInput] = useState<string>('');

  const generateGrid = (): React.JSX.Element[] => {
    const grid: React.JSX.Element[] = [];
    for (let row: number = 0; row < 4; row++) {
      const cells: React.JSX.Element[] = [];
      for (let col: number = 0; col < 15; col++) {
        cells.push(
          <div key={`${row}-${col}`} className="grid-cell">
            {String.fromCharCode(65 + (row * 15 + col) % 26)}
          </div>
        );
      }
      grid.push(
        <div key={row} className={`grid-row grid-row-${row}`}>
          {cells}
        </div>
      );
    }
    return grid;
  };

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

      <div className="bottom-area">
        <div className="letter-grid">
          {generateGrid()}
        </div>
      </div>
    </div>
  );
};
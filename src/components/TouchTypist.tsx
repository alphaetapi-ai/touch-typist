import React, { useState } from 'react';

interface TouchTypistProps {}

export const TouchTypist: React.FC<TouchTypistProps> = () => {
  const [textInput, setTextInput] = useState<string>('');

  const generateGrid = (): React.JSX.Element[] => {
    const grid: React.JSX.Element[] = [];
    const activePositions = [1, 2, 3, 4, 7, 8, 9, 10];
    const rowEndCols = [14, 14, 13, 11]; // Row 0: 14 (0-13), Row 1: 13 (1-13), Row 2: 12 (1-12), Row 3: 10 (1-10)

    // Dvorak keyboard layout data
    const keyboardLayout = [
      ["`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "[{", "]}"],
      ["  ", "'\"", ",<", ".>", "pP", "yY", "fF", "gG", "cC", "rR", "lL", "/?", "=+", "\\|"],
      ["  ", "aA", "oO", "eE", "uU", "iI", "dD", "hH", "tT", "nN", "sS", "-_"],
      ["  ", ";:", "qQ", "jJ", "kK", "xX", "bB", "mM", "wW", "vV", "zZ"]
    ];

    for (let row: number = 0; row < 4; row++) {
      const cells: React.JSX.Element[] = [];
      const startCol = row === 0 ? 0 : 1;
      const endCol = rowEndCols[row];

      for (let col: number = startCol; col < endCol; col++) {
        const isActiveKey = row === 2 && activePositions.includes(col);
        const isLastCell = col === endCol - 1;

        let cellClass = "grid-cell";
        if (isActiveKey) cellClass += " active-key";
        if (row === 0 && isLastCell) cellClass += " grid-backspace";
        if (row === 2 && isLastCell) cellClass += " grid-return";

        let cellContent: string;
        if (row === 0 && isLastCell) {
          cellContent = "BSp";
        } else if (row === 2 && isLastCell) {
          cellContent = "Ret";
        } else {
          const keyData = keyboardLayout[row][col];
          if (keyData === "  ") {
            cellContent = "";
          } else if (keyData.length === 2) {
            const char1 = keyData[0];
            const char2 = keyData[1];
            // If both characters are letters and one is uppercase version of the other
            if (char1.toLowerCase() === char2.toLowerCase() && char1 !== char2) {
              cellContent = char1.toUpperCase();
            } else {
              cellContent = keyData;
            }
          } else {
            cellContent = keyData;
          }
        }

        cells.push(
          <div key={`${row}-${col}`} className={cellClass}>
            {cellContent}
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
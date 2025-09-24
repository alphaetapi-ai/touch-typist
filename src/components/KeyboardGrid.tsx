import React from 'react';
import { getDefaultKeyboardLayout } from '../utils/keyboardLayouts';

interface KeyboardGridProps {}

export const KeyboardGrid: React.FC<KeyboardGridProps> = () => {
  const generateGrid = (): React.JSX.Element[] => {
    const grid: React.JSX.Element[] = [];
    const activePositions = [1, 2, 3, 4, 7, 8, 9, 10];
    const rowEndCols = [14, 14, 13, 11]; // Row 0: 14 (0-13), Row 1: 13 (1-13), Row 2: 12 (1-12), Row 3: 10 (1-10)

    // Get keyboard layout data
    const keyboardLayout = getDefaultKeyboardLayout();

    for (let row: number = 0; row < 4; row++) {
      const cells: React.JSX.Element[] = [];
      const startCol = row === 0 ? 0 : 1;
      const endCol = rowEndCols[row];

      for (let col: number = startCol; col < endCol; col++) {
        const isActiveKey = row === 2 && activePositions.includes(col);
        const isLastCell = col === endCol - 1;

        let cellClass = "keyboard-grid-cell";
        if (isActiveKey) cellClass += " keyboard-grid-active-key";
        if (row === 0 && isLastCell) cellClass += " keyboard-grid-backspace";
        if (row === 2 && isLastCell) cellClass += " keyboard-grid-return";

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
        <div key={row} className={`keyboard-grid-row keyboard-grid-row-${row}`}>
          {cells}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="keyboard-grid-container">
      <div className="keyboard-grid">
        {generateGrid()}
      </div>
    </div>
  );
};
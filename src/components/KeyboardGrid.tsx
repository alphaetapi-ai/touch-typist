import React from 'react';
import { getDefaultKeyboardLayout, keyLevels, getKeyboardLayout } from '../utils/keyboardLayouts';

interface KeyboardGridProps {
  highlightedKey?: string;
  currentLevel?: number;
  selectedLayout?: string;
}

export const KeyboardGrid: React.FC<KeyboardGridProps> = ({ highlightedKey = "", currentLevel = 1, selectedLayout = "Qwerty" }) => {
  const generateGrid = (): React.JSX.Element[] => {
    const grid: React.JSX.Element[] = [];
    const homeKeyPositions = [1, 2, 3, 4, 7, 8, 9, 10];
    const rowEndCols = [14, 14, 13, 11]; // Row 0: 14 (0-13), Row 1: 13 (1-13), Row 2: 12 (1-12), Row 3: 10 (1-10)

    // Get keyboard layout data
    const keyboardLayout = getKeyboardLayout(selectedLayout) || getDefaultKeyboardLayout();

    for (let row: number = 0; row < 4; row++) {
      const cells: React.JSX.Element[] = [];
      const startCol = row === 0 ? 0 : 1;
      const endCol = rowEndCols[row];

      for (let col: number = startCol; col < endCol; col++) {
        const isHomeKey = row === 2 && homeKeyPositions.includes(col);
        const isLastCell = col === endCol - 1;

        // Get key data first
        const keyData = keyboardLayout[row][col];
        const keyLevel = keyLevels[row][col];

        let cellClass = "keyboard-grid-cell";
        if (isHomeKey) cellClass += " keyboard-grid-home-key";
        if (keyLevel > 0 && keyLevel <= currentLevel) cellClass += " keyboard-grid-active-key";
        if (row === 0 && isLastCell) cellClass += " keyboard-grid-backspace";
        if (row === 2 && isLastCell) cellClass += " keyboard-grid-return";

        // Check for key highlighting (now keyData is available)
        const shouldHighlight = (
          (highlightedKey === "backspace" && row === 0 && isLastCell) ||
          (highlightedKey === "return" && row === 2 && isLastCell) ||
          (highlightedKey !== "backspace" && highlightedKey !== "return" && highlightedKey &&
           keyData && keyData !== "  " && keyData.toLowerCase().includes(highlightedKey))
        );

        if (shouldHighlight) {
          cellClass += " keyboard-grid-highlighted";
        }

        let cellContent: string;
        if (row === 0 && isLastCell) {
          cellContent = "BSp";
        } else if (row === 2 && isLastCell) {
          cellContent = "Ret";
        } else {
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
          <div
            key={`${row}-${col}`}
            className={cellClass}
            id={row === 0 && isLastCell ? "backspace-key" : undefined}
          >
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

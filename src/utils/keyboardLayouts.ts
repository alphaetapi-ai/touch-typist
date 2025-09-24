// Keyboard layout utility
// This will eventually be replaced with database calls

export interface KeyboardLayout {
  name: string;
  layout: string[][];
}

export const keyLevels: number[][] = [
	[ 24, 20, 19, 18, 17, 21, 21 ,17, 18, 19, 20, 23, 23 ],
	[  0,  9,  8,  7,  6, 10, 10,  6,  7,  8,  9, 11, 22, 22 ],
	[  0,  4,  3,  2,  1,  5,  5,  1,  2,  3,  4, 11 ],
	[  0, 15, 14, 13, 12, 16, 16, 12, 13, 14, 15 ],
]

export const dvorakLayout: string[][] = [
  ["`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "[{", "]}"],
  ["  ", "'\"", ",<", ".>", "pP", "yY", "fF", "gG", "cC", "rR", "lL", "/?", "=+", "\\|"],
  ["  ", "aA", "oO", "eE", "uU", "iI", "dD", "hH", "tT", "nN", "sS", "-_"],
  ["  ", ";:", "qQ", "jJ", "kK", "xX", "bB", "mM", "wW", "vV", "zZ"]
];

export const keyboardLayouts: KeyboardLayout[] = [
  {
    name: "Dvorak",
    layout: dvorakLayout
  }
];

// Default keyboard layout
export const getDefaultKeyboardLayout = (): string[][] => {
  return dvorakLayout;
};

// Get keyboard layout by name (for future database integration)
export const getKeyboardLayout = (layoutName: string): string[][] | null => {
  const layout = keyboardLayouts.find(l => l.name.toLowerCase() === layoutName.toLowerCase());
  return layout ? layout.layout : null;
};

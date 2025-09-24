// Keyboard layout utility
// This will eventually be replaced with database calls

export interface KeyboardLayout {
  name: string;
  layout: string[][];
}

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
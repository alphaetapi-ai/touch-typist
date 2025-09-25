# TouchTypist

A modern typing tutor application built with React and TypeScript to help users improve their typing speed and accuracy.

## Features

- **Progressive Level System**: 25 levels with automatic advancement based on typing speed
- **Real-time Speed Tracking**: WPM calculation with weighted averages
- **Multiple Keyboard Layouts**: Support for QWERTY and Dvorak layouts
- **Visual Keyboard Display**: Interactive keyboard with key highlighting
- **Shift Mode Toggle**: Practice with or without shifted characters
- **Level Controls**: Manual level adjustment with +1/-1 buttons
- **Smart Word Generation**: Level-appropriate character selection
- **Speed-based Progression**: Automatic level advancement when speed improves

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Express.js server
- **Bundling**: Webpack
- **Styling**: CSS with component-specific classes
- **Build**: TypeScript compiler + Webpack

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:8080`

## Usage

1. **Select your keyboard layout** (QWERTY or Dvorak) from the dropdown
2. **Choose shift mode** - uncheck "Shift?" to practice only unshifted characters
3. **Adjust level manually** using +1/-1 buttons if needed
4. **Start typing** the displayed words in the input box
5. **Watch your progress** - speed is tracked and levels advance automatically when you type faster than 12 WPM (5 seconds per word)

## Project Structure

```
src/
├── components/           # React components
│   ├── TouchTypist.tsx  # Main application component
│   ├── KeyboardGrid.tsx # Virtual keyboard display
│   ├── TypingBox.tsx    # Text input component
│   └── PendingWords.tsx # Word display component
├── utils/               # Utility functions
│   └── keyboardLayouts.ts # Keyboard layout definitions
├── cli/                 # CLI utilities
└── server.ts           # Express server
```

## Development

- **Watch mode**: `npm run watch` (automatically rebuilds on changes)
- **Build**: `npm run build` (compile TypeScript and bundle)
- **Start**: `npm start` (run the server)

## Deployment

Use the provided `packup.sh` script to create an AWS deployment package:

```bash
./packup.sh
```

This creates `aws-pack.zip` with all necessary files for deployment.

## License

MIT License

## Author

TouchTypist by Adam Peterson
[GitHub Repository](https://github.com/alphaetapi-ai/touch-typist)
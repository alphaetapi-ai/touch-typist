# TouchTypist

A modern typing tutor application built with React and TypeScript to help users improve their typing speed and accuracy.

## Features

- **Progressive Level System**: 25 levels with automatic advancement based on typing speed
- **Real English Words**: Practice with actual words from classic literature (Pride and Prejudice)
- **Character-based WPM Tracking**: Standard WPM calculation (CPM / 5) for consistent measurements
- **Multiple Keyboard Layouts**: Support for QWERTY and Dvorak layouts
- **Visual Keyboard Display**: Interactive keyboard with key highlighting
- **Shift Mode Toggle**: Practice with or without shifted characters
- **Smart Word Caching**: Pre-fetches word lists for smooth progression
- **REST API**: Programmatic access to word lists by level and layout
- **CLI Tools**: Extract and bucket words from text files for custom practice sets
- **Adaptive Phrase Length**: ~25 characters per phrase for consistent practice

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
5. **Watch your progress** - speed is tracked and levels advance automatically when you type faster than 12 WPM (60 CPM / 5)

## Project Structure

```
src/
├── components/          # React components
│   ├── TouchTypist.tsx  # Main application component
│   ├── KeyboardGrid.tsx # Virtual keyboard display
│   ├── TypingBox.tsx    # Text input component
│   └── PendingWords.tsx # Word display component
├── contexts/            # React contexts
│   ├── AppSettingsContext.tsx      # User settings (level, layout, shift)
│   ├── WordCacheContext.tsx        # Word list caching and pre-fetching
│   ├── TypingSessionContext.tsx    # Typing session state and WPM tracking
│   └── KeyboardHighlightContext.tsx # Keyboard highlighting
├── cli/                 # CLI utilities
│   ├── extract-words.ts # Extract unique words from text files
│   └── bucket-words.ts  # Bucket words by keyboard level
├── utils/               # Utility functions
│   └── keyboardLayouts.ts # Keyboard layout definitions
├── data/                # Generated data (gitignored)
│   └── wordLists.ts     # Pre-computed word lists (generated at build time)
└── server.ts            # Express server with REST API
```

## Development

### Available Scripts

- **`npm run build`**: Full build (generates word lists, compiles TypeScript, bundles React)
- **`npm run build:server`**: Build server only (TypeScript compilation + word list generation)
- **`npm run build:client`**: Build client only (Webpack bundling)
- **`npm run generate-words`**: Generate word lists from practice-files/english.txt
- **`npm start`**: Start the production server
- **`npm run dev`**: Build and start in development mode

### CLI Tools

The project includes CLI utilities for working with word lists:

```bash
# Extract unique words from a text file
node dist/cli/extract-words.js input.txt > words.txt

# Bucket words by keyboard level
cat words.txt | node dist/cli/bucket-words.js --layout=qwerty --no-shift --full-coverage
```

### REST API

The server provides a REST API endpoint for accessing word lists:

```
GET /api/words?layout={qwerty|dvorak}&shift={shift|no-shift}&level={1-24}
```

Example:
```bash
curl "http://localhost:8080/api/words?layout=qwerty&shift=no-shift&level=5"
```

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
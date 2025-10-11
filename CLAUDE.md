# TouchTypist - Claude Development Guide

This document provides context and guidance for AI assistants working on the TouchTypist project.

## Project Overview

TouchTypist is a progressive typing tutor that teaches touch typing through 25 difficulty levels. Users practice with real English words extracted from classic literature, with automatic level progression based on typing speed.

## Key Architecture Decisions

### 1. Build-Time Word List Generation

**Why**: Word lists are pre-computed at build time rather than runtime to optimize performance and reduce server load.

**How it works**:
1. `scripts/generate-word-lists.js` runs during build
2. Reads `practice-files/english.txt` (Pride and Prejudice)
3. Uses CLI tools (`extract-words`, `bucket-words`) to process words
4. Generates 4 variants: qwerty/shift, qwerty/no-shift, dvorak/shift, dvorak/no-shift
5. Outputs TypeScript file `src/data/wordLists.ts` with exported constants
6. TypeScript compiles this to `dist/data/wordLists.js`

**Important**: `src/data/` is gitignored - developers must run `npm run build` to generate word lists.

### 2. Word Caching Strategy

**Why**: Pre-fetching and caching word lists prevents interruptions during typing sessions.

**How it works**:
- `WordCacheContext` manages an in-memory cache using `useRef` (not `useState` to avoid re-renders)
- On startup: pre-fetches levels 1-3 for current layout/shift settings
- On level/layout/shift change: pre-fetches current level and next level
- Level 25 special case: fetches all levels 1-24 and picks words with probability proportional to level word counts
- Cache never invalidates - all combinations are stored independently

**Important**: Using `useRef` for cache is critical to prevent dependency chain updates that would reset the word list.

### 3. Character-Based WPM Calculation

**Why**: Standard typing speed measurement accounts for different word lengths.

**How it works**:
- Tracks seconds per character (not seconds per word)
- WPM = (60 / seconds_per_char) / 5
- CPM (characters per minute) = 60 / seconds_per_char
- Standard formula: WPM = CPM / 5

**Example**: 1 second per character = 60 CPM = 12 WPM

### 4. Adaptive Phrase Length

**Why**: Consistent practice experience regardless of word length.

**How it works**:
- Generates words until total character count (excluding spaces) ≥ 25
- Provides consistent difficulty and typing rhythm
- Works with any word length from the word lists

## Important Code Patterns

### Dependency Management in useCallback

**Problem**: React dependency arrays can cause unintended re-renders and session resets.

**Solution**: Carefully exclude dependencies that shouldn't trigger updates:

```typescript
// ✅ CORRECT: Excludes 'level' to prevent reset on automatic progression
const generatePhrase = useCallback((currentLevel: number = level) => {
  // ...
}, [getWord, selectedLayout]); // level intentionally excluded

// ❌ WRONG: Including 'level' would reset words on WPM-based progression
const generatePhrase = useCallback((currentLevel: number = level) => {
  // ...
}, [getWord, selectedLayout, level]); // Would cause session reset
```

**Key principle**: Only manual setting changes (layout, shift) should reset the session. Automatic level progression should continue seamlessly.

### Context Stability

**Problem**: Cache updates triggering context changes cascade through the app.

**Solution**: Use `useRef` for data that changes but shouldn't trigger re-renders:

```typescript
// ✅ CORRECT: Cache updates don't trigger re-renders
const cache = useRef<WordCache>({});

// ❌ WRONG: Every cache update would trigger re-renders
const [cache, setCache] = useState<WordCache>({});
```

## CLI Tools

### extract-words.ts

Extracts unique words from text files with smart punctuation handling:
- Splits lines on spaces
- For words with punctuation at start/end: saves both original and stripped version
- For words with internal punctuation: keeps original only (e.g., "don't" stays as-is)
- Outputs sorted, deduplicated word list

### bucket-words.ts

Buckets words by keyboard difficulty level:
- `--layout=qwerty|dvorak`: Select keyboard layout
- `--no-shift`: Exclude words with shifted punctuation, use only unshifted chars in coverage
- `--full-coverage`: Add practice strings to ensure all characters at each level are covered

**Coverage algorithm**:
1. Check if all characters at a level appear in at least one word
2. If any missing: generate all permutations of ALL level characters (not just missing ones)
3. Repeat each permutation to length 5 (e.g., "fj" → "fjfjf")
4. Add to word list

## REST API

### GET /api/words

Query parameters:
- `layout`: "qwerty" or "dvorak" (lowercase required)
- `shift`: "shift" or "no-shift"
- `level`: 1-24

Returns:
```json
{
  "layout": "qwerty",
  "shift": "no-shift",
  "level": 4,
  "words": ["word1", "word2", ...]
}
```

**Important**: Frontend sends capitalized layout names ("Qwerty") but API expects lowercase. The `WordCacheContext` handles conversion.

## Build Process

### Full Build Flow

1. `npm run generate-words`
   - Compiles TypeScript (for CLI tools)
   - Sets execute permissions on CLI tools
   - Runs `scripts/generate-word-lists.js`
     - Extracts words from `practice-files/english.txt`
     - Buckets words for 4 variants
     - Generates `src/data/wordLists.ts`

2. `tsc` - Compiles TypeScript (including generated word lists)

3. `webpack` - Bundles React frontend

4. `cp src/public/* dist/public/` - Copies static assets

### Deployment

`packup.sh` creates AWS deployment package:
- Includes: `dist/`, `package.json`, `package-lock.json`
- Excludes: `src/`, `scripts/`, `practice-files/`, `node_modules/`

**Why exclude practice-files?**: Word lists are pre-compiled into `dist/data/wordLists.js`

## Level System

### Levels 1-24

Progressive difficulty based on keyboard key positions. Each level introduces new keys with specific difficulty ratings (defined in `keyLevels` array).

**Key selection for levels 1-24**:
- Try cache first
- If cached: pick random word from that level's list
- If not cached: fallback to random character generation using level-appropriate keys

### Level 25 (Master Level)

Uses all keys from levels 1-24.

**Key selection for level 25**:
- Fetches word lists for ALL levels 1-24
- Picks level with probability proportional to word count
- Picks word randomly within selected level
- This ensures equal probability for each individual word across all levels

## Common Pitfalls

1. **Don't include `level` in `generatePhrase` dependencies** - causes session reset on WPM progression
2. **Don't use `useState` for cache** - causes unnecessary re-renders and dependency chain updates
3. **Always lowercase layout names in API requests** - API validation is case-sensitive
4. **Don't forget to run `npm run build`** after cloning - word lists aren't in git
5. **Character count excludes spaces** - important for phrase length calculation

## Testing Checklist

When making changes, verify:
- [ ] Level progression via WPM doesn't reset word list
- [ ] Manual layout/shift changes DO reset word list
- [ ] Words appear from cache (check console logs)
- [ ] Level 25 shows variety from all levels
- [ ] WPM calculation is character-based
- [ ] Build process generates word lists
- [ ] API returns correct words for all combinations

## Future Development Ideas

- Support for custom practice text files
- More keyboard layouts (Colemak, etc.)
- Detailed statistics and progress tracking
- Configurable phrase length
- Accuracy tracking
- Error highlighting
- Practice mode for specific problematic keys

#!/usr/bin/env node

import { createInterface } from 'readline';
import { qwertyLayout, dvorakLayout, keyLevels } from '../utils/keyboardLayouts';

function showHelp(): void {
    console.log(`Usage: bucket-words [options]

Description:
  Reads a list of words from standard input and buckets them by keyboard level.
  Each word is assigned to a bucket based on the maximum level of any character in the word.
  Outputs a JSON array of arrays where index 0 contains level 1 words, index 1 contains level 2 words, etc.

Options:
  --layout=<name>    Keyboard layout to use (qwerty or dvorak). Default: qwerty
  --full-coverage    Add practice strings to ensure all characters at each level are covered
  --no-shift         Exclude words with shifted punctuation and only use unshifted chars in coverage
  --help             Show this help message

Example:
  extract-words input.txt | bucket-words --layout=dvorak --full-coverage --no-shift`);
}

interface CharToLevelMap {
    [char: string]: number;
}

function buildCharToLevelMap(layout: string[][]): CharToLevelMap {
    const map: CharToLevelMap = {};

    for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
        const row = layout[rowIndex];
        const levelRow = keyLevels[rowIndex];

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const keyChars = row[colIndex];
            const level = levelRow[colIndex];

            // Each entry like "aA" contains all characters on that key
            for (const char of keyChars) {
                if (char !== ' ') {  // Skip spaces (placeholder entries)
                    map[char] = level;
                }
            }
        }
    }

    return map;
}

// Build a set of all shifted punctuation characters (2nd char in non-letter keys)
function buildShiftedPunctuationSet(layout: string[][]): Set<string> {
    const shifted = new Set<string>();

    for (const row of layout) {
        for (const keyChars of row) {
            if (keyChars.length >= 2) {
                const firstChar = keyChars[0];
                const secondChar = keyChars[1];

                // Only consider it shifted punctuation if both chars are non-letters
                if (!/[a-zA-Z]/.test(firstChar) && !/[a-zA-Z]/.test(secondChar)) {
                    shifted.add(secondChar);
                }
            }
        }
    }

    return shifted;
}

// Check if a word contains any shifted punctuation
function containsShiftedPunctuation(word: string, shiftedPunct: Set<string>): boolean {
    for (const char of word) {
        if (shiftedPunct.has(char)) {
            return true;
        }
    }
    return false;
}

function validateLayout(layout: string[][], layoutName: string): void {
    const charToLevel = buildCharToLevelMap(layout);

    // Check that upper and lowercase versions of letters map to the same level
    for (const char in charToLevel) {
        if (/[a-zA-Z]/.test(char)) {
            const lower = char.toLowerCase();
            const upper = char.toUpperCase();

            if (charToLevel[lower] !== undefined && charToLevel[upper] !== undefined) {
                if (charToLevel[lower] !== charToLevel[upper]) {
                    console.error(`Error: Layout validation failed for ${layoutName}`);
                    console.error(`Character '${lower}' is at level ${charToLevel[lower]} but '${upper}' is at level ${charToLevel[upper]}`);
                    process.exit(1);
                }
            }
        }
    }
}

function getMaxLevel(word: string, charToLevel: CharToLevelMap): number {
    let maxLevel = 0;

    for (const char of word) {
        if (!(char in charToLevel)) {
            console.error(`Error: Character '${char}' in word '${word}' not found in keyboard layout`);
            process.exit(1);
        }

        const level = charToLevel[char];
        if (level > maxLevel) {
            maxLevel = level;
        }
    }

    return maxLevel;
}

// Generate all permutations of an array
function permute<T>(arr: T[]): T[][] {
    if (arr.length <= 1) return [arr];

    const result: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const perms = permute(rest);
        for (const perm of perms) {
            result.push([arr[i], ...perm]);
        }
    }
    return result;
}

// Repeat a string pattern to length 5
function repeatToLength5(pattern: string): string {
    let result = '';
    let i = 0;
    while (result.length < 5) {
        result += pattern[i % pattern.length];
        i++;
    }
    return result;
}

// Build a map from level to all characters at that level (lowercase)
// If noShift is true, only include the first character from each key
function buildLevelToCharsMap(charToLevel: CharToLevelMap, layout: string[][], noShift: boolean): Map<number, Set<string>> {
    const levelToChars = new Map<number, Set<string>>();

    if (noShift) {
        // Only include first character from each key
        for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
            const row = layout[rowIndex];
            const levelRow = keyLevels[rowIndex];

            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const keyChars = row[colIndex];
                const level = levelRow[colIndex];

                if (keyChars.length > 0 && keyChars[0] !== ' ') {
                    const firstChar = keyChars[0].toLowerCase();
                    if (!levelToChars.has(level)) {
                        levelToChars.set(level, new Set<string>());
                    }
                    levelToChars.get(level)!.add(firstChar);
                }
            }
        }
    } else {
        // Include all characters
        for (const char in charToLevel) {
            const level = charToLevel[char];
            const lowerChar = char.toLowerCase();

            if (!levelToChars.has(level)) {
                levelToChars.set(level, new Set<string>());
            }
            levelToChars.get(level)!.add(lowerChar);
        }
    }

    return levelToChars;
}

// Check which characters at a level are covered by the words in the bucket
function getCoveredChars(bucket: Set<string>): Set<string> {
    const covered = new Set<string>();
    for (const word of bucket) {
        for (const char of word.toLowerCase()) {
            covered.add(char);
        }
    }
    return covered;
}

// Add practice strings to ensure full character coverage at a level
function addCoverageStrings(bucket: Set<string>, levelChars: Set<string>): void {
    const covered = getCoveredChars(bucket);
    const allChars = Array.from(levelChars);

    // Check if any characters are missing
    let hasMissing = false;
    for (const char of allChars) {
        if (!covered.has(char)) {
            hasMissing = true;
            break;
        }
    }

    // If any character is missing, add permutations of all characters at this level
    if (hasMissing) {
        const perms = permute(allChars);
        for (const perm of perms) {
            const practiceString = repeatToLength5(perm.join(''));
            bucket.add(practiceString);
        }
    }
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    // Parse options
    let layoutName = 'qwerty';
    let fullCoverage = false;
    let noShift = false;
    for (const arg of args) {
        if (arg.startsWith('--layout=')) {
            layoutName = arg.substring('--layout='.length).toLowerCase();
        } else if (arg === '--full-coverage') {
            fullCoverage = true;
        } else if (arg === '--no-shift') {
            noShift = true;
        }
    }

    // Select layout
    let layout: string[][];
    if (layoutName === 'qwerty') {
        layout = qwertyLayout;
    } else if (layoutName === 'dvorak') {
        layout = dvorakLayout;
    } else {
        console.error(`Error: Unknown layout '${layoutName}'. Valid options: qwerty, dvorak`);
        process.exit(1);
    }

    // Validate layout
    validateLayout(layout, layoutName);

    // Build character to level mapping
    const charToLevel = buildCharToLevelMap(layout);

    // Build shifted punctuation set (for --no-shift filtering)
    const shiftedPunct = buildShiftedPunctuationSet(layout);

    // Build level to characters mapping (for full coverage)
    const levelToChars = buildLevelToCharsMap(charToLevel, layout, noShift);

    // Initialize buckets for levels 1-24 (index 0 = level 1, index 23 = level 24)
    const buckets: Set<string>[] = [];
    for (let i = 0; i < 24; i++) {
        buckets.push(new Set<string>());
    }

    // Read words from stdin
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    for await (const line of rl) {
        const word = line.trim();
        if (word.length === 0) {
            continue;
        }

        const maxLevel = getMaxLevel(word, charToLevel);
        // Store in bucket at index (level - 1) since we're only storing levels 1-24
        if (maxLevel >= 1 && maxLevel <= 24) {
            buckets[maxLevel - 1].add(word);
        }
    }

    // Filter out words with shifted punctuation if --no-shift is enabled
    if (noShift) {
        for (let i = 0; i < buckets.length; i++) {
            const filtered = new Set<string>();
            for (const word of buckets[i]) {
                if (!containsShiftedPunctuation(word, shiftedPunct)) {
                    filtered.add(word);
                }
            }
            buckets[i] = filtered;
        }
    }

    // Add coverage strings if requested
    if (fullCoverage) {
        for (let level = 1; level <= 24; level++) {
            const bucketIndex = level - 1;
            const levelChars = levelToChars.get(level);
            if (levelChars && levelChars.size > 0) {
                addCoverageStrings(buckets[bucketIndex], levelChars);
            }
        }
    }

    // Convert sets to sorted arrays and output as JSON
    const result = buckets.map(bucket => Array.from(bucket).sort());
    console.log(JSON.stringify(result));
}

if (require.main === module) {
    main().catch(error => {
        console.error(`Error: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    });
}

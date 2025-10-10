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
  --layout=<name>  Keyboard layout to use (qwerty or dvorak). Default: qwerty
  --help           Show this help message

Example:
  extract-words input.txt | bucket-words --layout=dvorak`);
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

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    // Parse layout option
    let layoutName = 'qwerty';
    for (const arg of args) {
        if (arg.startsWith('--layout=')) {
            layoutName = arg.substring('--layout='.length).toLowerCase();
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

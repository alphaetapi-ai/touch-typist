#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';

function showHelp(): void {
    console.log(`Usage: extract-words <input-file>

Description:
  Reads a text file and extracts all unique words.
  - Splits each line on spaces
  - For words containing non-alphabetic characters (punctuation, numbers, underscores),
    saves both the original word and the stripped version (alphabetic only)
  - Outputs each unique word (one per line)

Arguments:
  input-file   Path to the input file to read

Options:
  --help       Show this help message

Example:
  extract-words input.txt`);
}

function extractWords(content: string): Set<string> {
    const words = new Set<string>();
    const lines = content.split('\n');

    for (const line of lines) {
        // Split on spaces
        const tokens = line.split(' ');

        for (const token of tokens) {
            // Skip empty tokens
            if (token.length === 0) {
                continue;
            }

            // Add the original word
            words.add(token);

            // Check if the word contains non-alphabetic characters
            if (/[^a-zA-Z]/.test(token)) {
                // Strip non-alphabetic characters only from the beginning and end
                const stripped = token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');

                // Only add the stripped version if:
                // 1. It's not empty
                // 2. It's different from the original
                // 3. It contains ONLY alphabetic characters (no punctuation in the middle)
                if (stripped.length > 0 && stripped !== token && /^[a-zA-Z]+$/.test(stripped)) {
                    words.add(stripped);
                }
            }
        }
    }

    return words;
}

function main(): void {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    if (args.length !== 1) {
        console.error('Error: Expected exactly 1 argument');
        console.error('Use --help for usage information');
        process.exit(1);
    }

    const inputFile = args[0];

    if (!existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' does not exist`);
        process.exit(1);
    }

    try {
        const content = readFileSync(inputFile, 'utf-8');
        const words = extractWords(content);

        // Sort and print each unique word
        const sortedWords = Array.from(words).sort();
        for (const word of sortedWords) {
            console.log(word);
        }

    } catch (error) {
        console.error(`Error processing file: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

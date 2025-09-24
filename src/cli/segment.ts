#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';

function showHelp(): void {
    console.log(`Usage: segment <input-file> <output-file>

Description:
  Reads a file line-by-line and segments each line into five-word blocks.
  A word is a sequence of non-space characters separated by one or more spaces.
  Lines with fewer than 5 words are printed unchanged.

Arguments:
  input-file   Path to the input file to read
  output-file  Path to the output file to write

Options:
  --help       Show this help message

Example:
  segment input.txt output.txt`);
}

function segmentLine(line: string): string[] {
    const words = line.trim().split(/\s+/).filter(word => word.length > 0);

    if (words.length < 5) {
        return [line];
    }

    const segments: string[] = [];
    for (let i = 0; i < words.length; i += 5) {
        const segment = words.slice(i, i + 5).join(' ');
        segments.push(segment);
    }

    return segments;
}

function main(): void {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    if (args.length !== 2) {
        console.error('Error: Expected exactly 2 arguments');
        console.error('Use --help for usage information');
        process.exit(1);
    }

    const [inputFile, outputFile] = args;

    if (!existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' does not exist`);
        process.exit(1);
    }

    try {
        const content = readFileSync(inputFile, 'utf-8');
        const lines = content.split('\n');
        const outputLines: string[] = [];

        for (const line of lines) {
            const segments = segmentLine(line);
            outputLines.push(...segments);
        }

        writeFileSync(outputFile, outputLines.join('\n'));

    } catch (error) {
        console.error(`Error processing files: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
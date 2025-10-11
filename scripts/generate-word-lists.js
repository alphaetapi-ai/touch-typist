#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = 'practice-files/english.txt';
const OUTPUT_DIR = 'src/data';
const TEMP_WORDS_FILE = 'temp-words.txt';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Generating word lists from', INPUT_FILE);

// Step 1: Extract words from the input file
console.log('Step 1: Extracting words...');
execSync(`node dist/cli/extract-words.js ${INPUT_FILE} > ${TEMP_WORDS_FILE}`);

// Step 2: Generate buckets for all 4 combinations
const configurations = [
    { layout: 'qwerty', shift: true, name: 'qwertyShift' },
    { layout: 'qwerty', shift: false, name: 'qwertyNoShift' },
    { layout: 'dvorak', shift: true, name: 'dvorakShift' },
    { layout: 'dvorak', shift: false, name: 'dvorakNoShift' }
];

console.log('Step 2: Generating word buckets for all configurations...');

const wordLists = {};

for (const config of configurations) {
    console.log(`  - Generating ${config.name}...`);

    const shiftFlag = config.shift ? '' : '--no-shift';
    const command = `cat ${TEMP_WORDS_FILE} | node dist/cli/bucket-words.js --layout=${config.layout} ${shiftFlag} --full-coverage`;

    const output = execSync(command, { encoding: 'utf-8' });
    wordLists[config.name] = JSON.parse(output);
}

// Step 3: Generate TypeScript file
console.log('Step 3: Generating TypeScript source file...');

const tsContent = `// Auto-generated file - do not edit manually
// Generated from ${INPUT_FILE}
// Run 'npm run build' to regenerate

export interface WordLists {
    qwertyShift: string[][];
    qwertyNoShift: string[][];
    dvorakShift: string[][];
    dvorakNoShift: string[][];
}

export const wordLists: WordLists = ${JSON.stringify(wordLists, null, 2)};
`;

const outputPath = path.join(OUTPUT_DIR, 'wordLists.ts');
fs.writeFileSync(outputPath, tsContent);

// Clean up temp file
fs.unlinkSync(TEMP_WORDS_FILE);

console.log(`✓ Word lists generated successfully: ${outputPath}`);
console.log(`  - qwertyShift: ${wordLists.qwertyShift.filter(l => l.length > 0).length} levels with words`);
console.log(`  - qwertyNoShift: ${wordLists.qwertyNoShift.filter(l => l.length > 0).length} levels with words`);
console.log(`  - dvorakShift: ${wordLists.dvorakShift.filter(l => l.length > 0).length} levels with words`);
console.log(`  - dvorakNoShift: ${wordLists.dvorakNoShift.filter(l => l.length > 0).length} levels with words`);

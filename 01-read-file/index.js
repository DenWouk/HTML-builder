const fs = require('fs');
const path = require('path');

const { stdout } = process;
const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
let data = '';

stream.on('data', (chank) => (data += chank));
stream.on('error', (error) => stdout.write('\nError:', error.message));
stream.on('end', () => stdout.write(`\n${data}`));

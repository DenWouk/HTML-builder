const fs = require('fs');
const path = require('path');
const { readdir, writeFile } = require('fs/promises');
const chalk = require('chalk');

const { stdout } = process;

const inputPath = path.resolve(__dirname, 'styles');
const outputPath = path.resolve(__dirname, 'project-dist');

async function mergeStyles(input, output) {
  try {
    const files = await readdir(input, { withFileTypes: true });
    const bundle = [];

    for (let file of files) {
      const fileExtension = path.extname(path.resolve(input, file.name));

      if (file.isFile() && fileExtension === '.css') {
        const styles = fs.createReadStream(path.resolve(input, file.name));

        for await (let style of styles) {
          bundle.push(style);
        }
      }
    }
    await writeFile(path.resolve(output, 'bundle.css'), bundle.join('\n'));

    stdout.write(chalk.bold('\nFile "bundle.css" successfully created!\n'));
  } catch (error) {
    stdout.write(chalk.bold('\nError:', error.message));
  }
}
mergeStyles(inputPath, outputPath);

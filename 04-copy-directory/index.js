const path = require('path');
const { mkdir, readdir, unlink, copyFile } = require('fs/promises');
const chalk = require('chalk');

const { stdout } = process;

const folderPath = path.resolve(__dirname, 'files');
const folderCopyPath = path.resolve(__dirname, 'files-copy');

async function copyFolder(input, output) {
  try {
    await mkdir(output, { recursive: true });

    const inputData = await readdir(input);
    const outputData = await readdir(output);

    outputData.forEach((file) => unlink(path.resolve(output, file)));
    inputData.forEach((file) => copyFile(path.resolve(input, file), path.resolve(output, file)));

    stdout.write(chalk.bold('\nFiles successfully copied to "files-copy" folder!\n'));
  } catch (error) {
    stdout.write(chalk.bold('\nError:', error.message));
  }
}
copyFolder(folderPath, folderCopyPath);

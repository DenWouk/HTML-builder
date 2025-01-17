const path = require('path');
const { readdir, stat } = require('fs/promises');

const { stdout } = process;
const folderPath = path.resolve(__dirname, 'secret-folder');

async function getFolderFiles(folder) {
  try {
    const files = await readdir(folder, { withFileTypes: true });

    stdout.write(`\n${path.parse(folder).name} contains:\n`);

    for (let file of files) {
      if (file.isFile()) {
        const data = await stat(path.resolve(folder, file.name));

        stdout.write(
            `
            ${path.parse(file.name).name} | ${path.parse(file.name).ext.slice(1)} | ${Math.ceil(data.size / 1024)} KB
            `
        );
      }
    }
  } catch (error) {
    stdout.write('\nError: ', error.message);
  }
}
getFolderFiles(folderPath);

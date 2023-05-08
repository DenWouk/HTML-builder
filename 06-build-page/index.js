const fs = require('fs');
const path = require('path');
const { readFile, writeFile, readdir, mkdir, copyFile, rm } = require('fs/promises');
const chalk = require('chalk');

const { stdout } = process;

const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const assetsPath = path.resolve(__dirname, 'assets');
const templatePath = path.resolve(__dirname, 'template.html');
const outputFolderPath = path.resolve(__dirname, 'project-dist');
const outputCssPath = path.resolve(outputFolderPath, 'style.css');
const outputAssetsPath = path.resolve(outputFolderPath, 'assets');

async function useTemplate(input, output, parts) {
  try {
    let template = await readFile(input, 'utf8');
    const templateTags = template.match(/{{\w+}}/g);
    const componentsTags = templateTags.map((el) => readFile(path.resolve(parts, `${el.slice(2, -2)}.html`)));
    const insertTags = await Promise.all(componentsTags);

    insertTags.forEach((el) => (template = template.replace(/{{\w+}}/, el)));

    await writeFile(path.resolve(output, 'index.html'), template, 'utf8');
  } catch (error) {
    stdout.write(chalk.bold('\nError:', error.message));
  }
}

async function mountCss(input, output) {
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
    await writeFile(path.resolve(output), bundle.join('\n'));
  } catch (error) {
    stdout.write(chalk.bold('\nError:', error.message));
  }
}

async function copyAssets(input, output) {
  try {
    const elements = await readdir(input, { withFileTypes: true });
    await mkdir(output, { recursive: true });

    for (let element of elements) {
      if (element.isFile()) {
        await copyFile(path.resolve(input, element.name), path.resolve(output, element.name));
      }
      if (element.isDirectory()) {
        await mkdir(path.resolve(output, element.name));
        await copyAssets(path.resolve(input, element.name), path.resolve(output, element.name));
      }
    }
  } catch (error) {
    stdout.write(chalk.bold('\nError:', error.message));
  }
}

async function mountPage() {
  await rm(outputFolderPath, { recursive: true, force: true });

  useTemplate(templatePath, outputFolderPath, componentsPath);
  mountCss(stylesPath, outputCssPath);
  copyAssets(assetsPath, outputAssetsPath);

  stdout.write(
    chalk.bold('\nThe page components have been successfully mounted and placed in the "project-dist" folder!\n')
  );
}
mountPage();

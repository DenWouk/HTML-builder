const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { stdin, stdout, exit } = process;
const output = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

stdout.write(chalk.bold('\nHello! Enter your text and press enter.\nFor exit: press Ctrl+C or write "exit".\n\n'));

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  output.write(data);
});

process.on('error', (error) => stdout.write('\nError', error.message));
process.on('SIGINT', exit);
process.on('exit', () => stdout.write(chalk.bold('\nYour text is written to file: "text.txt". \nGood Bye!\n')));

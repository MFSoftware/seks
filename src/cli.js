#!/usr/bin/env node

const readlineSync = require('readline-sync');
const { spawn } = require('child_process');

const Manager = require('./classes/Manager');
const TerminalManager = require('./classes/TerminalManager');

const password = readlineSync.question('Password: ', {
    hideEchoBack: true,
    mask: ''
});
console.log();

const args = process.argv.slice(2, process.argv.length);

if (args.length == 0) {
    const cwd = process.cwd();

    let manager = new Manager({ password });
    let commandManager = new TerminalManager;

    commandManager.addCommand('help', () => {
        console.log('hello');
    });

    commandManager.addCommand('set', (key, value) => {
        manager.set(key, value);
    });

    commandManager.addCommand('exit', () => {
        console.log('bye');
        process.exit();
    });

    while (true) {
        let command = readlineSync.question('> ');
        commandManager.parse(command);
    }
}

let app = args[0];
args.shift();

const command = spawn(app, args, {
    env: { SEKS_PASSWORD: password }
});

command.stdout.setEncoding('utf8');
command.stdout.on('data', (data) => {
    console.log(data);
});

command.stderr.on('data', (data) => {
    console.error('Error: ' + data);
});

command.on('close', (code) => {
    process.exit();
});
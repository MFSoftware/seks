#!/usr/bin/env node

const readlineSync = require('readline-sync');
const { spawn } = require('child_process');

let password = readlineSync.question('Password: ', {
    hideEchoBack: true,
    mask: ''
});

const args = process.argv.slice(2, process.argv.length);
let app = args[0];
args.shift();

const command = spawn(app, args, {
    env: {
        SEKS_PASSWORD: password
    }
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
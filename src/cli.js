#!/usr/bin/env node

const readlineSync = require('readline-sync');
const { spawn } = require('child_process');
const { getDirectories } = require('./fs');

const Manager = require('./classes/Manager');
const { TerminalManager } = require('./libs/terminal');

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
        let msg = '';

        let names = Object.getOwnPropertyNames(commandManager.list);
        names.shift(); // Removes 'length' property of Array

        for (let i = 0; i < names.length; i++)
            msg += ` ${names[i]}`;

        console.log(msg);
    });

    commandManager.addCommand('exists', key => {
        console.log(manager.exists(key));
    });

    commandManager.addCommand('set', (key, value) => {
        manager.set(key, value);
    });

    commandManager.addCommand('get', key => {
        console.log(manager.get(key));
    });

    commandManager.addCommand('show', key => {
        switch(key) {
            case 'dbs':
                let dirs = getDirectories('seks/storage');
                console.log(dirs);
                break;
            case 'users':
                break;
            case 'keys':
                if (manager.database != '') 1;
                else console.warn('Database is not selected');
                break;
        }
    });

    commandManager.addCommand('update', (key, value) => {
        manager.update(key, value);
    });

    commandManager.addCommand('use', database => {
        manager.use(database);
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
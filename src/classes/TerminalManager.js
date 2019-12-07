const Command = require('./Command');

module.exports = class TerminalManager {
    constructor() {
        this.list = [];
    }

    addCommand(text, command) {
        if (!(command instanceof Command))
            throw new TypeError('command must be Command type');

        this.list[text] = command;
    }

    addCommand(command, callback) {
        this.list[command] = new Command({ count: callback.length, callback });
    }

    parse(command) {
        let args = command.toLowerCase().trim().split(' ');

        if (args.length >= 1) {
            let obj = this.list[args[0]];

            if (obj == undefined) throw new Error('Command not found');

            let callbackArgs = args.slice(1, args.length);

            if (callbackArgs.length == obj.count)
                obj.callback.apply(this, callbackArgs);
            else throw new Error('Not valid args count');
        }
        else throw new Error('Not valid command');
    }
}
const validator = require('validator').default;
const aes256 = require('aes256');
const sha256 = require('sha256');

const {
    exists,
    read,
    write
} = require('../fs');

module.exports = class Manager {
    constructor(options = {}) {
        const isEnv = process.env.SEKS_PASSWORD != undefined;
        const notOptions = options.password == undefined;

        let mode = isEnv ? 1 : 0;

        if (mode == 0 && notOptions)
            throw new Error('Password must be defined');

        if (mode == 0 && notOptions)
            throw new Error('Execute process with seks cli tool');
        else if (mode == 1) this.password = process.env.SEKS_PASSWORD;

        Object.assign(this, options);

        this.password = sha256(this.password);
    }

    get(key) {
        const path = `seks/storage/${sha256(key)}`;

        if (exists(path)) { // Key exists
            let content = read(path);
            content = aes256.decrypt(this.password, content);

            if (validator.isJSON(content)) return JSON.parse(content);
            else return content;
        }
        else throw new Error('Item with current key is not exists');
    }

    exists(key) {
        return exists(`seks/storage/${sha256(key)}`);
    }

    set(key, value) {
        const path = `seks/storage/${sha256(key)}`;

        if (exists(path)) throw new Error('Key already exists');
        else {
            let content = value;

            if (value instanceof Object)
                content = JSON.stringify(content);

            content = aes256.encrypt(this.password, content);
            
            write(path, content);
        }
    }

    update(key, value) {
        const path = `seks/storage/${sha256(key)}`;

        if (exists(path)) {
            let content = value;

            if (value instanceof Object)
                content = JSON.stringify(content);

            let textBytes = aesjs.utils.utf8.toBytes(content);
            let aesCtr = new aesjs.ModeOfOperation.ctr(this.password, new aesjs.Counter(5));
            let encryptedBytes = aesCtr.encrypt(textBytes);
            
            let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            
            write(path, encryptedHex);
        }
        else throw new Error('Key not found');
    }
}
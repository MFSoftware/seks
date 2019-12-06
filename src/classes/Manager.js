const validator = require('validator').default;
const aesjs = require('aes-js');
const sha256 = require('sha256');

const {
    exists,
    read,
    write
} = require('../fs');

function passwordToUtf8Array(str) {
    let utf8 = [];

    for (let i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        else {
            i++;
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

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

        if (typeof this.password == 'string')
            this.password = passwordToUtf8Array(this.password);
    }

    get(key) {
        const path = `seks/storage/${sha256(key)}`;
        if (exists(path)) { // Key exists
            let content = read(path);
            content = aesjs.utils.hex.toBytes(content);

            let aesCtr = new aesjs.ModeOfOperation.ctr(this.password, new aesjs.Counter(5));
            content = aesCtr.decrypt(content);
            content = aesjs.utils.utf8.fromBytes(content);

            if (validator.isJSON(content)) return JSON.parse(content);
            else return content;
        }
        else throw new Error('Key not exists');
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

            let textBytes = aesjs.utils.utf8.toBytes(content);
            let aesCtr = new aesjs.ModeOfOperation.ctr(this.password, new aesjs.Counter(5));
            let encryptedBytes = aesCtr.encrypt(textBytes);
            
            let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
            
            write(path, encryptedHex);
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
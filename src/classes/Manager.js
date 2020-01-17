const validator = require('validator').default;
const fs = require('fs');
const fse = require('fs-extra');

const aes256 = require('../libs/aes256');
const { sha256 } = require('../libs/hash');

module.exports = class Manager {
    constructor(options = {}) {
        const isEnv = process.env.SEKS_PASSWORD != undefined;
        const hasPassword = options.password != undefined;
        const hasDatabase = options.database != undefined;

        let mode = isEnv ? 1 : 0;

        if (mode == 0 && !hasPassword)
            throw new Error('Password must be defined');

        if (mode == 0 && !hasPassword)
            throw new Error('Execute process with seks cli tool');
        else if (mode == 1) this.password = process.env.SEKS_PASSWORD;

        if (!hasDatabase) options.database = '';

        Object.assign(this, options);

        if (this.database != '') this.use(this.database);

        this.password = sha256(this.password);
    }

    get(key) {
        const path = `seks/storage/${this.database}/${sha256(key, 'hex')}`;

        if (fs.existsSync(path)) {
            let content = fs.readFileSync(path, { encoding: 'utf8' });
            content = aes256.decrypt(this.password, content);

            if (validator.isJSON(content)) return JSON.parse(content);
            else return content;
        }
        else throw new Error('Item with current key is not exists');
    }

    exists(key) {
        return fs.existsSync(`seks/storage/${this.database}/${sha256(key, 'hex')}`);
    }

    set(key, value) {
        const path = `seks/storage/${this.database}/${sha256(key, 'hex')}`;

        if (fs.existsSync(path)) throw new Error('Key already exists');
        else {
            let content = value;

            if (value instanceof Object)
                content = JSON.stringify(content);

            content = aes256.encrypt(this.password, content);
                
            fs.writeFileSync(path, content, { encoding: 'utf8' });
        }
    }

    update(key, value) {
        const path = `seks/storage/${this.database}/${sha256(key, 'hex')}`;

        if (fs.existsSync(path)) {
            let content = value;

            if (value instanceof Object)
                content = JSON.stringify(content);

            content = aes256.encrypt(this.password, content);
            
            fse.writeFileSync(path, content, { encoding: 'utf8' });
        }
        else throw new Error('Key not found');
    }

    use(database) {
        const path = `seks/storage/${database}/`;

        fse.ensureDir(path);

        if (this.database == '') this.database = database;

        return this;
    }
}
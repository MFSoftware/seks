const fs = require('fs');

function exists(path) {
    return fs.existsSync(path);
}

function write(path, content) {
    fs.writeFileSync(path, content, { encoding: 'utf8' }); 
}

function createDir(path) {
    fs.mkdirSync(path);
}

function read(path) {
    return fs.readFileSync(path, 'utf8');
}

module.exports = {
    exists,
    write,
    read,
    createDir
};
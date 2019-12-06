const fs = require('fs');

function exists(path) {
    return fs.existsSync(path);
}

function write(path, content) {
    fs.writeFile(path, content, err => {
        if (err) throw err;
    }); 
}

function read(path) {
    return fs.readFileSync(path, 'utf8');
}

module.exports = {
    exists,
    write,
    read
};
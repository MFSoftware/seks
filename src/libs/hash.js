const crypto = require('crypto');

/**
 * Hash function
 * @param {string} str Input str
 * @returns {Buffer|string}
 */
function sha256(str, encoding = undefined) {
    return crypto.createHash('sha256').update(str).digest(encoding);
}

module.exports = {
    sha256
}
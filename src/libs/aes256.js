const crypto = require('crypto');
const cryptiles = require('@hapi/cryptiles');

/**
 * Encryption function
 * @param {Buffer} key Encryption key
 * @param {string} str Input str
 */
function encrypt(key, str) {
    const iv = Buffer.from(cryptiles.randomString(16));
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let ciphertext  = cipher.update(str);
    return Buffer.concat([ iv, ciphertext , cipher.final() ]).toString('base64');
}

/**
 * Decryption function
 * @param {Buffer} key Encryption key
 * @param {string} str Input str
 */
function decrypt(key, str) {
    let input = Buffer.from(str, 'base64');

    const iv = input.slice(0, 16);
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let ciphertext = input.slice(16);
    let decrypted = decipher.update(ciphertext);
    return Buffer.concat([ decrypted, decipher.final() ]).toString('utf8');
}

module.exports = {
    encrypt,
    decrypt
}
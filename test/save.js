const { Manager } = require('../index');

let test = new Manager({  
    password: 'superStrongEncryptionKey'
});

test.set('test', 'hello world');

setTimeout(() => {
    console.log(test.get('test'));
}, 2000);
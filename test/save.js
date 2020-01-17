const { Manager } = require('../index');

let storage = new Manager({
    password: 'some'
});
storage.use('test');

setTimeout(() => {
    console.log(storage.get('w'));
}, 2000);
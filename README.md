# seks
Secure Key Storage

## Install
```bash
npm i seks -g
```
or core
```bash
npm i seks --save
```

## Run
```bash
seks [app] [options]
```

## Examples
```javascript
const { Manager } = require('seks');

let db = new Manager({
    password: 'youKey'
});

db.set('one', 'echo');

setTimeout(() => {
    console.log(db.get('one'));
}, 2000);
```

## License
MIT
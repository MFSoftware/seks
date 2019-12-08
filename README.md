# seks
Secure Key Storage

## Install
**cli** tool globaly
```bash
npm i seks -g
```
or **core**
```bash
npm i seks --save
```

## Run
Start app with support of seks using cli interface
```bash
seks [command]
```
Also you can start it in terminal mode
```bash
seks
```

## Examples
### Simple example
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

### Using CLI tool
**Notice**: You must not pass params to class constructor. Write it to *test.js*.
```javascript
const { Manager } = require('seks');

let db = new Manager;

db.set('one', 'echo');

setTimeout(() => {
    console.log(db.get('one'));
}, 2000);
```
and start it
```bash
seks node test.js
```

## CLI
Methods:

1. help
2. set
3. get
4. update
5. version

## License
MIT
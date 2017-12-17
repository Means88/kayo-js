# Kayo [![npm version](https://badge.fury.io/js/kayo-js.svg)](https://badge.fury.io/js/kayo-js)

## Install
```sh
npm install kayo-js
```

## Example

### Queue

```js
const Queue = require('../lib/queue');

function taskA(arg) {
  console.log(`taskA(${arg})`);
  return 'result of A';
}

function taskB(arg) {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  }).then(() => {
    console.log(`taskB(${arg})`);
    return 'result of B';
  });
}

async function taskC(arg) {
  console.log(`taskC(${arg})`);
  return 'result of C';
}

function taskD(arg) {
  console.log(`taskD(${arg})`);
  return 'result of D';
}

const queue = new Queue();
queue.push(taskA);
queue.push(taskB);
queue.push(taskC);
setTimeout(() => {
  queue.push(taskD);
}, 1000);
```

output

```
taskA(null)
taskB(result of A)
taskC(result of B)
taskD(result of C)
```

### Slot

```js
const Slot = require('../lib/slot');

const slot = new Slot();
slot.initialize(['a', 'b', 'c'], (values) => {
  console.log('fulfilled:\n', JSON.stringify(values, null, 2));
});

setTimeout(() => {
  slot.fill('a', 'value of a');
  console.log('fill a');
}, 20);

setTimeout(() => {
  slot.fill('b', 'value of b');
  console.log('fill b');
}, 0);

slot.fill('c', 'value of c');
console.log('fill c');
```

output

```
fill c
fill b
fill a
fulfilled:
 {
  "keys": [
    "a",
    "b",
    "c"
  ],
  "values": {
    "c": "value of c",
    "b": "value of b",
    "a": "value of a"
  }
}
```

## API

### Queue
Run task by order asynchronously.

#### constructor()
Create a queue.

#### push(task: Function): void
Push a task into queue.

##### task
```js
task(void): void
```

### Slot
Create a slot and run callback after all slot keys are filled.

#### constructor()
Create a slot.

#### initialize(keys: Array<String>, callback: Function, onCancel: Function)
Initialize the slot.

##### keys
Array of keys

##### callback
Receive slot keys and the value filled with.
```js
callback({ keys: [], values: {} })
```

##### onCancel
Receive the message passing to `cancel` function.
```js
onCancel(message)
```

### fill(key: String, value: any)
Fill slot with value.

### cancel(message: any)
Cancel the slot and trigger `onCancel` function.

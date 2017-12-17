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

/**
 * fill c
 * fill b
 * fill a
 * fulfilled:
 * {
 *  "keys": [
 *    "a",
 *    "b",
 *    "c"
 *  ],
 *  "values": {
 *    "c": "value of c",
 *    "b": "value of b",
 *    "a": "value of a"
 *  }
 * }
 */

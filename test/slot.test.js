/* global: describe, it */
const { describe, it } = require('mocha');
const expect = require('expect');
const Slot = require('../lib/slot');
const { delay } = require('./utils');

describe('Slot', () => {
  it('should be fulfilled', (done) => {
    const slot = new Slot();
    slot.initialize(['a', 'b', 'c'], () => {
      done();
    });
    slot.fill('a');
    Promise.resolve('').then(() => {
      slot.fill('b');
    });
    setTimeout(() => {
      slot.fill('c');
    }, 10);
  });

  it('should have correct values', (done) => {
    const slot = new Slot();
    slot.initialize(['a'], (values) => {
      expect(values['keys'].length).toEqual(1);
      expect(values['keys'][0]).toEqual('a');
      expect(values['values']['a']).toEqual('value of a');
      done();
    });
    slot.fill('a', 'value of a');
  });

  it('should be canceled', (done) => {
    const slot = new Slot();
    slot.initialize(['a', 'b'], null, (message) => {
      expect(message).toEqual('cancel');
      done();
    });
    slot.fill('a');
    slot.cancel('cancel');
  });
});


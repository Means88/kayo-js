/* global: describe, it */
const { describe, it } = require('mocha');
const expect = require('expect');
const Queue = require('../lib/queue');
const { TaskFactory, delay } = require('./utils');

describe('Queue', () => {
  it('should be executed by order', () => {
    const queue = new Queue();
    const factory = new TaskFactory();

    return new Promise((resolve) => {
      const a = factory.createAsyncTask('a', 10);
      const b = factory.createSyncTask('b', resolve);
      queue.push(a);
      queue.push(b);
    }).then(() => {
      expect(factory.logs[0].key).toEqual('a');
      expect(factory.logs[1].key).toEqual('b');
    });
  });

  it('sync task should be executed by order', () => {
    const queue = new Queue();
    const factory = new TaskFactory();

    return new Promise((resolve) => {
      const a = factory.createSyncTask('a');
      const b = factory.createSyncTask('b', resolve);
      queue.push(a);
      queue.push(b);
    }).then(() => {
      expect(factory.logs[0].key).toEqual('a');
      expect(factory.logs[1].key).toEqual('b');
    });
  });

  it('complex tasks should be executed by order', () => {
    const queue = new Queue();
    const factory = new TaskFactory();

    return new Promise((resolve) => {
      const a = factory.createAsyncTask('a', 10);
      const b = factory.createSyncTask('b');
      const c = factory.createAsyncTask('c', 200);
      const d = factory.createSyncTask('d', resolve);
      queue.push(a);
      queue.push(b);
      queue.push(c);
      queue.push(d);
    }).then(() => {
      expect(factory.logs[0].key).toEqual('a');
      expect(factory.logs[1].key).toEqual('b');
      expect(factory.logs[2].key).toEqual('c');
      expect(factory.logs[3].key).toEqual('d');

      expect(factory.logs[0].arg).toBe(null);
      expect(factory.logs[1].arg).toEqual('a');
      expect(factory.logs[2].arg).toEqual('b');
      expect(factory.logs[3].arg).toEqual('c');
    }).then(() => {
      return new Promise((resolve) => {
        const e = factory.createSyncTask('e', resolve);
        queue.push(e);
      });
    }).then(() => {
      expect(factory.logs[4].key).toEqual('e');
      expect(factory.logs[4].arg).toEqual('d');
    });
  });
});

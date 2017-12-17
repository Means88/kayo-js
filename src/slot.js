const noop = () => undefined;

export default class Slot {
  constructor() {
    this.fulfilled = true;
  }

  initialize(keys, callback, onCancel = noop) {
    if (!this.fulfilled) {
      this.cancel('interrupted');
    }
    this.fulfilled = false;
    const cancelPromise = new Promise((_, reject) => {
      this._cancel = reject;
    });

    const slotPromiseList = [];
    this._keys = keys;
    this._resolver = {};
    this._values = {};
    for (const key of keys) {
      const promise = new Promise((resolve) => {
        this._resolver[key] = resolve;
      });
      slotPromiseList.push(promise);
    }
    const fulfillPromise = Promise.all(slotPromiseList).then((keys) => {
      this.fulfilled = true;
      return {
        keys,
        values: this._values,
      };
    });

    Promise.race([cancelPromise, fulfillPromise])
      .then(callback)
      .catch(onCancel);
  }

  cancel(message) {
    this._cancel(message);
  }

  fill(key, value) {
    if (this._keys.indexOf(key) === -1) {
      throw new Error(`The key "${key}" are not defined by "initialize" method.`)
    }
    this._values[key] = value;
    this._resolver[key].call(null, key);
  }
}

export default class Queue {
  constructor() {
    this._queue = [];
    this._prevResult = null;
  }

  _wrapTask(task) {
    return () => {
      let result = task.call(null, this._prevResult);
      if (!(result instanceof Promise)) {
        result = Promise.resolve(result);
      }
      return result.then((data) => {
        this._queue.shift();
        this._prevResult = data;
        this._executeNextTask();
      });
    };
  }

  get lastTask() {
    return this._queue[this._queue.length - 1];
  }

  get empty() {
    return this._queue.length === 0;
  }

  push(task) {
    const wrappedTask = this._wrapTask(task);
    const empty = this.empty;
    this._queue.push(wrappedTask);
    if (empty) {
      this._executeNextTask();
    }
  }

  _executeNextTask() {
    if (this.empty) {
      return;
    }
    const task = this._queue[0];
    task();
  }

}

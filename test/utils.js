function delay(time) {
  return new Promise((r) => {
    setTimeout(r, time);
  })
}

class TaskFactory {
  constructor() {
    this.logs = [];
  }

  createSyncTask(key, callback) {
    return (arg) => {
      this.logs.push({ key, arg });
      delay(0).then(() => {
        callback && callback.call(null, key);
      });
      return key;
    };
  }

  createAsyncTask(key, time = 0, callback = null) {
    return (arg) => {
      return delay(time).then(() => {
        this.logs.push({ key, arg });
        return key;
      }).then((key) => {
        callback && callback(key);
        return key;
      });
    };
  }
}

exports.delay = delay;
exports.TaskFactory = TaskFactory;

module.exports = exports;

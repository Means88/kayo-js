"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Queue = function () {
  function Queue() {
    (0, _classCallCheck3.default)(this, Queue);

    this._queue = [];
    this._prevResult = null;
  }

  (0, _createClass3.default)(Queue, [{
    key: "_wrapTask",
    value: function _wrapTask(task) {
      var _this = this;

      return function () {
        var result = task.call(null, _this._prevResult);
        if (!(result instanceof _promise2.default)) {
          result = _promise2.default.resolve(result);
        }
        return result.then(function (data) {
          _this._queue.shift();
          _this._prevResult = data;
          _this._executeNextTask();
        });
      };
    }
  }, {
    key: "push",
    value: function push(task) {
      var wrappedTask = this._wrapTask(task);
      var empty = this.empty;
      this._queue.push(wrappedTask);
      if (empty) {
        this._executeNextTask();
      }
    }
  }, {
    key: "_executeNextTask",
    value: function _executeNextTask() {
      if (this.empty) {
        return;
      }
      var task = this._queue[0];
      task();
    }
  }, {
    key: "lastTask",
    get: function get() {
      return this._queue[this._queue.length - 1];
    }
  }, {
    key: "empty",
    get: function get() {
      return this._queue.length === 0;
    }
  }]);
  return Queue;
}();

exports.default = Queue;
module.exports = exports["default"];
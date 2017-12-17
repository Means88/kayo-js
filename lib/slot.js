'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {
  return undefined;
};

var Slot = function () {
  function Slot() {
    (0, _classCallCheck3.default)(this, Slot);

    this.fulfilled = true;
  }

  (0, _createClass3.default)(Slot, [{
    key: 'initialize',
    value: function initialize(keys, callback) {
      var _this = this;

      var onCancel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

      if (!this.fulfilled) {
        this.cancel('interrupted');
      }
      this.fulfilled = false;
      var cancelPromise = new _promise2.default(function (_, reject) {
        _this._cancel = reject;
      });

      var slotPromiseList = [];
      this._keys = keys;
      this._resolver = {};
      this._values = {};

      var _loop = function _loop(key) {
        var promise = new _promise2.default(function (resolve) {
          _this._resolver[key] = resolve;
        });
        slotPromiseList.push(promise);
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          _loop(key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var fulfillPromise = _promise2.default.all(slotPromiseList).then(function (keys) {
        _this.fulfilled = true;
        return {
          keys: keys,
          values: _this._values
        };
      });

      _promise2.default.race([cancelPromise, fulfillPromise]).then(callback).catch(onCancel);
    }
  }, {
    key: 'cancel',
    value: function cancel(message) {
      this._cancel(message);
    }
  }, {
    key: 'fill',
    value: function fill(key, value) {
      if (this._keys.indexOf(key) === -1) {
        throw new Error('The key "' + key + '" are not defined by "initialize" method.');
      }
      this._values[key] = value;
      this._resolver[key].call(null, key);
    }
  }]);
  return Slot;
}();

exports.default = Slot;
module.exports = exports['default'];
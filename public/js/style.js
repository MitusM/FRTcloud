"use strict";
(self["webpackChunkcloudFRT"] = self["webpackChunkcloudFRT"] || []).push([["style"],{

/***/ "./assets/scss/index.scss":
/*!********************************!*\
  !*** ./assets/scss/index.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/js/form/index.js":
/*!*********************************!*\
  !*** ./assets/js/form/index.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");



/**
 *
 *
 */
var Form = function Form(selector, option) {
  (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Form);

  this._form = typeof selector === "string" ? document.forms[selector] : (0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(selector) === "object" ? selector : null;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Form);

/***/ }),

/***/ "./assets/js/index.js":
/*!****************************!*\
  !*** ./assets/js/index.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/index.scss */ "./assets/scss/index.scss");
/* harmony import */ var tippy_js_dist_tippy_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tippy.js/dist/tippy.css */ "./node_modules/tippy.js/dist/tippy.css");
/* harmony import */ var izitoast_dist_css_iziToast_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! izitoast/dist/css/iziToast.css */ "./node_modules/izitoast/dist/css/iziToast.css");
/* harmony import */ var tippy_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tippy.js */ "./node_modules/tippy.js/dist/tippy.esm.js");
/* harmony import */ var delegate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! delegate */ "./node_modules/delegate/src/delegate.js");
/* harmony import */ var _system_each_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./system/each.js */ "./assets/js/system/each.js");
/* harmony import */ var _system_extend_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./system/extend.js */ "./assets/js/system/extend.js");
/* harmony import */ var _system_fetch_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./system/fetch.js */ "./assets/js/system/fetch.js");
/* harmony import */ var _form_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./form/index.js */ "./assets/js/form/index.js");
/* harmony import */ var _system_message_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./system/message.js */ "./assets/js/system/message.js");










var _$ = {
  tippy: tippy_js__WEBPACK_IMPORTED_MODULE_9__["default"],
  extend: _system_extend_js__WEBPACK_IMPORTED_MODULE_5__.extend,
  each: _system_each_js__WEBPACK_IMPORTED_MODULE_4__.each,
  ajax: _system_fetch_js__WEBPACK_IMPORTED_MODULE_6__.ajax,
  delegate: delegate__WEBPACK_IMPORTED_MODULE_3__,
  Form: _form_index_js__WEBPACK_IMPORTED_MODULE_7__["default"],
  message: _system_message_js__WEBPACK_IMPORTED_MODULE_8__["default"]
};
window._$ = _$;

/***/ }),

/***/ "./assets/js/system/each.js":
/*!**********************************!*\
  !*** ./assets/js/system/each.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "each": () => (/* binding */ each)
/* harmony export */ });
function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
var nativeForEach = Array.prototype.forEach;
var breaker = {};
function each(obj, iterator, context) {
  if (obj == null) return;

  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    for (var key in obj) {
      if (has(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) return;
      }
    }
  }
}

/***/ }),

/***/ "./assets/js/system/extend.js":
/*!************************************!*\
  !*** ./assets/js/system/extend.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extend": () => (/* binding */ extend)
/* harmony export */ });
var extend = function extend() {
  var merged = {};
  Array.prototype.forEach.call(arguments, function (obj) {
    for (var key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj.hasOwnProperty(key)) return;
      merged[key] = obj[key];
    }
  });
  return merged;
};



/***/ }),

/***/ "./assets/js/system/fetch.js":
/*!***********************************!*\
  !*** ./assets/js/system/fetch.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ajax": () => (/* binding */ ajax)
/* harmony export */ });
/*global _$*/

/**
 * Зависимости: _$.extend
 */
var defSettings = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
};

var initArguments = function initArguments(options) {
  return typeof options === 'function' || options === undefined ? defSettings : _$.extend(defSettings, options); // {
  // options:
  // }
};

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

function ajax(url, options) {
  try {
    options = initArguments(options);
    return fetch(url, {
      method: options.method,
      headers: options.headers,
      body: JSON.stringify(options.body)
    }).then(status).then(json).then(function (data) {
      return data;
    })["catch"](function (error) {
      return error;
    }); // .catch(function (error) {
    //   console.log('Request failed', error);
    //   _$.message('error', {
    //     title: 'Ошибка',
    //     message: error,
    //     position: 'topCenter'
    //   })
    // })
  } catch (error) {
    return new Error('Неудачный запрос');
  }
}

/***/ }),

/***/ "./assets/js/system/message.js":
/*!*************************************!*\
  !*** ./assets/js/system/message.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var izitoast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! izitoast */ "./node_modules/izitoast/dist/js/iziToast.js");
//📌


function message(action, settings, fn) {
  var obj = {
    position: settings.position || 'topRight'
  };

  if (fn) {
    obj.onClosing = function () {
      fn();
    };
  } // position: 'center', bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter


  for (var key in settings) {
    if (settings.hasOwnProperty(key)) {
      obj[key] = settings[key];
    }
  }

  izitoast__WEBPACK_IMPORTED_MODULE_0__[action](obj);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (message);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./assets/js/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
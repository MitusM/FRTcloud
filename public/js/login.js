"use strict";
(self["webpackChunkcloudFRT"] = self["webpackChunkcloudFRT"] || []).push([["login"],{

/***/ "./microservices/auth/assets/scss/index.scss":
/*!***************************************************!*\
  !*** ./microservices/auth/assets/scss/index.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./microservices/auth/assets/js/index.js":
/*!***********************************************!*\
  !*** ./microservices/auth/assets/js/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scss/index.scss */ "./microservices/auth/assets/scss/index.scss");



(function () {
  var _ref = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.mark(function _callee(window) {
    var Login, elements, token, consumer, user, password, submit, csrf, message, validateFields;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Login = new _$.Form('login_form');
            elements = Login._form.elements;
            token = elements[1];
            consumer = elements[2];
            user = elements[3];
            password = elements[4];
            submit = elements[5];
            csrf = document.querySelector('meta[name=csrf-token]').getAttributeNode('content').value;
            token.value = csrf;

            message = function message(body) {
              _$.message('error', {
                title: 'Ошибка',
                message: body,
                position: 'topCenter'
              });
            };

            submit.addEventListener('click', function (e) {
              e.preventDefault();
              var target = e.target;
              var usrVal = user.value;
              var pswVal = password.value;
              var obj = {
                username: usrVal,
                csrf: token.value,
                password: pswVal
              };

              if (usrVal === '') {
                validateFields(usrVal, 'Укажите логин');
                user.focus();
              }

              if (pswVal === '') {
                validateFields(pswVal, 'Укажите пароль');
                password.focus();
              }

              if (usrVal !== '' && pswVal !== '') {
                // submit.disabled = false
                axios.post('/auth/signin', {
                  username: usrVal,
                  csrf: token.value,
                  password: pswVal,
                  consumer: consumer.value
                }).then(function (response) {
                  var data = response.data;
                  console.log('⚡ response::', response);

                  if (response.status === 200) {
                    window.location.href = response.data;
                  } else {
                    message(data.message);
                  }
                })["catch"](function (error) {
                  console.log(error);
                });
              }
            });

            validateFields = function validateFields(field, message) {
              if (field === '') {
                // _$.message('error', {
                //   title: 'Ошибка',
                //   message: message,
                //   position: 'topCenter'
                // })
                message(message);
              }
            };

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})()(window);

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./microservices/auth/assets/js/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
"use strict";
(self["webpackChunkcloudFRT"] = self["webpackChunkcloudFRT"] || []).push([["users"],{

/***/ "./microservices/users/assets/scss/index.scss":
/*!****************************************************!*\
  !*** ./microservices/users/assets/scss/index.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./microservices/users/assets/js/index.js":
/*!************************************************!*\
  !*** ./microservices/users/assets/js/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scss/index.scss */ "./microservices/users/assets/scss/index.scss");
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.dev.js");





(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.mark(function _callee() {
  var doc;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          doc = document;
          doc.addEventListener("DOMContentLoaded", function () {
            /** url добавить пользователя */
            var urlUserAdd = doc.getElementById("url-user-add");
            /** контейнер с формой добавить пользователя */

            var divAddForm = doc.getElementById("user-add");
            /** форма добавить пользователя*/

            var userAddForm = doc.querySelector(".user-form__add");
            /** кнопка закрыть форму добавления пользователя */

            var closeUserForm = doc.querySelector(".user-form-title__close");
            /** Таблица пользователей */

            var userTables = doc.querySelector(".user-table");
            /** class css display none  */

            var displayNone = "display-none";
            /** Показываем или скрываем форму добавления пользователя */

            var toggleFormAdd = function toggleFormAdd() {
              divAddForm.classList.toggle(displayNone);
              divAddForm.classList.add("animate__zoomIn");

              if (userTables.classList.contains("animate__fadeOut")) {
                userTables.classList.remove("animate__fadeOut");
                userTables.classList.toggle("display-none");
              } else {
                userTables.classList.add("animate__fadeOut");
                userTables.classList.toggle("display-none");
              }
            };
            /**  */


            var formAdd = new _$.Form("user-form");
            /**  */

            var elements = formAdd._form.elements;
            console.log("⚡ formAdd::", formAdd);
            console.log("⚡ elements::", elements);
            /** LOGIN */

            var username = elements[1];
            var email = elements[2];
            var password = elements[3];
            var group = elements[4];
            var quota = elements[5];
            /**
             *
             */

            urlUserAdd.addEventListener("click", function (e) {
              e.preventDefault();
              toggleFormAdd();
            });
            /**
             *
             */

            closeUserForm.addEventListener("click", function (e) {
              toggleFormAdd();
            });
            console.log("⚡ nanoid::", (0,nanoid__WEBPACK_IMPORTED_MODULE_3__.nanoid)());
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./microservices/users/assets/js/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
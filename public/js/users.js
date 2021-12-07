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
            // let userAddForm = doc.querySelector(".user-form__add");

            /** кнопка закрыть форму добавления пользователя */

            var closeUserForm = doc.querySelector(".user-form-title__close");
            /** Таблица пользователей */

            var userTables = doc.querySelector(".user-table");
            /** class css display none  */

            var displayNone = "display-none";
            /**  */

            var formAdd = new _$.Form("user-form");
            /**  */

            var elements = formAdd._form.elements;
            /** Языковые константы при провале валидации */

            var langError = lang.errorAdmin;
            /**  */

            var userTableBody = userTables.children[1];
            /** Заголовок формы добавления или редактирования пользователя */

            var userFormTitle = document.querySelector(".user-form-add__title");
            /** LOGIN */

            var username = elements[1];
            var email = elements[2];
            var password = elements[3];
            var group = elements[4];
            var quota = elements[5];
            var submit = elements[6];
            console.log("⚡ userTables::", userTables);
            console.log("⚡ formAdd::", formAdd);
            console.log("⚡ userTableBody::", userTableBody);
            console.log("⚡ userFormTitle::", userFormTitle);
            var csrf = document.querySelector("meta[name=csrf-token]").getAttributeNode("content").value;
            /**
             * Всплывающее сообщение.
             * @param {string} body Сообщение
             */

            var message = function message(action, body) {
              _$.message(action, {
                title: action === "error" ? "Ошибка" : "Завершенное",
                message: body,
                position: "topCenter"
              });
            };
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
            }; // console.log("⚡ submit::", submit);


            submit.addEventListener("click", function (e) {
              e.preventDefault();
              var user = username.value;
              var pass = password.value; // userFormTitle.textContent = "Добавить пользователя!";

              if (user === "") validateFields(username, langError.username);
              if (pass === "") validateFields(password, langError.password);

              if (user !== "" && pass !== "") {
                axios.post("/users/create", {
                  username: user,
                  email: email.value,
                  password: pass,
                  group: group.value,
                  quota: quota.value,
                  id: (0,nanoid__WEBPACK_IMPORTED_MODULE_3__.nanoid)(),
                  csrf: csrf
                }).then(function (res) {
                  var data = res.data;
                  var id;

                  if (data.status === 200) {
                    message("success", "Your account has been created");
                    /** Скрываем форму добавления пользователя*/

                    toggleFormAdd();
                    /** Добавляем данные о пользователе в таблицу */

                    userTableBody.insertAdjacentHTML("afterbegin", data.html);
                    /** Находим id добавляемого элемента в таблицу для анимации */

                    id = doc.getElementById(data.id);
                    /** Добавляем class к элементу для анимации */

                    id.classList.add("animate__zoomIn");
                    /** Очищаем форму от данных */

                    formAdd._form.reset();
                  } else {
                    message("error", data.message);
                  }
                })["catch"](function (err) {
                  console.log("⚡ err::", err);
                });
              }
            });
            /**
             * Показываем или скрываем форму добавления пользователя
             */

            urlUserAdd.addEventListener("click", function (e) {
              e.preventDefault();
              userFormTitle.textContent = "Добавить пользователя";
              toggleFormAdd();
            });
            /**
             * Скрываем форму добавления пользователя
             */

            closeUserForm.addEventListener("click", function (e) {
              toggleFormAdd();
            });
            /**  */

            var validateFields = function validateFields(field, body) {
              message("error", body);
              field.focus();
            };

            userTableBody.addEventListener("click", function (e) {
              var target = e.target;
              console.log("⚡ target::", target);
            });
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
(self["webpackChunkcloudFRT"] = self["webpackChunkcloudFRT"] || []).push([["article"],{

/***/ "./assets/js/html-formatting/html-formatting.js":
/*!******************************************************!*\
  !*** ./assets/js/html-formatting/html-formatting.js ***!
  \******************************************************/
/***/ ((module) => {

/*! htmlFormatting | © 2015 bashkos | https://github.com/WEACOMRU/html-formatting */
var htmlFormatting = function () {
  'use strict';

  var getRule = function getRule(node, valid_elements) {
    var re = new RegExp('(?:^|,)' + node.tagName.toLowerCase() + '(?:,|$)'),
        rules = Object.keys(valid_elements),
        rule = false,
        i;

    for (i = 0; i < rules.length && !rule; i++) {
      if (re.test(rules[i])) {
        rule = valid_elements[rules[i]];
      }
    }

    return rule;
  },
      convert = function convert(node, convert_to) {
    var parent = node.parentNode,
        converted = document.createElement(convert_to);

    if (node.style.cssText) {
      converted.style.cssText = node.style.cssText;
    }

    if (node.className) {
      converted.className = node.className;
    }

    while (node.childNodes.length > 0) {
      converted.appendChild(node.childNodes[0]);
    }

    parent.replaceChild(converted, node);
  },
      checkStyles = function checkStyles(node, valid_styles) {
    var i, re;

    if (typeof valid_styles === 'string' && node.style.length) {
      for (i = node.style.length - 1; i >= 0; i--) {
        re = new RegExp('(?:^|,)' + node.style[i] + '(?:,|$)');

        if (!re.test(valid_styles)) {
          node.style[node.style[i]] = '';
        }
      }

      if (!node.style.cssText) {
        node.removeAttribute('style');
      }
    }
  },
      checkClasses = function checkClasses(node, valid_classes) {
    var i, re;

    if (typeof valid_classes === 'string' && node.classList.length) {
      for (i = node.classList.length - 1; i >= 0; i--) {
        re = new RegExp('(?:^|\\s)' + node.classList[i] + '(?:\\s|$)');

        if (!re.test(valid_classes)) {
          node.classList.remove(node.classList[i]);
        }
      }

      if (!node.className) {
        node.removeAttribute('class');
      }
    }
  },
      isEmpty = function isEmpty(node) {
    var result = true,
        re = /^\s*$/,
        i,
        child;

    if (node.hasChildNodes()) {
      for (i = 0; i < node.childNodes.length && result; i++) {
        child = node.childNodes[i];

        if (child.nodeType === 1) {
          result = isEmpty(child);
        } else if (child.nodeType === 3 && !re.test(child.nodeValue)) {
          result = false;
        }
      }
    }

    return result;
  },
      unpack = function unpack(node) {
    var parent = node.parentNode;

    while (node.childNodes.length > 0) {
      parent.insertBefore(node.childNodes[0], node);
    }
  },
      processText = function processText(node) {
    node.nodeValue = node.nodeValue.replace(/\xa0/g, ' ');
  },
      processNode = function processNode(node, valid_elements, taskSet) {
    var rule;

    if (node.nodeType === 1) {
      rule = getRule(node, valid_elements);

      if (rule) {
        if (typeof rule.valid_elements === 'undefined') {
          process(node, valid_elements);
        } else {
          process(node, rule.valid_elements);
        }

        if (rule.no_empty && isEmpty(node)) {
          taskSet.push({
            task: 'remove',
            node: node
          });
        } else {
          checkStyles(node, rule.valid_styles);
          checkClasses(node, rule.valid_classes);

          if (rule.convert_to) {
            taskSet.push({
              task: 'convert',
              node: node,
              convert_to: rule.convert_to
            });
          } else if (node.id) {
            node.removeAttribute('id');
          }

          if (typeof rule.process === 'function') {
            taskSet.push({
              task: 'process',
              node: node,
              process: rule.process
            });
          }
        }
      } else {
        process(node, valid_elements);

        if (node.hasChildNodes()) {
          taskSet.push({
            task: 'unpack',
            node: node
          });
        }

        taskSet.push({
          task: 'remove',
          node: node
        });
      }
    } else if (node.nodeType === 3) {
      processText(node);
    }
  },
      doTasks = function doTasks(taskSet) {
    var i;

    for (i = 0; i < taskSet.length; i++) {
      switch (taskSet[i].task) {
        case 'remove':
          taskSet[i].node.parentNode.removeChild(taskSet[i].node);
          break;

        case 'convert':
          convert(taskSet[i].node, taskSet[i].convert_to);
          break;

        case 'process':
          taskSet[i].process(taskSet[i].node);
          break;

        case 'unpack':
          unpack(taskSet[i].node);
          break;
      }
    }
  },
      process = function process(node, valid_elements) {
    var taskSet = [],
        i;

    for (i = 0; i < node.childNodes.length; i++) {
      processNode(node.childNodes[i], valid_elements, taskSet);
    }

    doTasks(taskSet);
  };

  return process;
}();

module.exports = htmlFormatting;

/***/ }),

/***/ "./microservices/article/assets/scss/index.scss":
/*!******************************************************!*\
  !*** ./microservices/article/assets/scss/index.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./microservices/article/assets/js/html-formatting/index.js":
/*!******************************************************************!*\
  !*** ./microservices/article/assets/js/html-formatting/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "htmlFormatting": () => (/* reexport default export from named module */ _assets_js_html_formatting_html_formatting_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "validElements": () => (/* binding */ validElements)
/* harmony export */ });
/* harmony import */ var _assets_js_html_formatting_html_formatting_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../assets/js/html-formatting/html-formatting.js */ "./assets/js/html-formatting/html-formatting.js");
 // console.log('⚡ htmlFormatting::1', htmlFormatting)

var headerRule = {
  br: {
    process: function process(node) {
      var parent = node.parentNode,
          space = document.createTextNode(' ');
      parent.replaceChild(space, node);
    }
  }
};
/**  */

var validElements = {
  img: {
    valid_styles: '',
    valid_classes: 'foto',
    no_empty: false,
    valid_elements: 'src,width,height' // process: function (node) {
    // }

  },
  h1: {
    convert_to: 'h2',
    valid_styles: 'text-align',
    valid_classes: 'heading',
    no_empty: true,
    valid_elements: headerRule
  },
  'h2,h3,h4': {
    valid_styles: 'text-align',
    valid_classes: 'heading',
    no_empty: true,
    valid_elements: headerRule
  },
  p: {
    valid_styles: 'text-align',
    valid_classes: '',
    no_empty: true
  },
  a: {
    valid_styles: '',
    valid_classes: '',
    no_empty: true,
    process: function process(node) {
      var host = "https://".concat(window.location.host, "/");

      if (node.href.indexOf(host) !== 0) {
        node.target = '_blank';
      }
    }
  },
  br: {
    valid_styles: '',
    valid_classes: ''
  },
  'blockquote,b,strong,i,em,s,strike,sub,sup,kbd,ul,ol,li,dl,dt,dd,time,address,thead,tbody,tfoot': {
    valid_styles: '',
    valid_classes: '',
    no_empty: true
  },
  'table,tr,th,td': {
    valid_styles: 'text-align,vertical-align',
    valid_classes: '',
    no_empty: true
  },
  'embed,iframe': {
    valid_classes: ''
  }
};
/** Форматирование html разметки, по заданным правилам */
// const formatting = function () {
//   const body =
//     tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById(
//       'tinymce',
//     )
// }



/***/ }),

/***/ "./microservices/article/assets/js/index.js":
/*!**************************************************!*\
  !*** ./microservices/article/assets/js/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scss/index.scss */ "./microservices/article/assets/scss/index.scss");
/* harmony import */ var cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cyrillic-to-translit-js */ "./node_modules/cyrillic-to-translit-js/CyrillicToTranslit.js");
/* harmony import */ var _typograf_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./typograf/index.js */ "./microservices/article/assets/js/typograf/index.js");
/* harmony import */ var _html_formatting_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./html-formatting/index.js */ "./microservices/article/assets/js/html-formatting/index.js");
/* harmony import */ var _upload_picture_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./upload/picture.js */ "./microservices/article/assets/js/upload/picture.js");









(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.mark(function _callee() {
  var doc;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          doc = document;
          doc.addEventListener('DOMContentLoaded', function () {
            var lang = {
              ru: {
                dropzone: 'Перетащите изображения в данную область и отпустите, или кликните по ней для начала загрузки изображения.',
                message: {
                  error: {
                    title: 'Во время загрузки произошла ошибка.',
                    success: 'Сервер не смог загрузить изображение, попробуйте позже.'
                  },
                  success: {
                    title: '',
                    done: 'Загрузка прошла успешно.'
                  },
                  limit: {
                    title: '!!!!',
                    body: 'Превышен лимит по количеству изображений доступных для загрузки.'
                  },
                  "delete": {
                    title: '',
                    body: 'Файл успешно удалён.'
                  }
                }
              }
            };
            var message = lang.ru.message;
            var position = 'topRight';
            var maxfilesexceeded = false;
            var cyrillicToTranslit = new cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_3__();
            /** Add settings form for id  */

            var formAdd = new _$.Form('add');
            var elementForm = formAdd._form.elements;
            /** Поле ввода название страны */

            var titleInput = elementForm[1];
            /** url */

            var urlInput = elementForm[3];
            /**  */

            var bodyEditor;
            /** Счётчик сколько всего загруженно изображений */

            var count = 0;
            /** Элемент на странице в котором отображаем количество загруженных изображений */

            var total = doc.getElementById('js-count');
            /** CSRF protection value */

            var csrf = document.querySelector('meta[name=csrf-token]').getAttributeNode('content').value;
            titleInput.addEventListener('change', function (e) {
              var titleVal = e.target.value;
              var trn = cyrillicToTranslit.transform(titleVal, '-').toLowerCase();
              urlInput.value = titleVal.length > 0 ? 'country-' + trn + '.html' : titleVal;
            }); // ------------------->
            // TyneMCE
            // ------------------->

            tinymce.init({
              /** Инициализируем редактор */
              selector: '#content',

              /** Устанавливаем язык редактора */
              language: 'ru',
              icons_url: '/public/js/icons/cloudFRT/icons.js',
              icons: 'cloudFRT',
              // use icon pack
              min_height: 600,
              placeholder: 'Ну что начнём творить...',
              plugins: 'lists advlist anchor link autolink image table preview wordcount searchreplace emoticons fullscreen visualblocks media visualchars quickbars template autoresize pagebreak',
              // Настройки bullist
              advlist_bullet_styles: 'square circle disc',
              allow_html_in_named_anchor: true,
              // autolink
              link_default_target: '_blank',
              link_context_toolbar: true,
              link_default_protocol: 'https',
              // === === === === === === === === === === === ===
              //
              // === === === === === === === === === === === ===
              powerpaste_word_import: 'clean',
              powerpaste_html_import: 'clean',
              // === === === === === === === === === === === ===
              // AUTORESIZE
              // === === === === === === === === === === === ===
              autoresize_bottom_margin: 5,
              // === === === === === === === === === === === ===
              // PAGEBREAK
              // === === === === === === === === === === === ===
              // pagebreak_split_block: true,
              toolbar_sticky: true,
              // contextmenu: 'link image table',

              /**
               * bullist - маркированный список
               * numlist - нумерованный список
               * anchor - якорь
               *  quickimage
               */
              toolbar: 'fullscreen preview print searchreplace undo redo cut copy paste | bold italic underline strikethrough forecolor backcolor link anchor image media alignleft aligncenter alignright alignjustify numlist bullist table | emoticons wordcount visualblocks visualchars template pagebreak | typograf format',
              quickbars_selection_toolbar: 'bold italic | blocks | quicklink blockquote',
              setup: function setup(editor) {
                /** Пункты меню пересоздаются при закрытии и открытии меню, поэтому нам нужна переменная для хранения состояния переключаемого пункта меню */
                var toggleState = false; //* ************************************
                //* ТИПОГРАФ
                //* ************************************

                editor.ui.registry.addButton('typograf', {
                  icon: 'typograf',
                  tooltip: 'Типографирование текста',
                  onAction: function onAction() {
                    var tiny = _typograf_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].execute(editor.getContent());
                    tinyMCE.activeEditor.setContent(tiny);
                  }
                });
                editor.ui.registry.addButton('format', {
                  icon: 'formating',
                  tooltip: 'Приведение разметки текста к заданным параметрам',
                  onAction: function onAction() {
                    bodyEditor = tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById('tinymce');
                    (0,_html_formatting_index_js__WEBPACK_IMPORTED_MODULE_5__.htmlFormatting)(bodyEditor, _html_formatting_index_js__WEBPACK_IMPORTED_MODULE_5__.validElements);
                  }
                });
              }
            }); // ───────────────────────────────────────────────────────────────────────

            Dropzone.autoDiscover = false;
            var dropzone = new Dropzone('.dropzone', {
              dictDefaultMessage: lang.ru.dropzone,
              url: '/upload/article-country',
              method: 'post',
              timeout: 60000,
              acceptedFiles: 'image/*',
              // clickable: true,
              thumbnailWidth: 240,
              thumbnailHeight: 240
            });
            /**
             *  Вызывается непосредственно перед отправкой каждого файла. Получает объект xhr и объекты formData в качестве второго и третьего параметров, поэтому имеется возможность добавить дополнительные данные. Например, добавить токен CSRF
             */

            dropzone.on('sending', function (file, xhr, formData) {
              // const csrf = document
              //   .querySelector('meta[name=csrf-token]')
              //   .getAttributeNode('content').value
              // BUG:🐞 Если добавляется несколько файлов то к каждому файлу добавляется значение
              // FIXME: Ко всем файлам один csrf-token
              //TODO: Ко всем файлам один csrf-token
              formData.append('csrf', csrf);
            });
            /** Вызывается для каждого файла, который был отклонен, поскольку количество файлов превышает ограничение maxFiles. */

            dropzone.on('maxfilesexceeded', function () {
              //* NOTE: Удаляем файлы к загрузки превысившие лимит по количеству добавляемых к загрузке за один раз
              // upload.removeFile(file)
              maxfilesexceeded = true;

              _$.message('error', {
                title: message.limit.title,
                message: message.limit.success,
                position: position
              });
            }); // === === === === === === === === === === === ===
            // Вызывается, когда загрузка была успешной или ошибочной.
            // === === === === === === === === === === === ===

            dropzone.on('complete', function (file) {
              // FIX: DROPZONE - добавить всплывающее сообщение об неудачной или удачной загрузки файла
              // console.log('⚡ file.status', file.status)
              if (file.status === 'error' && maxfilesexceeded === false) {
                // console.log('⚡ maxfilesexceeded::error', maxfilesexceeded)
                // console.log('complete')
                // console.log('⚡ file', file)
                _$.message('error', {
                  title: message.error.title,
                  message: message.error.success,
                  position: position
                });

                dropzone.removeFile(file);
              } else if (file.status === 'success') {
                _$.message('success', {
                  title: message.success.title,
                  message: message.success.done,
                  position: position
                });
              }
            }); // === === === === === === === === === === === ===
            // Файл был успешно загружен. Получает ответ сервера в качестве второго аргумента.
            // === === === === === === === === === === === ===

            dropzone.on('success', function (file, response) {
              try {
                count++; // console.log('⚡ file::', file)

                console.log('⚡ response::', response);
                var create = Dropzone.createElement;
                /** исходный размер фото */

                var width = file.width;
                var height = file.height;
                /** Object с уменьшенными копиями изображения */

                var resizeImgObj = response.body.resize;
                /** контейнер в котором отображаются детали фото */

                var details = file.previewElement.querySelector('.dz-details');
                /** кнопка Удалить */

                var removeButton = create('<div class="d-flex delete-img"><button type="button" class="remove btn btn-primary btn-sm">Удалить файл</button></div>');
                /** Элемент в котором отображаются превью фото, кнопка удалить и детали фото */

                var preview = file.previewElement;
                var size = create("<div class=\"prev-img-wigth-height\"><span>".concat(width, " x ").concat(height, " px.</span></div>"));
                /** добавляем в детали размер изображения */

                details.appendChild(size);
                /** добавляем кнопку удалить фото */

                preview.appendChild(removeButton);
                /** Устанавливаем обработчик события, для вставки изображения в редактор. По клику на изображения */

                _$.delegate(preview, '.dz-image', 'click', clickImage.bind(null, resizeImgObj, response.body.webpOriginal, width, height), false);

                _$.delegate(preview, '.dz-details', 'click', clickImage.bind(null, resizeImgObj, response.body.webpOriginal, width, height));
                /** Удаление изображения */


                removeButton.addEventListener('click', function (e) {
                  e.preventDefault();

                  _$.ajax('/article/delete-image', {
                    method: 'delete',
                    body: {
                      files: response.body.files,
                      fields: {
                        csrf: csrf
                      }
                    }
                  }).then(function (done) {
                    deleteUploadFiles(done, file);
                  })["catch"](function (error) {
                    return error;
                  });
                });
                /**  */

                total.innerHTML = count;
              } catch (err) {
                console.log('⚡ err::', err);
              }
            });
            /** Вставляем изображение в редактор */

            function clickImage(resizeImgObj, webpOriginal, width, height) {
              var img = (0,_upload_picture_js__WEBPACK_IMPORTED_MODULE_6__.picture)(resizeImgObj, webpOriginal, width, height);
              tinyMCE.activeEditor.execCommand('mceInsertContent', false, img);
            }
            /** Удаляем изображения. */


            function deleteUploadFiles(done, file) {
              if (done.status === 201) {
                _$.message('success', {
                  title: message["delete"].title,
                  message: message["delete"].body,
                  position: position
                });

                dropzone.removeFile(file);
                console.clear();
              }
            }
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

/***/ }),

/***/ "./microservices/article/assets/js/typograf/index.js":
/*!***********************************************************!*\
  !*** ./microservices/article/assets/js/typograf/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var typograf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! typograf */ "./node_modules/typograf/dist/typograf.js");

/**
 * Типограф
 * NOTE: 1 +- 2 1 <= 2 1 -> 2 (c), (tm) 10 C, 20 F 1/2, 3/4 10x3~=30
 * @param {*} text
 */
// let typograf = (text) => {

var tp = new typograf__WEBPACK_IMPORTED_MODULE_0__({
  locale: ['ru', 'en-US']
});
/** -> → →, <- → ← */

tp.enableRule('common/symbols/arrow'); // 	Добавление ° к C и F

tp.enableRule('common/symbols/cf'); // (c) → ©, (tm) → ™, (r) → ®

tp.enableRule('common/symbols/copy'); // №№ → №

tp.enableRule('ru/symbols/NN'); // Удаление повторяющихся пробелов между символами

tp.enableRule('common/space/delRepeatSpace'); // Пробел после знаков пунктуации

tp.enableRule('common/space/afterPunctuation'); // Пробел перед открывающей скобкой

tp.enableRule('common/space/beforeBracket'); // Удаление лишних пробелов после открывающей и перед закрывающей скобкой

tp.enableRule('common/space/bracket'); // Удаление пробела перед %, ‰ и ‱

tp.enableRule('common/space/delBeforePercent'); // Замена латинских букв на русские. Опечатки, возникающие при переключении клавиатурной раскладки

tp.enableRule('ru/typo/switchingKeyboardLayout');
/** != → ≠, <= → ≤, >= → ≥, ~= → ≅, +- → ± */

tp.enableRule('common/number/mathSigns'); // -tp. enableRule('*')

tp.enableRule('ru/money/*');
tp.enableRule('ru/date/*');
tp.enableRule('ru/optalign/*'); // tp.enableRule('ru/punctuation/*')

tp.enableRule('ru/dash/*');
tp.enableRule('common/space/*');
tp.enableRule('common/number/*'); // tp.enableRule('common/html/escape')
//- Разобраться с правилами что-бы в тексте пробелы не заменялись на &nbsp

tp.disableRule('common/nbsp/*'); //BUG: !!! Не удоляет теги из текста
// tp.disableRule('common/html/stripTags')
//-tp.disableRule('common/html/*')
// Неразрывный пробел перед последним словом в предложении, не более 5 символов
// tp.setSetting('common/nbsp/beforeShortLastWord', 'lengthLastWord', 5);
// Вложенные кавычки тоже «ёлочки» для русской типографики

tp.setSetting('common/punctuation/quote', 'ru', {
  left: '«',
  right: '»',
  removeDuplicateQuotes: true
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tp);

/***/ }),

/***/ "./microservices/article/assets/js/upload/picture.js":
/*!***********************************************************!*\
  !*** ./microservices/article/assets/js/upload/picture.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "picture": () => (/* binding */ picture)
/* harmony export */ });
/* eslint-disable no-prototype-builtins */
var hash = function hash(obj, _int) {
  return obj.hasOwnProperty(_int);
};
/**
 * Создаём элемент picture
 * @param {Object} obj
 * @param {Object} obj.name имя файла
 * @param {Object} obj.size объём изображения
 * @param {Object} obj.width ширина изображения
 * @param {*} width ширина исходного изображения
 */


var picture = function picture(obj, webpOriginal, width, height) {
  'use strict';

  var pictureElem = '<picture>';
  console.log('⚡ obj::', obj);
  var hash480 = hash(obj, 480);
  var hash960 = hash(obj, 960);
  var hash1280 = hash(obj, 1280);
  var hash1920 = hash(obj, 1920);
  var hash2700 = hash(obj, 2700);
  var img480;
  var img960;
  var img1280;
  var img1920;

  if (hash1280) {
    img1280 = hash1280 && hash2700 ? "".concat(obj[1280].pathFile, " 1920w, ").concat(obj[2700].pathFile, " 2700w") : "".concat(obj[1280].pathFile);
    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"(min-width: 1024px) and (max-width: 1920px)\"\n    srcset=\"".concat(img1280, "\"/>");
  } //* > 480 (phone landscape & smaller)


  img480 = hash480 && hash960 ? "".concat(obj[480].pathFile, " 480w, ").concat(obj[960].pathFile, " 960w") : "".concat(obj[480].pathFile, " 480w"); //

  pictureElem += " <source\n    type=\"image/webp\"\n    media=\"(max-width: 480px)\"\n    srcset=\"".concat(img480, "\"/>");

  if (hash960) {
    img960 = hash960 && hash1920 ? "".concat(obj[960].pathFile, " 960w, ").concat(obj[1920].pathFile, " 1920w") : "".concat(obj[960].pathFile, " 960w");
    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"(min-width: 480px) and (max-width: 1023px)\"\n    srcset=\"".concat(img960, "\"/>");
  }

  if (hash1920) {
    img1920 = hash1920 && hash2700 ? "".concat(obj[1920], " 1920w, ").concat(obj[2700], " 2700w") : "".concat(obj[1920]);
    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"min-width: 1921px\"\n    srcset=\"".concat(img1920, "\"/>");
  }

  pictureElem += "<img type=\"image/webp\" src=\"".concat(webpOriginal.pathFile, "\" alt=\"").concat(webpOriginal.originalName, "\"\">"); //  srcset="${webpOriginal.pathFile} 2x

  pictureElem += '</picture>';
  return pictureElem; // return `<img src="${webpOriginal.pathFile}" alt="${webpOriginal.originalName}" srcset="${webpOriginal.pathFile} 2x">`
};

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./microservices/article/assets/js/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
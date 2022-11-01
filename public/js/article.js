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
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scss/index.scss */ "./microservices/article/assets/scss/index.scss");
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");
/* harmony import */ var cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cyrillic-to-translit-js */ "./node_modules/cyrillic-to-translit-js/CyrillicToTranslit.js");
/* harmony import */ var _typograf_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./typograf/index.js */ "./microservices/article/assets/js/typograf/index.js");
/* harmony import */ var _html_formatting_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./html-formatting/index.js */ "./microservices/article/assets/js/html-formatting/index.js");
/* harmony import */ var _upload_picture_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./upload/picture.js */ "./microservices/article/assets/js/upload/picture.js");
/* harmony import */ var _input_filter_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./input-filter.js */ "./microservices/article/assets/js/input-filter.js");
/* harmony import */ var preloader_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! preloader-js */ "./node_modules/preloader-js/preloader.js");



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }











(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.mark(function _callee5() {
  var doc;
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          doc = document;
          preloader_js__WEBPACK_IMPORTED_MODULE_9__.hide();
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
                },
                save: {
                  required: 'Обязательно для заполнения',
                  error: {
                    title: 'Не указан заголовок статьи',
                    location: 'Не указаны географические координаты',
                    country: 'Не выбрана страна',
                    region: 'Не выбран регион (область, край и т.д.',
                    city: 'Не выбран город поселок, село и т.д.'
                  },
                  success: {
                    title: '',
                    message: 'Страна добавлена'
                  }
                },
                error: {
                  country: 'Перед созданием заголовка, выберете страну'
                }
              }
            };
            /** lang SAVE */

            var save = lang.ru.save;
            var message = lang.ru.message;
            var position = 'topRight';
            var maxfilesexceeded = false;
            var cyrillicToTranslit = new cyrillic_to_translit_js__WEBPACK_IMPORTED_MODULE_4__();
            /** Add settings form for id  */

            var formAdd = new _$.Form('add');
            var elementForm = formAdd._form.elements;
            /** Поле ввода название страны */

            var titleInput = elementForm.title;
            /** url */

            var urlInput = elementForm.url;
            /** Название папки в которую загружаются изображения, используемые в статье */

            var folder = elementForm.folder;
            /** Сколько всего загруженно изображений */

            var totalInput = elementForm.total;
            /**  */

            var bodyEditor;
            /** Счётчик сколько всего загруженно изображений */

            var count = 0;
            /** Элемент на странице в котором отображаем количество загруженных изображений */

            var total = doc.getElementById('js-count');
            /** CSRF protection value */

            var csrf = document.querySelector('meta[name=csrf-token]').getAttributeNode('content').value;
            /** Контейнер с dropzone */

            var dropZoneForm;
            /** Кнопка закрытия dropzone */

            var divCloseDropZone;
            /** css class position dropzone */

            var positionDropAbsolute = 'dropzone-absolute';
            /** Зона затемнения вокруг dropzone, для фокусировки внимания  */

            var wrapper = doc.querySelector('.wrapper-dropzone');
            /** Кнопка добавить статью. */

            var submit = doc.getElementById('submit'); // let imgUpload = []

            var imgUpload = {};
            /** Выбор страны */

            var countryField = elementForm.country;
            /** Регионы */

            var regionField = elementForm.region;
            /** Города */

            var cityField = elementForm.city;
            var main = elementForm.main;
            /** Блок в котором отображается выбор региона */

            var divRegion = doc.querySelector('.division-column__region');
            /**  */

            var objCountry;
            var objRegions;
            /** Переменная в которой храним заголовок статьи, если был указан заголовок, но не выбрана статья */

            var titleArticle;
            /** Заглавная буква */

            function capitalize(s) {
              return s && s[0].toUpperCase() + s.slice(1);
            } // ------------------->
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
              min_height: 400,
              // placeholder: 'Ну что начнём творить...',
              plugins: 'lists advlist anchor link autolink image table preview wordcount searchreplace emoticons fullscreen visualblocks media visualchars quickbars template autoresize pagebreak',
              // Настройки bullist
              advlist_bullet_styles: 'square circle disc',
              allow_html_in_named_anchor: true,
              // autolink
              link_default_target: '_blank',
              link_context_toolbar: true,
              link_default_protocol: 'https',
              // Этот параметр позволяет указать, должен ли редактор анализировать и сохранять условные комментарии.
              allow_conditional_comments: true,
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
              toolbar: 'fullscreen preview print searchreplace undo redo cut copy paste | bold italic underline strikethrough forecolor backcolor link anchor image media alignleft aligncenter alignright alignjustify numlist bullist table | emoticons wordcount visualblocks visualchars template pagebreak | dropzone typograf format',
              quickbars_selection_toolbar: 'bold italic | blocks | quicklink blockquote',
              paste_tab_spaces: 2,
              // Этот параметр определяет, сколько пробелов используется для представления символа табуляции в HTML при вставке обычного текстового содержимого. По умолчанию плагин Paste преобразует каждый символ табуляции в 4 последовательных символа пробела.
              paste_data_images: true,
              //* -------------------> IMAGES <--------------------------------
              file_picker_types: 'file image media',
              // image_caption: true, // figure ->caption

              /* enable title field in the Image dialog*/
              image_title: true,
              // title=""
              image_advtab: true,
              // Эта опция добавляет в диалоговое окно изображения вкладку «Дополнительно», позволяющую добавлять к изображениям собственные стили, интервалы и границы.
              a11ychecker_allow_decorative_images: true,
              //?
              file_picker_callback: function file_picker_callback(callback, value, meta) {
                console.log('⚡ callback::', callback);
                console.log('⚡ value::', value);
                console.log('⚡ meta::', meta);
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                /* Note: In modern browsers input[type="file"] is functional without even adding it to the DOM, but that might not be the case in some older or quirky browsers like IE, so you might want to add it to the DOM just in case, and visually hide it. And do not forget do remove it once you do not need it anymore. */

                input.onchange = function () {
                  var file = this.files[0];
                  var reader = new FileReader();

                  reader.onload = function () {
                    /* Note: Now we need to register the blob in TinyMCEs image blob registry. In the next release this part hopefully won't be necessary, as we are looking to handle it internally. */
                    var id = 'blobid' + new Date().getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    /* call the callback and populate the Title field with the file name */

                    callback(blobInfo.blobUri(), {
                      title: file.name
                    });
                  };

                  reader.readAsDataURL(file);
                };

                input.click();
              },
              // -------------------> CSS <-------------------
              content_style: 'figure { padding: 1rem; box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);transition: box-shadow 0.2s ease-in-out; background-color: #fff;background-clip: border-box; border: 1px solid var(rgba(0, 0, 0, 0.125);}',
              setup: function setup(editor) {
                /** Пункты меню пересоздаются при закрытии и открытии меню, поэтому нам нужна переменная для хранения состояния переключаемого пункта меню */
                var toggleState = false; //* ************************************
                //* ТИПОГРАФ
                //* ************************************

                editor.ui.registry.addButton('typograf', {
                  icon: 'typograf',
                  tooltip: 'Типографирование текста',
                  onAction: function onAction() {
                    var tiny = _typograf_index_js__WEBPACK_IMPORTED_MODULE_5__["default"].execute(editor.getContent());
                    tinyMCE.activeEditor.setContent(tiny);
                  }
                });
                editor.ui.registry.addButton('format', {
                  icon: 'formating',
                  tooltip: 'Приведение разметки текста к заданным параметрам',
                  onAction: function onAction() {
                    bodyEditor = tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById('tinymce');
                    (0,_html_formatting_index_js__WEBPACK_IMPORTED_MODULE_6__.htmlFormatting)(bodyEditor, _html_formatting_index_js__WEBPACK_IMPORTED_MODULE_6__.validElements);
                  }
                });
                editor.ui.registry.addButton('dropzone', {
                  icon: 'drag_drop',
                  tooltip: 'Зона загрузки изображений',
                  onAction: function onAction() {
                    dropZoneForm = dropZoneForm || doc.querySelector('.dropzone-file');
                    dropZoneForm.classList.add(positionDropAbsolute);
                    /** Кнопка закрыть dropzone */

                    divCloseDropZone = divCloseDropZone || doc.createElement('div');
                    divCloseDropZone.classList.add('dropzone-close');
                    divCloseDropZone.id = 'dc';
                    dropZoneForm.appendChild(divCloseDropZone);
                    /** Устанавливаем класс для отображения */

                    wrapper.classList.toggle('cover');
                    divCloseDropZone.addEventListener('click', function (e) {
                      dropZoneForm.classList.remove(positionDropAbsolute);
                      wrapper.classList.toggle('cover');
                    });
                  }
                });
              }
            }); // ──────────────────────────────── DROPZONE ─────────────────────────────────────

            Dropzone.autoDiscover = false;
            var dropzone = new Dropzone('.dropzone', {
              dictDefaultMessage: lang.ru.dropzone,
              url: '/upload/article-country',
              method: 'post',
              timeout: 60000,
              // acceptedFiles: 'image/*',
              acceptedFiles: 'image/jpeg, image/png , image/jpg, image/svg',
              thumbnailWidth: 240,
              thumbnailHeight: 240,
              clickable: true
            });
            dropzone.on('addedfile', function (file) {
              var val = titleInput.value;

              if (val.length === 0) {
                // dropzone.off('error')
                dropzone.removeFile(file);
                dropzone.disable();
                titleInput.focus();

                _$.message('error', {
                  title: '❗',
                  message: 'Перед загрузкой заполните заголовок',
                  position: position
                });
              }
            });
            /**
             *  Вызывается непосредственно перед отправкой каждого файла. Получает объект xhr и объекты formData в качестве второго и третьего параметров, поэтому имеется возможность добавить дополнительные данные. Например, добавить токен CSRF
             */

            dropzone.on('sending', function (file, xhr, formData) {
              // BUG:🐞 Если добавляется несколько файлов то к каждому файлу добавляется значение
              // FIXME: Ко всем файлам один csrf-token
              formData.append('csrf', csrf);
              formData.append('count', count);
              var val = titleInput.value;

              if (val.length > 0) {
                formData.append('name', translit(titleInput.value));
              }
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
              if (file.status === 'error' && maxfilesexceeded === false) {
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
                // Add default option box for each preview.
                var defaultRadioButton = Dropzone.createElement("<div class=\"d-flex default-pic-container\"><input type=\"radio\" class=\"file-img-default\" name=\"default_pic\" value=\"".concat(response.body.webpOriginal, "\" /> \u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0435 \u0444\u043E\u0442\u043E</div>"));
                file.previewElement.appendChild(defaultRadioButton);
                console.log('⚡ file.previewElement::', file.previewElement); // file.previewElement.firstChild(defaultRadioButton)
                // imgUpload.push(response.body)

                folder.value = translit(titleInput.value);
                /** Увеличиваем счётчик загруженных изображений на 1 */

                count++;
                /** Уникальный id к каждому изображению вставленному в редактор. (Для удаления изображения из редактора) */

                var fileId = file.upload.uuid;
                /**  */

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
                /** Описание фото исходя из заголовка статьи и количества загрузок */

                var alt = count + '-' + titleInput.value;
                /** добавляем в детали размер изображения */

                details.appendChild(size);
                /** добавляем кнопку удалить фото */

                preview.appendChild(removeButton);
                /**  */

                imgUpload[fileId] = response.body;
                totalInput.value = count;
                total.innerHTML = count;
                /** Устанавливаем обработчики события, для вставки изображения в редактор. По клику на изображение, или по его данным */

                _$.delegate(preview, '.dz-image', 'click', clickImage.bind(null, resizeImgObj, response.body.webpOriginal, alt, fileId));

                _$.delegate(preview, '.dz-details', 'click', clickImage.bind(null, resizeImgObj, response.body.webpOriginal, alt, fileId));

                _$.delegate(preview, '.file-img-default', 'change', function (e) {
                  console.log('⚡ e::', e);
                });
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
                    count--;
                    total.innerHTML = count;
                    totalInput.value = count;
                    deleteUploadFiles(done, file, fileId);
                  })["catch"](function (error) {
                    return error;
                  });
                });
              } catch (err) {
                console.log('⚡ err::', err);
              } // console.log('⚡ imgUpload::', imgUpload)

            });
            /** Вставляем изображение в редактор */

            function clickImage(resizeImgObj, webpOriginal, width, height) {
              var img = (0,_upload_picture_js__WEBPACK_IMPORTED_MODULE_7__.picture)(resizeImgObj, webpOriginal, width, height);
              tinyMCE.activeEditor.execCommand('mceInsertContent', false, img);
            }
            /** Удаляем изображения. */


            function deleteUploadFiles(done, file, fileId) {
              console.log('⚡ fileId::', fileId);

              if (done.status === 201) {
                _$.message('success', {
                  title: message["delete"].title,
                  message: message["delete"].body,
                  position: position
                });

                dropzone.removeFile(file);
                var img = tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById(fileId);
                img.parentNode.removeChild(img);
                delete imgUpload[fileId];
              }
            }
            /**  */


            function translit(val) {
              return cyrillicToTranslit.transform(val, '-').toLowerCase();
            }
            /**  */


            titleInput.addEventListener('change', /*#__PURE__*/function () {
              var _ref2 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.mark(function _callee(e) {
                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.prev = 0;
                        console.log('⚡ e::', e);
                        _context.next = 4;
                        return urlTranslit(e.target.value);

                      case 4:
                        _context.next = 9;
                        break;

                      case 6:
                        _context.prev = 6;
                        _context.t0 = _context["catch"](0);
                        console.log('⚡ err::change', _context.t0);

                      case 9:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[0, 6]]);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());
            titleInput.addEventListener('input', listenerTitleInput, false);

            function listenerTitleInput(e) {
              try {
                e.preventDefault(); // console.log('⚡ event::', e)

                var country = countryField.value;

                if (country === '') {
                  e.target.value = '';

                  _$.message('error', {
                    title: '🗺',
                    message: lang.ru.error.country,
                    position: position
                  });
                }
              } catch (error) {
                console.log('⚡ error::', error);
              }
            }

            function urlTranslit(_x2) {
              return _urlTranslit.apply(this, arguments);
            }

            function _urlTranslit() {
              _urlTranslit = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.mark(function _callee4(input) {
                var titleVal, country, trn, _total, done;

                return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        titleVal = input.replace(/([,\-.!])/g, '');
                        country = countryField.value.replace(/([,\-.!])/g, '');

                        if (!(country === '')) {
                          _context4.next = 7;
                          break;
                        }

                        titleArticle = input.value;

                        _$.message('error', {
                          title: '🗺',
                          message: lang.ru.error.country,
                          position: position
                        });

                        _context4.next = 16;
                        break;

                      case 7:
                        trn = translit(country + '-' + titleVal);
                        _total = titleVal.length;
                        urlInput.value = _total > 0 ? 'country-' + trn + '.html' : titleVal;
                        dropzone.enable();

                        if (!(_total > 0)) {
                          _context4.next = 16;
                          break;
                        }

                        _context4.next = 14;
                        return validateUrl(urlInput.value);

                      case 14:
                        done = _context4.sent;

                        if (done.total > 0) {
                          urlInput.value = done.url;
                        }

                      case 16:
                        console.log('⚡ titleArticle::', titleArticle);

                      case 17:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));
              return _urlTranslit.apply(this, arguments);
            }

            function validateUrl(val) {
              return _$.ajax('/article/validate', {
                method: 'post',
                body: {
                  type: capitalize(urlAdd),
                  params: 'url',
                  value: val,
                  csrf: csrf
                }
              });
            }
            /** Сохраняем статью  */


            submit.addEventListener('click', function (e) {
              /** Заголовок статьи */
              var title = titleInput.value;
              /** Контент статьи */

              var content = tinyMCE.activeEditor.getContent();
              /** Статья участвует в поиске */

              var searchable = elementForm.searchable.checked;
              /** Папка в которую загружаются изображения */

              var folderImage = folder.value;
              /** Сколько всего загруженно изображений */

              var imageTotal = totalInput.value;
              /** Тэги */

              var tags = elementForm.tags.value;
              /** Локация */

              var location = elementForm.location.value.trim();
              /** Страна */

              var country = countryField.value.trim();
              /** id страны */

              var country_id = Number(objCountry[country]);
              /** Регион */

              var region = regionField.value.trim();
              /** Город посёлок и т.д. */

              var city = cityField.value.trim(); // console.log('⚡ country_id::', country_id)
              // console.log('⚡ typeof country_id::', typeof country_id)

              var obj = {};
              var i = 0;
              /** Сколько всего вставлено изображений в материал */

              obj.imageTotalArticle = i;
              obj.folder = folderImage;
              obj.upload_total = imageTotal;
              obj.img_upload = imgUpload;

              if (title.length === 0) {
                _$.message('error', {
                  title: '➡ ',
                  message: save.error.title,
                  position: position
                });
              } else if (location === '') {
                _$.message('error', {
                  title: '➡ ',
                  message: save.error.location,
                  position: position
                });
              } else if (country_id === '') {
                _$.message('error', {
                  title: '➡ ',
                  message: save.error.country,
                  position: position
                });
              } else if (urlAdd === 'ate' && region === '') {
                _$.message('error', {
                  title: '➡ ',
                  message: save.error.region,
                  position: position
                });
              } else if (urlAdd === 'city' && city === '') {
                _$.message('error', {
                  title: '➡ ',
                  message: save.error.city,
                  position: position
                });
              } else {
                /** csrf */
                obj.csrf = csrf;
                obj.title = title;
                /** Ссылка статьи */

                obj.url = urlInput.value.trim();
                /** Если нет материала, то не участвует в поиске */

                obj.searchable = content && searchable ? true : false;
                /** Локация */

                obj.location = location.replace(/([, ])/g, ' ');
                obj.content = content.trim();
                obj.country = country;
                obj.country_id = country_id; // console.log('⚡ objCountry[country]::', objCountry[country])

                if (urlAdd === 'ate') {
                  obj.ate = region;
                }

                if (urlAdd === 'city') {
                  obj.city = cityField.value.trim();
                }

                obj.main = main.checked ? true : false;

                if (folderImage !== '' && imageTotal !== '') {
                  var img = tinyMCE.activeEditor.iframeElement.contentWindow.document.querySelectorAll('img');
                  var arr = Array.prototype.slice.call(img);
                  /** Массив изображений вставленных в материал */

                  obj.image = arr.map(function (item, index) {
                    i++;
                    return item.src;
                  });
                }

                obj.image = obj.image || [];
                /** Возможность оценить статью */

                obj.like = elementForm.like.checked;
                /** Ключевые слова */

                obj.keyword = elementForm.keyword.value.trim();
                /** Описание материала */

                obj.description = elementForm.description.value.trim();
                /** Отображать количество просмотров */

                obj.numberViews = elementForm.numberViews.checked;
                /** Возможность комментировать статью */

                obj.comments = elementForm.comments.checked;
                /** Тэги по которым можно найти */

                obj.tags = tags; // !== '' ? tags.split(',') : []

                obj.id = (0,nanoid__WEBPACK_IMPORTED_MODULE_10__.nanoid)(); // console.log('⚡ imgUpload-1::', imgUpload)

                _$.ajax('/article/create-' + urlAdd, {
                  method: 'put',
                  body: _objectSpread({}, obj)
                }).then(function (done) {
                  preloader_js__WEBPACK_IMPORTED_MODULE_9__.hide();

                  if (done.insert === true) {
                    formAdd._form.reset();

                    _$.message('success', {
                      title: save.success.title,
                      message: save.success.message,
                      position: position
                    });
                  } else {
                    console.log('⚡ done::', done);

                    _$.message('error', {
                      title: '🗺',
                      message: done.message,
                      position: position
                    });
                  }
                })["catch"](function (error) {
                  return error;
                });
              }
            });
            /** Выбор страны */
            // ul

            var dropdown = doc.querySelector('.value-list');
            objCountry = (0,_input_filter_js__WEBPACK_IMPORTED_MODULE_8__["default"])(countryField, dropdown, 'страну');

            if (urlAdd !== 'country') {
              // Данные с сервера в json
              // let objRegions
              var clear = function clear(elem, input) {
                elem.innerHTML = '';
                input.value = '';
              };

              var insertRegion = function insertRegion(field, list, div, regionArr, language) {
                var len = regionArr.length;
                var i = 0;
                clear(list, field);

                for (i = 0; i < len; i++) {
                  var li = doc.createElement('li');
                  li.innerText = regionArr[i].title;
                  li.dataset.id = regionArr[i].id;
                  list.appendChild(li);
                }

                div.classList.add('open');
                objRegions = (0,_input_filter_js__WEBPACK_IMPORTED_MODULE_8__["default"])(field, list, language);
              };
              /**
               *
               * @param {Number} id Страна по которому делаем выборку регионов страны из колонки country_id
               */


              var region = function region(id, field, list, div, language) {
                var url = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'regions';
                preloader_js__WEBPACK_IMPORTED_MODULE_9__.show();

                _$.ajax('/geo/' + url, {
                  method: 'post',
                  body: {
                    csrf: csrf,
                    id: id
                  }
                }).then(function (done) {
                  clear(list, field);
                  preloader_js__WEBPACK_IMPORTED_MODULE_9__.hide();
                  insertRegion(field, list, div, done.regions, language);
                })["catch"](function (error) {
                  return error;
                });
              };

              console.log('⚡ urlAdd::', urlAdd);
              /**
               * Регион
               */

              var dropdownRegion = doc.querySelector('.region-list');
              countryField.addEventListener('change', /*#__PURE__*/function () {
                var _ref3 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.mark(function _callee2(e) {
                  var target, countryName, id;
                  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          target = e.target;
                          countryName = e.target.value.trim();
                          id = objCountry[countryName];
                          console.log('⚡ id::', id);
                          region(id, regionField, dropdownRegion, divRegion, 'край и т.д.'); // await urlTranslit()

                        case 5:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }());
              dropdown.addEventListener('click', /*#__PURE__*/function () {
                var _ref4 = (0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.mark(function _callee3(e) {
                  var target, id;
                  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          target = e.target;
                          id = target.dataset.id;
                          region(id, regionField, dropdownRegion, divRegion, 'край и т.д.'); // await urlTranslit()

                        case 3:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x4) {
                  return _ref4.apply(this, arguments);
                };
              }());

              if (urlAdd === 'city') {
                /** Регион */
                var _cityField = doc.querySelector('.city-value');

                var dropdownCities = doc.querySelector('.city-list');
                var divCities = doc.querySelector('.division-column__city');
                var objCity;
                regionField.addEventListener('change', function (e) {
                  var target = e.target;
                  var regionName = e.target.value.trim();
                  var id = objRegions[regionName];
                  region(id, _cityField, dropdownCities, divCities, 'город, село и т.д.', 'cities');
                });
                dropdownRegion.addEventListener('click', function (e) {
                  var target = e.target;
                  var id = target.dataset.id;
                  region(id, _cityField, dropdownCities, divCities, 'город, село и т.д.', 'cities');
                });
              }
            }
          });

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  }, _callee5);
}))();

/***/ }),

/***/ "./microservices/article/assets/js/input-filter.js":
/*!*********************************************************!*\
  !*** ./microservices/article/assets/js/input-filter.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");


/**
 *
 * @param {object} inputField
 * @param {object} dropdown
 */
function inputFilter(inputField, dropdown, language) {
  var dropdownArray = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(dropdown.querySelectorAll('li')); // console.log(typeof dropdownArray)


  dropdown.classList.add('open');
  inputField.focus(); // Demo purposes only

  var valueArray = [];
  var obj = {};
  dropdownArray.forEach(function (item) {
    valueArray.push(item.textContent);
    obj[item.textContent] = item.dataset.id;
  });

  var closeDropdown = function closeDropdown() {
    dropdown.classList.remove('open');
  };

  inputField.addEventListener('input', function () {
    dropdown.classList.add('open');
    var inputValue = inputField.value.toLowerCase(); // let valueSubstring

    if (inputValue.length > 0) {
      for (var j = 0; j < valueArray.length; j++) {
        if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
          dropdownArray[j].classList.add('closed');
        } else {
          dropdownArray[j].classList.remove('closed');
        }
      }
    } else {
      for (var i = 0; i < dropdownArray.length; i++) {
        dropdownArray[i].classList.remove('closed');
      }
    }
  });
  dropdownArray.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      inputField.value = item.textContent;
      dropdownArray.forEach(function (dropdown) {
        dropdown.classList.add('closed');
      });
    });
  });
  inputField.addEventListener('focus', function () {
    inputField.placeholder = 'Первая буква...';
    dropdown.classList.add('open');
    dropdownArray.forEach(function (dropdown) {
      dropdown.classList.remove('closed');
    });
  });
  inputField.addEventListener('blur', function () {
    inputField.placeholder = 'Выберите ' + language;
    dropdown.classList.remove('open');
  });
  document.addEventListener('click', function (evt) {
    var isDropdown = dropdown.contains(evt.target);
    var isInput = inputField.contains(evt.target);

    if (!isDropdown && !isInput) {
      dropdown.classList.remove('open');
    }
  });
  return obj;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (inputFilter);

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


var picture = function picture(obj, webpOriginal, alt, fileId) {
  'use strict';

  alt.replace(/([,\-.!])/g, '');
  var pictureElem = "<figure id=\"".concat(fileId, "\" class=\"figure-picture-img\"><picture>");
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


  if (hash480) {
    img480 = hash480 && hash960 ? "".concat(obj[480].pathFile, " 480w, ").concat(obj[960].pathFile, " 960w") : "".concat(obj[480].pathFile, " 480w"); //

    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"(max-width: 480px)\"\n    srcset=\"".concat(img480, "\"/>");
  }

  if (hash960) {
    img960 = hash960 && hash1920 ? "".concat(obj[960].pathFile, " 960w, ").concat(obj[1920].pathFile, " 1920w") : "".concat(obj[960].pathFile, " 960w");
    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"(min-width: 480px) and (max-width: 1023px)\"\n    srcset=\"".concat(img960, "\"/>");
  }

  if (hash1920) {
    img1920 = hash1920 && hash2700 ? "".concat(obj[1920], " 1920w, ").concat(obj[2700], " 2700w") : "".concat(obj[1920]);
    pictureElem += " <source\n    type=\"image/webp\"\n    media=\"min-width: 1921px\"\n    srcset=\"".concat(img1920, "\"/>");
  }

  pictureElem += "<img type=\"image/webp\" src=\"".concat(webpOriginal.pathFile, "\" alt=\"").concat(alt, "\"\">"); //  srcset="${webpOriginal.pathFile} 2x

  pictureElem += " <figcaption>".concat(alt, "</figcaption>");
  pictureElem += '</figure></picture>';
  return pictureElem;
};

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors"], () => (__webpack_exec__("./microservices/article/assets/js/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
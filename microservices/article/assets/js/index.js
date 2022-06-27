import '../scss/index.scss'
import { nanoid } from 'nanoid'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import tp from './typograf/index.js'
import { htmlFormatting, validElements } from './html-formatting/index.js'
import { picture } from './upload/picture.js'

// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===
;(async () => {
  let doc = document
  doc.addEventListener('DOMContentLoaded', () => {
    const lang = {
      ru: {
        dropzone:
          'Перетащите изображения в данную область и отпустите, или кликните по ней для начала загрузки изображения.',
        message: {
          error: {
            title: 'Во время загрузки произошла ошибка.',
            success: 'Сервер не смог загрузить изображение, попробуйте позже.',
          },
          success: {
            title: '',
            done: 'Загрузка прошла успешно.',
          },
          limit: {
            title: '!!!!',
            body: 'Превышен лимит по количеству изображений доступных для загрузки.',
          },
          delete: {
            title: '',
            body: 'Файл успешно удалён.',
          },
        },
        save: {
          required: 'Обязательно для заполнения',
          error: {
            title: 'Не указан заголовок статьи',
          },
        },
      },
    }
    /** lang SAVE */
    const save = lang.ru.save
    const message = lang.ru.message
    const position = 'topRight'
    let maxfilesexceeded = false

    const cyrillicToTranslit = new CyrillicToTranslit()
    /** Add settings form for id  */
    let formAdd = new _$.Form('add')
    let elementForm = formAdd._form.elements
    /** Поле ввода название страны */
    let titleInput = elementForm[1]
    /** url */
    let urlInput = elementForm[3]
    /** Название папки в которую загружаются изображения, используемые в статье */
    let folder = elementForm.folder
    /** Сколько всего загруженно изображений */
    let totalInput = elementForm.total
    /**  */
    let bodyEditor
    /** Счётчик сколько всего загруженно изображений */
    let count = 0
    /** Элемент на странице в котором отображаем количество загруженных изображений */
    let total = doc.getElementById('js-count')
    /** CSRF protection value */
    const csrf = document
      .querySelector('meta[name=csrf-token]')
      .getAttributeNode('content').value
    /** Контейнер с dropzone */
    let dropZoneForm
    /** Кнопка закрытия dropzone */
    let divCloseDropZone
    /** css class position dropzone */
    let positionDropAbsolute = 'dropzone-absolute'
    /** Зона затемнения вокруг dropzone, для фокусировки внимания  */
    let wrapper = doc.querySelector('.wrapper-dropzone')
    /**  */
    let submit = doc.getElementById('submit')
    console.log('⚡ elementForm::', elementForm)

    // ------------------->
    // TyneMCE
    // ------------------->
    tinymce.init({
      /** Инициализируем редактор */
      selector: '#content',
      /** Устанавливаем язык редактора */
      language: 'ru',
      icons_url: '/public/js/icons/cloudFRT/icons.js',
      icons: 'cloudFRT', // use icon pack
      min_height: 400,
      // placeholder: 'Ну что начнём творить...',
      plugins:
        'lists advlist anchor link autolink image table preview wordcount searchreplace emoticons fullscreen visualblocks media visualchars quickbars template autoresize pagebreak',
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
      toolbar:
        'fullscreen preview print searchreplace undo redo cut copy paste | bold italic underline strikethrough forecolor backcolor link anchor image media alignleft aligncenter alignright alignjustify numlist bullist table | emoticons wordcount visualblocks visualchars template pagebreak | dropzone typograf format',
      quickbars_selection_toolbar:
        'bold italic | blocks | quicklink blockquote',
      paste_tab_spaces: 2, // Этот параметр определяет, сколько пробелов используется для представления символа табуляции в HTML при вставке обычного текстового содержимого. По умолчанию плагин Paste преобразует каждый символ табуляции в 4 последовательных символа пробела.
      paste_data_images: true,
      //* -------------------> IMAGES <--------------------------------
      file_picker_types: 'file image media',
      // image_caption: true, // figure ->caption
      /* enable title field in the Image dialog*/
      image_title: true, // title=""
      image_advtab: true, // Эта опция добавляет в диалоговое окно изображения вкладку «Дополнительно», позволяющую добавлять к изображениям собственные стили, интервалы и границы.
      a11ychecker_allow_decorative_images: true, //?
      file_picker_callback: function (callback, value, meta) {
        console.log('⚡ callback::', callback)
        console.log('⚡ value::', value)
        console.log('⚡ meta::', meta)
        var input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')

        /* Note: In modern browsers input[type="file"] is functional without even adding it to the DOM, but that might not be the case in some older or quirky browsers like IE, so you might want to add it to the DOM just in case, and visually hide it. And do not forget do remove it once you do not need it anymore. */

        input.onchange = function () {
          var file = this.files[0]
          var reader = new FileReader()

          reader.onload = function () {
            /* Note: Now we need to register the blob in TinyMCEs image blob registry. In the next release this part hopefully won't be necessary, as we are looking to handle it internally. */
            var id = 'blobid' + new Date().getTime()
            var blobCache = tinymce.activeEditor.editorUpload.blobCache
            var base64 = reader.result.split(',')[1]
            var blobInfo = blobCache.create(id, file, base64)
            blobCache.add(blobInfo)

            /* call the callback and populate the Title field with the file name */
            callback(blobInfo.blobUri(), { title: file.name })
          }
          reader.readAsDataURL(file)
        }

        input.click()
      },
      // -------------------> CSS <-------------------
      content_style:
        'figure { padding: 1rem; box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);transition: box-shadow 0.2s ease-in-out; background-color: #fff;background-clip: border-box; border: 1px solid var(rgba(0, 0, 0, 0.125);}',

      setup: (editor) => {
        /** Пункты меню пересоздаются при закрытии и открытии меню, поэтому нам нужна переменная для хранения состояния переключаемого пункта меню */
        let toggleState = false
        //* ************************************
        //* ТИПОГРАФ
        //* ************************************
        editor.ui.registry.addButton('typograf', {
          icon: 'typograf',
          tooltip: 'Типографирование текста',
          onAction() {
            const tiny = tp.execute(editor.getContent())
            tinyMCE.activeEditor.setContent(tiny)
          },
        })

        editor.ui.registry.addButton('format', {
          icon: 'formating',
          tooltip: 'Приведение разметки текста к заданным параметрам',
          onAction() {
            bodyEditor =
              tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById(
                'tinymce',
              )
            htmlFormatting(bodyEditor, validElements)
          },
        })

        editor.ui.registry.addButton('dropzone', {
          icon: 'drag_drop',
          tooltip: 'Зона загрузки изображений',
          onAction() {
            dropZoneForm = dropZoneForm || doc.querySelector('.dropzone-file')
            dropZoneForm.classList.add(positionDropAbsolute)
            /** Кнопка закрыть dropzone */
            divCloseDropZone = divCloseDropZone || doc.createElement('div')
            divCloseDropZone.classList.add('dropzone-close')
            divCloseDropZone.id = 'dc'
            dropZoneForm.appendChild(divCloseDropZone)
            /** Устанавливаем класс для отображения */
            wrapper.classList.toggle('cover')
            divCloseDropZone.addEventListener('click', (e) => {
              dropZoneForm.classList.remove(positionDropAbsolute)
              wrapper.classList.toggle('cover')
            })
          },
        })
      },
    })

    // ──────────────────────────────── DROPZONE ─────────────────────────────────────

    Dropzone.autoDiscover = false
    const dropzone = new Dropzone('.dropzone', {
      dictDefaultMessage: lang.ru.dropzone,
      url: '/upload/article-country',
      method: 'post',
      timeout: 60000,
      // acceptedFiles: 'image/*',
      acceptedFiles: 'image/jpeg, image/png , image/jpg, image/svg',
      thumbnailWidth: 240,
      thumbnailHeight: 240,
      clickable: true,
    })

    dropzone.on('addedfile', (file) => {
      // Add default option box for each preview.
      // var defaultRadioButton = Dropzone.createElement(
      //   '<div class="default_pic_container"><input type="radio" name="default_pic" value="' +
      //     file.name +
      //     '" /> Default</div>',
      // )
      // file.previewElement.appendChild(defaultRadioButton)

      let val = titleInput.value
      if (val.length === 0) {
        // dropzone.off('error')
        dropzone.removeFile(file)
        dropzone.disable()
        titleInput.focus()
        _$.message('error', {
          title: '❗',
          message: 'Перед загрузкой заполните заголовок',
          position: position,
        })
      }
    })

    /**
     *  Вызывается непосредственно перед отправкой каждого файла. Получает объект xhr и объекты formData в качестве второго и третьего параметров, поэтому имеется возможность добавить дополнительные данные. Например, добавить токен CSRF
     */
    dropzone.on('sending', (file, xhr, formData) => {
      // BUG:🐞 Если добавляется несколько файлов то к каждому файлу добавляется значение
      // FIXME: Ко всем файлам один csrf-token
      formData.append('csrf', csrf)
      formData.append('count', count)
      let val = titleInput.value
      if (val.length > 0) {
        formData.append('name', translit(titleInput.value))
      }
    })

    /** Вызывается для каждого файла, который был отклонен, поскольку количество файлов превышает ограничение maxFiles. */
    dropzone.on('maxfilesexceeded', () => {
      //* NOTE: Удаляем файлы к загрузки превысившие лимит по количеству добавляемых к загрузке за один раз
      // upload.removeFile(file)
      maxfilesexceeded = true
      _$.message('error', {
        title: message.limit.title,
        message: message.limit.success,
        position: position,
      })
    })

    // === === === === === === === === === === === ===
    // Вызывается, когда загрузка была успешной или ошибочной.
    // === === === === === === === === === === === ===
    dropzone.on('complete', (file) => {
      if (file.status === 'error' && maxfilesexceeded === false) {
        _$.message('error', {
          title: message.error.title,
          message: message.error.success,
          position: position,
        })
        dropzone.removeFile(file)
      } else if (file.status === 'success') {
        _$.message('success', {
          title: message.success.title,
          message: message.success.done,
          position: position,
        })
      }
    })

    // === === === === === === === === === === === ===
    // Файл был успешно загружен. Получает ответ сервера в качестве второго аргумента.
    // === === === === === === === === === === === ===
    dropzone.on('success', (file, response) => {
      try {
        folder.value = translit(titleInput.value)
        /** Увеличиваем счётчик загруженных изображений на 1 */
        count++
        /** Уникальный id к каждому изображению вставленному в редактор. (Для удаления изображения из редактора) */
        const fileId = file.upload.uuid
        /**  */
        const create = Dropzone.createElement
        /** исходный размер фото */
        const width = file.width
        const height = file.height
        /** Object с уменьшенными копиями изображения */
        const resizeImgObj = response.body.resize
        /** контейнер в котором отображаются детали фото */
        const details = file.previewElement.querySelector('.dz-details')
        /** кнопка Удалить */
        const removeButton = create(
          '<div class="d-flex delete-img"><button type="button" class="remove btn btn-primary btn-sm">Удалить файл</button></div>',
        )
        /** Элемент в котором отображаются превью фото, кнопка удалить и детали фото */
        const preview = file.previewElement
        const size = create(
          `<div class="prev-img-wigth-height"><span>${width} x ${height} px.</span></div>`,
        )
        /** Описание фото исходя из заголовка статьи и количества загрузок */
        const alt = count + '-' + translit(titleInput.value)
        /** добавляем в детали размер изображения */
        details.appendChild(size)
        /** добавляем кнопку удалить фото */
        preview.appendChild(removeButton)

        totalInput.value = count
        total.innerHTML = count
        /** Устанавливаем обработчики события, для вставки изображения в редактор. По клику на изображение, или по его данным */
        _$.delegate(
          preview,
          '.dz-image',
          'click',
          clickImage.bind(
            null,
            resizeImgObj,
            response.body.webpOriginal,
            alt,
            fileId,
          ),
        )
        _$.delegate(
          preview,
          '.dz-details',
          'click',
          clickImage.bind(
            null,
            resizeImgObj,
            response.body.webpOriginal,
            alt,
            fileId,
          ),
        )
        /** Удаление изображения */
        removeButton.addEventListener('click', (e) => {
          e.preventDefault()
          _$.ajax('/article/delete-image', {
            method: 'delete',
            body: {
              files: response.body.files,
              fields: {
                csrf: csrf,
              },
            },
          })
            .then((done) => {
              count--
              total.innerHTML = count
              totalInput.value = count
              deleteUploadFiles(done, file, fileId)
            })
            .catch((error) => error)
        })
      } catch (err) {
        console.log('⚡ err::', err)
      }
    })

    /** Вставляем изображение в редактор */
    function clickImage(resizeImgObj, webpOriginal, width, height) {
      const img = picture(resizeImgObj, webpOriginal, width, height)
      tinyMCE.activeEditor.execCommand('mceInsertContent', false, img)
    }

    /** Удаляем изображения. */
    function deleteUploadFiles(done, file, fileId) {
      if (done.status === 201) {
        _$.message('success', {
          title: message.delete.title,
          message: message.delete.body,
          position: position,
        })
        // count--
        dropzone.removeFile(file)

        let img =
          tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById(
            fileId,
          )
        img.parentNode.removeChild(img)
      }
    }
    /**  */
    function translit(val) {
      return cyrillicToTranslit.transform(val, '-').toLowerCase()
    }
    /**  */
    titleInput.addEventListener('change', (e) => {
      let titleVal = e.target.value
      let trn = translit(titleVal)
      urlInput.value =
        titleVal.length > 0 ? 'country-' + trn + '.html' : titleVal
      dropzone.enable()
    })

    /** Сохраняем статью  */
    submit.addEventListener('click', function (e) {
      /** Заголовок статьи */
      let title = titleInput.value
      /** Контент статьи */
      let content = tinyMCE.activeEditor.getContent()
      /** Статья участвует в поиске */
      let searchable = elementForm.searchable.checked
      /** Папка в которую загружаются изображения */
      let folderImage = folder.value
      /** Сколько всего загруженно изображений */
      let imageTotal = totalInput.value
      let tags = elementForm.tags.value
      let obj = {}
      let i = 0

      if (title.length === 0) {
        _$.message('error', {
          title: '⬅ ',
          message: save.error.title,
          position: position,
        })
      } else {
        /** csrf */
        obj.csrf = csrf
        obj.title = title
        /** Ссылка статьи */
        obj.url = urlInput.value
        /** Если нет материала, то не участвует в поиске */
        obj.searchable = content && searchable ? true : false
        obj.content = content.trim()
        obj.folder = folderImage
        obj.upload_total = imageTotal
        if (folderImage !== '' && imageTotal !== '') {
          let img =
            tinyMCE.activeEditor.iframeElement.contentWindow.document.querySelectorAll(
              'img',
            )
          let arr = Array.prototype.slice.call(img)
          /** Массив изображений вставленных в материал */
          obj.image = arr.map((item, index) => {
            i++
            return item.src
          })
          /** Сколько всего вставлено изображений в материал */
          obj.imageTotalArticle = i
          /** Возможность оценить статью */
          obj.like = elementForm.like.checked
          /** Ключевые слова */
          obj.keyword = elementForm.keyword.value
          /** Описание материала */
          obj.description = elementForm.description.value
          /** Локация */
          obj.location = elementForm.location.value
          /** Отображать количество просмотров */
          obj.numberViews = elementForm.numberViews.checked
          /** Возможность комментировать статью */
          obj.comments = elementForm.comments.checked
          /** Тэги по которым можно найти */
          obj.tags = tags !== '' ? tags.split(',') : []
        }

        console.log('⚡ obj::', obj)
        // console.log('⚡ i::', i)
      }
    })
  })
})()

import '../scss/index.scss'
import { nanoid } from 'nanoid'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import tp from './typograf/index.js'
import { htmlFormatting, validElements } from './html-formatting/index.js'
import { picture } from './upload/picture.js'
import inputFilter from './input-filter.js'
import preloader from 'preloader-js'

// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===
;(async () => {
  let doc = document
  preloader.hide()

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
            location: 'Не указаны географические координаты',
            country: 'Не выбрана страна',
            region: 'Не выбран регион (область, край и т.д.',
            city: 'Не выбран город поселок, село и т.д.',
          },
          success: {
            title: '',
            message: 'Страна добавлена',
          },
        },
        error: {
          country: 'Перед созданием заголовка, выберете страну',
        },
      },
    }
    /** lang SAVE */
    const save = lang.ru.save
    const message = lang.ru.message
    const position = 'topRight'
    let maxfilesexceeded = false

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
      // toolbar_location: 'bottom',
      toolbar_mode: 'scrolling',
      // === === === === === === === === === === === ===
      //
      // === === === === === === === === === === === ===
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',

      plugins:
        'lists advlist anchor link autolink image table preview wordcount searchreplace emoticons fullscreen visualblocks media visualchars quickbars template autoresize pagebreak',
      /**
       * bullist - маркированный список
       * numlist - нумерованный список
       * anchor - якорь
       *  quickimage
       */
      toolbar:
        'fullscreen preview print searchreplace undo redo cut copy paste | bold italic underline strikethrough forecolor backcolor link anchor image media alignleft aligncenter alignright alignjustify numlist bullist table | emoticons wordcount visualblocks visualchars template pagebreak | dropzone typograf format mybutton',

      /** button ⚡️Upgrade */
      promotion: false,
      quickbars_selection_toolbar:
        'bold italic | blocks | quicklink blockquote',
      // autolink
      link_default_target: '_blank',
      link_context_toolbar: true,
      link_default_protocol: 'https',
      // -------------------> CSS <-------------------
      content_style:
        'figure { padding: 1rem; box-shadow: 0 2px 10px -1px rgba(69, 90, 100, 0.3);transition: box-shadow 0.2s ease-in-out; background-color: #fff;background-clip: border-box; border: 1px solid var(rgba(0, 0, 0, 0.125);}',

      setup: (editor) => {
        /** Пункты меню пересоздаются при закрытии и открытии меню, поэтому нам нужна переменная для хранения состояния переключаемого пункта меню */
        let toggleState = false
        editor.ui.registry.addMenuButton('typograf', {
          icon: 'formating',
          // text: 'My button',
          tooltip: 'Типографирование текста',
          fetch: (callback) => {
            const items = [
              {
                type: 'menuitem',
                text: 'Menu item 1',
                onAction: () =>
                  editor.insertContent(
                    '&nbsp;<em>You clicked menu item 1!</em>',
                  ),
              },
              {
                type: 'nestedmenuitem',
                text: 'Menu item 2',
                icon: 'user',
                getSubmenuItems: () => [
                  {
                    type: 'menuitem',
                    text: 'Sub menu item 1',
                    icon: 'unlock',
                    onAction: () =>
                      editor.insertContent(
                        '&nbsp;<em>You clicked Sub menu item 1!</em>',
                      ),
                  },
                  {
                    type: 'menuitem',
                    text: 'Sub menu item 2',
                    icon: 'lock',
                    onAction: () =>
                      editor.insertContent(
                        '&nbsp;<em>You clicked Sub menu item 2!</em>',
                      ),
                  },
                ],
              },
              {
                type: 'togglemenuitem',
                text: 'Toggle menu item',
                onAction: () => {
                  toggleState = !toggleState
                  editor.insertContent(
                    '&nbsp;<em>You toggled a menuitem ' +
                      (toggleState ? 'on' : 'off') +
                      '</em>',
                  )
                },
                onSetup: (api) => {
                  api.setActive(toggleState)
                  return () => {}
                },
              },
            ]
            callback(items)
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
        // Add default option box for each preview.
        var defaultRadioButton = Dropzone.createElement(
          `<div class="d-flex default-pic-container"><input type="radio" class="file-img-default" name="default_pic" value="${response.body.webpOriginal}" /> Основное фото</div>`,
        )
        file.previewElement.appendChild(defaultRadioButton)
        console.log('⚡ file.previewElement::', file.previewElement)
        // file.previewElement.firstChild(defaultRadioButton)
        // imgUpload.push(response.body)
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
        const alt = count + '-' + titleInput.value
        /** добавляем в детали размер изображения */
        details.appendChild(size)
        /** добавляем кнопку удалить фото */
        preview.appendChild(removeButton)
        /**  */
        imgUpload[fileId] = response.body

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
        // TODO: ???
        _$.delegate(preview, '.file-img-default', 'change', function (e) {
          console.log('⚡ e::', e)
        })
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
      // console.log('⚡ imgUpload::', imgUpload)
    })

    /** Вставляем изображение в редактор */
    function clickImage(resizeImgObj, webpOriginal, width, height) {
      const img = picture(resizeImgObj, webpOriginal, width, height)
      tinyMCE.activeEditor.execCommand('mceInsertContent', false, img)
    }

    /** Удаляем изображения. */
    function deleteUploadFiles(done, file, fileId) {
      console.log('⚡ fileId::', fileId)
      if (done.status === 201) {
        _$.message('success', {
          title: message.delete.title,
          message: message.delete.body,
          position: position,
        })

        dropzone.removeFile(file)

        let img =
          tinyMCE.activeEditor.iframeElement.contentWindow.document.getElementById(
            fileId,
          )
        img.parentNode.removeChild(img)
        delete imgUpload[fileId]
      }
    }
  })
})()

import '../scss/index.scss'
import { nanoid } from 'nanoid'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import tp from './typograf/index.js'
import { htmlFormatting, validElements } from './html-formatting/index.js'

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
      },
    }

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
    let bodyEditor

    titleInput.addEventListener('change', (e) => {
      let titleVal = e.target.value
      let trn = cyrillicToTranslit.transform(titleVal, '-').toLowerCase()
      urlInput.value =
        titleVal.length > 0 ? 'country-' + trn + '.html' : titleVal
    })

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
      min_height: 600,
      placeholder: 'Ну что начнём творить...',
      plugins:
        'lists advlist anchor link autolink image table preview wordcount searchreplace emoticons fullscreen visualblocks media visualchars quickbars template autoresize pagebreak',
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
      toolbar:
        'fullscreen preview print searchreplace undo redo cut copy paste | bold italic underline strikethrough forecolor backcolor link anchor image media alignleft aligncenter alignright alignjustify numlist bullist table | emoticons wordcount visualblocks visualchars template pagebreak | typograf format',
      quickbars_selection_toolbar:
        'bold italic | blocks | quicklink blockquote',

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
      },
    })
    // ───────────────────────────────────────────────────────────────────────
    Dropzone.autoDiscover = false
    const dropzone = new Dropzone('.dropzone', {
      dictDefaultMessage: lang.ru.dropzone,
      url: '/upload/article-country',
      method: 'post',
      timeout: 60000,
      acceptedFiles: 'image/*',
      clickable: true,
    })

    /**
     *  Вызывается непосредственно перед отправкой каждого файла. Получает объект xhr и объекты formData в качестве второго и третьего параметров, поэтому имеется возможность добавить дополнительные данные. Например, добавить токен CSRF
     */
    dropzone.on('sending', (file, xhr, formData) => {
      const csrf = document
        .querySelector('meta[name=csrf-token]')
        .getAttributeNode('content').value
      // BUG:🐞 Если добавляется несколько файлов то к каждому файлу добавляется значение
      // FIXME: Ко всем файлам один csrf-token
      //TODO: Ко всем файлам один csrf-token
      formData.append('csrf', csrf)
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
      // FIX: DROPZONE - добавить всплывающее сообщение об неудачной или удачной загрузки файла
      // console.log('⚡ file.status', file.status)
      if (file.status === 'error' && maxfilesexceeded === false) {
        // console.log('⚡ maxfilesexceeded::error', maxfilesexceeded)
        // console.log('complete')
        // console.log('⚡ file', file)
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
      console.log('⚡ file::', file)
      console.log('⚡ response::', response)
    })
  })
})()

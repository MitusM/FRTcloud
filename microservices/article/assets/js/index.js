import '../scss/index.scss'
import { nanoid } from 'nanoid'
// import { prototype } from 'dropzone'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import tp from './typograf/index.js'
import { htmlFormatting, validElements } from './html-formatting/index.js'
// import upload from './upload/index.js'
// console.log('⚡ upload::', upload)
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
      console.log('⚡ titleVal::', titleVal.length)
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
      // quickbars_selection_toolbar:
      //   'bold italic | blocks | quicklink blockquote',

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

    Dropzone.options.myDropzone = {
      dictDefaultMessage: lang.ru.dropzone,
      url: '/upload/article-country',
      method: 'post',
      acceptedFiles: 'image/*',
      // maxFiles: 3, //* лимит на загрузку файлов. Сколько всего можно загрузить файлов
      uploadMultiple: false,
      parallelUploads: 1,
      addRemoveLinks: true,
      withCredentials: true,
      timeout: 3000,
      // url: '/article/upload-country',
      sending: (file, xhr, formData) => {
        const csrf = doc
          .querySelector('meta[name=csrf-token]')
          .getAttributeNode('content').value
        // BUG:🐞 Если добавляется несколько файлов то к каждому файлу добавляется значение
        // FIXME: Ко всем файлам один csrf-token
        //TODO: Ко всем файлам один csrf-token
        formData.append('csrf', csrf)
      },
      success: (file, response) => {
        console.log('⚡ file::', file)
        console.log('⚡ response::', response)
      },
      complete: (file) => {
        console.log('⚡ file::complete', file)
      },
    }
  })
})()

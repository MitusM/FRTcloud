/* global define */
/**
 * [[Description]]
 * Copyright (c) Wed Jan 31 2018 Mitus M.
 * Licensed under the Apache 2.0 license.
 */

const modal = require('dialog-polyfill').default
// import modal from 'dialog-polyfill'
const init = Symbol()
const getElement = Symbol()
const promis = Symbol()

/**
 * @class Dialog
 * @classdesc [[Description]]
 */
class Dialog {
  /**
   * [[Description]]
   * @constructs [[Link]]
   * @param {string|object} elem [[Description]]
   */
  constructor(elem) {
    this.elem =
      typeof elem === 'string'
        ? document.querySelector(elem)
        : typeof elem === 'object'
        ? elem
        : null
    if (this.elem) this[init]()
  }

  /**
   * Получение элемента
   */
  get element() {
    return this.elem
  }

  /**
   * Задаём элемент который будет использован в виде модального или диалогового окна
   */
  set element(elem) {
    this.elem = elem
  }

  /**
   * Задаем заголовок диалогового или модального окна
   * @param   {string} text Текст заголовка
   * @param   {string} elem class или id, внутри диалогово или модального окна. Если не задан то будет находить по умолчанию .modal-title
   * @returns {object} this
   */
  header(text, elem) {
    elem = elem ? this[getElement](elem) : this[getElement]('.modal-title')
    elem.innerHTML = text
    return this
  }

  /**
   * Задаём текст диалогового или модального окна
   * @param   {string} text текст сообщения
   * @param   {string} elem class или id, внутри диалогово или модального окна. Если не задан то будет находить по умолчанию .modal-content
   * @returns {object} this
   */
  content(text, elem) {
    elem = elem ? this[getElement](elem) : this[getElement]('.modal-content')
    elem.innerHTML = text
    return this
  }

  /**
   * Показать модальное или диалоговое окно
   * @param   {function} fn функция которая должна быть выполнена в момент открытия диалогового окна
   * @returns {object}   this
   */
  // NOTE: Если не использовать Promise, то при каждом новом клике на кнопку происходит срабатывание предыдущих событий.
  show(cb) {
    this.elem.showModal()
    // document.querySelector('._dialog_overlay').addEventListener('click', this.close.bind(this))
    if (cb) {
      // cb(this.elem.returnValue)
      this[promis]().then((val) => {
        cb(val)
      })
    }
    return this
  }

  /**
   * Закрыть модальное или диалоговое окно
   */
  close() {
    if (this.elem.hasAttribute('open')) this.elem.close(false)
  }

  /**
   * Инициализация кнопки закрытия диалогового окна и закрытия по клику по затемнению
   * @returns {object} this
   */
  // TODO: Добавить выбор вывода окна show() или showModal(). Если showModal() то только тогда инициализация overlay 📌
  initClose() {
    this[getElement]('#modal-close').addEventListener(
      'click',
      this.close.bind(this),
    )
    return this
  }

  /**
   * Инициализация диалогового или модального окна
   * @private
   */
  [init]() {
    modal.registerDialog(this.elem)
  }

  /**
   * Находим элементы внутри диалогового окна
   * @param {string} selector class или id (.class | #id)
   * @private
   */
  [getElement](selector) {
    return this.elem.querySelector(selector)
  }

  /**
   * Promise
   * @private
   */
  [promis]() {
    return new Promise((resolve) => {
      this.elem.addEventListener('close', () => {
        // e.preventDefault()
        // e.stopImmediatePropagation()
        resolve(this.elem.returnValue)
      })
    })
  }
}
// window.Dialog = Dialog
// module.exports = Dialog
// if (typeof define === 'function' && define.amd) {
//   define('Dialog', [], function () {
//     return Dialog
//   })
// } else if (typeof exports !== 'undefined' && !exports.nodeType) {
//   if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
//     // eslint-disable-next-line no-global-assign
//     exports = module.exports = Dialog
//   }
//   exports.default = Dialog
// }

export default Dialog

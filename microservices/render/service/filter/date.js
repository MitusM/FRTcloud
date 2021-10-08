/**
 * filter for Nunjucks
 * Copyright (c) Thu Jan 25 2018 Mitus M.
 * Licensed under the Apache 2.0 license.
 */
'use strict'

// const moment = require('moment')
const nunjucks = require('nunjucks')
const dateFormat = require('./date-format')

/**
 * фильтр Nunjucks для трансформации даты
 * <http://momentjs.com/docs/>
 * использование {{ user.created | date() }} user.created - дата которую форматируем в нужный формат, по умолчанию используется 'DD MMMM YYYY h:mm. Так же по умолчанию русская локализация.
 * Для изменения формата вывода {{ user.created | date('dddd') }}
 * Для изменения формата вывода и локали {{ user.created | date('dddd', 'en') }}
 */
// function dateFormat (date, format, locale) {
// TODO: Добавить возможность манипуляции датой кроме форматирования 📌
// TODO: Добавить задания локали без шаблона формата вывода даты 📌
//   format = format || 'DD MMMM YYYY h:mm'
//   locale = locale || 'ru'
//   return moment(date).locale(locale).format(format)
// }

module.exports = dateFormat

// install the filter to nunjucks environment
module.exports.install = function (env, customName) {
  (env || nunjucks.configure()).addFilter(customName || 'date', dateFormat)
}
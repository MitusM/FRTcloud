'use strict'

const moment = require('moment')

let dateFormat = (date, format, locale) => {
  format = format || 'DD MMMM YYYY h:mm'
  locale = locale || 'ru'
  return moment(date).locale(locale).format(format)
}

module.exports = dateFormat

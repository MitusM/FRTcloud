import * as crypto from 'crypto'

/**
 * Фильтруем размеры. Оставляем только те что меньше заданного
 * @param {array} arr массив с размерами по ширине
 * @param {number} width ширина относительно которого фильтруем
 */
const minFilter = (arr, width) => {
  return arr.filter((w) => w <= width)
}

const arrayToObject = (arr, name) => {
  return arr.reduce((obj, item) => {
    return (obj[item[name]] = item), obj
  }, {})
}

let extend = function () {
  let merge = {}
  Array.prototype.forEach.call(arguments, function (obj) {
    for (let key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (!obj.hasOwnProperty(key)) return
      merge[key] = obj[key]
    }
  })
  return merge
}

/**
 * Динамическое исключение свойств.
 * Функция removeProperty берёт props как аргумент.Используя вычисление имен свойств prop может быть исключен динамически из объекта клона.
 * @param {object} prop 
 * @returns {object} клон объекта с исключенным свойством
 * @example const user = {id: 100, name: 'Howard Moon', password: 'query'}

 */
const removeProperty =
  (prop) =>
  ({
    // eslint-disable-next-line no-unused-vars
    [prop]: _,
    ...rest
  }) =>
    rest

// [].concat.apply([], [sizes[0], sizes[1]]))
const concat = function (args) {
  args = Array.prototype.slice.call(arguments)
  return Array.prototype.concat(...args)
}

/**
 *
 * @param  {...any} args arguments
 * @returns {array}
 */
const arrArguments = function (...args) {
  let number = Number(args[1]) || 0
  return [].slice.call(...args, number)
}

const promisify = function promisify(func, args) {
  return new Promise((resolve, reject) => {
    func.apply(null, [
      ...args,
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      },
    ])
  })
}

const generateChecksum = function (str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

const util = {}

util.minFilter = minFilter
util.arrayToObject = arrayToObject
util.removeProperty = removeProperty
util.extend = extend
util.concat = concat
util.arrArguments = arrArguments
util.promisify = promisify
util.generateChecksum = generateChecksum

// module.exports = util
export default util

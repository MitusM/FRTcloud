/**
 * Фильтруем размеры. Оставляем только те что меньше заданного 
 * @param {array} arr массив с размерами по ширине
 * @param {number} width ширина относительно которого фильтруем
 */
const minFilter = (arr, width) => {
  return arr.filter(w => w <= width)
}

const arrayToObject = (arr, name) => {
  return arr.reduce((obj, item) => {
    return (obj[item[name]] = item, obj)
  }, {})
}

let extend = function () {
  let merge = {}
  Array.prototype.forEach.call(arguments, function (obj) {
    for (let key in obj) {
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
const removeProperty = prop => ({
  // eslint-disable-next-line no-unused-vars
  [prop]: _,
  ...rest
}) => rest

// [].concat.apply([], [sizes[0], sizes[1]]))
const concat = function (args) {
  args = Array.prototype.slice.call(arguments)
  // console.log('⚡ args', args.join().split(','))
  // return [].concat.apply([], [...args])
  // return args.join().split(',')
  return Array.prototype.concat(...args)
  // return args.reduce((merged, block) => {
  //   merged.push(...block);
  //   return merged;
  // }, []);
  //   .reduce((prev, next) => {
  //   return prev.concat(next);
  // }, []);
}

const util = {}

util.minFilter = minFilter
util.arrayToObject = arrayToObject
util.removeProperty = removeProperty
util.extend = extend
util.concat = concat

module.exports = util